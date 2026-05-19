import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifySiren } from "@/lib/siren";

const InscriptionSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email().max(255),
  phone: z.string().max(20).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  postal_code: z.string().max(10).optional().nullable(),
  siren: z.string().regex(/^\d{9}$/, "SIREN doit faire 9 chiffres"),
  metier_ids: z.array(z.number().int().positive()).min(1).max(5),
  description: z.string().max(1000).optional().nullable(),
  // Référent parrainage (optionnel)
  ref: z.string().max(24).optional().nullable(),
});

function generateClientNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
  return `BIS-${year}-${random}`;
}

function generateReferralCode(name: string): string {
  const parts = name.trim().split(/[\s\-]+/);
  const initials =
    ((parts[0]?.[0] ?? "B") + (parts[1]?.[0] ?? "I"))
      .toUpperCase()
      .replace(/[^A-Z]/g, "X")
      .padEnd(2, "X");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${initials}-${suffix}`;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body JSON invalide" }, { status: 400 });
  }

  const parsed = InscriptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const supabase = createSupabaseAdminClient();

  // 1. Email déjà utilisé ?
  const { data: existingByEmail } = await supabase
    .from("users")
    .select("id")
    .eq("email", data.email)
    .is("deleted_at", null)
    .maybeSingle();

  if (existingByEmail) {
    return NextResponse.json(
      { error: "Un compte existe déjà avec cet email." },
      { status: 409 },
    );
  }

  // 2. SIREN déjà utilisé ?
  const { data: existingBySiren } = await supabase
    .from("users")
    .select("id")
    .eq("siren", data.siren)
    .is("deleted_at", null)
    .maybeSingle();

  if (existingBySiren) {
    return NextResponse.json(
      { error: "Un compte existe déjà avec ce SIREN." },
      { status: 409 },
    );
  }

  // 3. Vérification SIREN auprès du registre officiel
  const sirenCheck = await verifySiren(data.siren);
  if (!sirenCheck.found) {
    return NextResponse.json(
      { error: "Ce SIREN ne correspond à aucune entreprise enregistrée." },
      { status: 422 },
    );
  }
  if (sirenCheck.status && sirenCheck.status !== "A") {
    return NextResponse.json(
      { error: "Cette entreprise est référencée mais cessée." },
      { status: 422 },
    );
  }

  // 4. Récupération du parrain (si ref)
  let referrerId: number | null = null;
  if (data.ref) {
    const { data: referrer } = await supabase
      .from("users")
      .select("id")
      .eq("referral_code", data.ref.toUpperCase())
      .maybeSingle();
    referrerId = referrer?.id ?? null;
  }

  // 5. Création du user (génération client_number + referral_code)
  const cityValue = [data.postal_code, data.city].filter(Boolean).join(" ") || null;
  const displayName = sirenCheck.company_name ?? data.name;

  const { data: created, error: createErr } = await supabase
    .from("users")
    .insert({
      client_number: generateClientNumber(),
      referral_code: generateReferralCode(displayName),
      referred_by_user_id: referrerId,
      name: displayName,
      email: data.email,
      phone: data.phone ?? null,
      city: cityValue,
      description: data.description ?? null,
      role: "artisan",
      siren: data.siren,
      siren_status: sirenCheck.status,
      siren_last_checked_at: new Date().toISOString(),
      validation_status: "pending",
    })
    .select("id, client_number, referral_code, name, email")
    .single();

  if (createErr || !created) {
    console.error("[inscription] create user", createErr);
    return NextResponse.json(
      { error: "Impossible de créer le compte. Réessaie plus tard." },
      { status: 500 },
    );
  }

  // 6. Création du profil artisan
  const { data: profile, error: profileErr } = await supabase
    .from("artisan_profiles")
    .insert({
      user_id: created.id,
      metier_id: data.metier_ids[0], // métier principal
      company_name: sirenCheck.company_name,
      is_active: true,
    })
    .select("id")
    .single();

  if (profileErr || !profile) {
    console.error("[inscription] create profile", profileErr);
    // Rollback : supprimer le user (cascade le fera ailleurs)
    await supabase.from("users").delete().eq("id", created.id);
    return NextResponse.json(
      { error: "Impossible de créer le profil artisan." },
      { status: 500 },
    );
  }

  // 7. Liaison many-to-many des métiers
  const pivotRows = data.metier_ids.map((mid) => ({
    artisan_profile_id: profile.id,
    metier_id: mid,
  }));
  await supabase.from("artisan_profile_metier").insert(pivotRows);

  // 8. Tracking parrainage
  if (referrerId) {
    await supabase.from("referrals").insert({
      referrer_id: referrerId,
      referred_user_id: created.id,
      referral_code: data.ref!,
      status: "signed_up",
      signed_up_at: new Date().toISOString(),
    });
  }

  return NextResponse.json({
    success: true,
    user: {
      id: created.id,
      client_number: created.client_number,
      referral_code: created.referral_code,
      name: created.name,
      email: created.email,
    },
    siren: {
      company_name: sirenCheck.company_name,
      legal_form: sirenCheck.legal_form,
      activity_code: sirenCheck.activity_code,
    },
  });
}
