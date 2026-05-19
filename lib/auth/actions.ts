"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifySiren } from "@/lib/siren";

export type AuthState = { error?: string; success?: string } | undefined;

function generateClientNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0");
  return `BIS-${year}-${random}`;
}

function generateReferralCode(name: string): string {
  const parts = name.trim().split(/[\s\-]+/);
  const initials = ((parts[0]?.[0] ?? "B") + (parts[1]?.[0] ?? "I"))
    .toUpperCase()
    .replace(/[^A-Z]/g, "X")
    .padEnd(2, "X");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `${initials}-${suffix}`;
}

/**
 * Vérifie un hash bcrypt legacy Laravel ($2y$...).
 * Les hashes Laravel utilisent $2y$ ; bcryptjs accepte aussi $2a$/$2b$.
 * On normalise le préfixe pour être safe.
 */
async function verifyLegacyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const normalized = hash.startsWith("$2y$") ? "$2a$" + hash.slice(4) : hash;
    return await bcrypt.compare(password, normalized);
  } catch {
    return false;
  }
}

/**
 * Migre un utilisateur legacy (présent dans public.users mais pas dans auth.users)
 * vers Supabase Auth en réutilisant son mot de passe Laravel vérifié.
 * Retourne true si la migration a réussi.
 */
async function migrateLegacyUser(email: string, password: string): Promise<boolean> {
  const admin = createSupabaseAdminClient();

  // Récupérer le user legacy avec son hash de mot de passe
  const { data: legacy } = await admin
    .from("users")
    .select("id, email, password, name, role, validation_status")
    .ilike("email", email)
    .is("deleted_at", null)
    .maybeSingle();

  if (!legacy || !legacy.password) return false;

  // Vérifier le hash Laravel
  const ok = await verifyLegacyPassword(password, legacy.password);
  if (!ok) return false;

  // Créer l'utilisateur dans Supabase Auth avec le même mot de passe
  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // déjà vérifié par l'inscription d'origine
    user_metadata: {
      full_name: legacy.name,
      role: legacy.role,
      migrated_from_legacy: true,
    },
  });

  if (error || !created.user) {
    // Si l'user existe déjà dans auth.users (test précédent, reset partiel...),
    // on met à jour son mot de passe pour qu'il corresponde au mdp legacy vérifié.
    if (error?.message?.toLowerCase().includes("already")) {
      try {
        const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
        const existing = list.users.find((u) => u.email?.toLowerCase() === email);
        if (existing) {
          await admin.auth.admin.updateUserById(existing.id, { password });
          // Nettoyer le hash legacy
          await admin
            .from("users")
            .update({ password: null, updated_at: new Date().toISOString() })
            .eq("id", legacy.id);
          return true;
        }
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  }

  // Nettoyer le hash legacy (Auth devient source de vérité)
  await admin
    .from("users")
    .update({ password: null, updated_at: new Date().toISOString() })
    .eq("id", legacy.id);

  return true;
}

/** Connexion email/password (avec auto-migration legacy si nécessaire) */
export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!email || !password) return { error: "Email et mot de passe requis." };

  const supabase = await createClient();

  // 1ère tentative : Supabase Auth standard
  const first = await supabase.auth.signInWithPassword({ email, password });

  if (!first.error) {
    revalidatePath("/", "layout");
    redirect("/mon-profil");
  }

  // Échec : tenter une migration legacy (user dans public.users avec hash Laravel)
  const migrated = await migrateLegacyUser(email, password);
  if (!migrated) {
    // Vérifier s'il s'agit d'un compte legacy sans password (importé depuis V1)
    const admin = createSupabaseAdminClient();
    const { data: legacy } = await admin
      .from("users")
      .select("id, password")
      .ilike("email", email)
      .is("deleted_at", null)
      .maybeSingle();

    if (legacy && legacy.password == null) {
      return {
        error:
          "Votre compte a été migré depuis l'ancienne version. Cliquez sur « Mot de passe oublié ? » pour définir votre nouveau mot de passe.",
      };
    }

    return { error: "Email ou mot de passe incorrect." };
  }

  // Re-tenter le sign-in après migration
  const second = await supabase.auth.signInWithPassword({ email, password });
  if (second.error) {
    return { error: "Compte migré, mais erreur de connexion. Réessayez." };
  }

  revalidatePath("/", "layout");
  redirect("/mon-profil");
}

/** Inscription email/password + création de la ligne dans public.users */
export async function signupAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();
  const role = (formData.get("role")?.toString() || "particulier") as "particulier" | "artisan";

  if (!email || !password) return { error: "Email et mot de passe requis." };
  if (password.length < 8) return { error: "Le mot de passe doit faire 8 caractères minimum." };

  const admin = createSupabaseAdminClient();

  // ── Cas ARTISAN : SIREN obligatoire ─────────────────────────────
  if (role === "artisan") {
    const fullName = formData.get("full_name")?.toString().trim();
    const companyName = formData.get("company_name")?.toString().trim();
    const sirenRaw = formData.get("siren")?.toString().replace(/\s/g, "");
    const metiersJsonRaw = formData.get("metiers_json")?.toString().trim() || "[]";
    const phone = formData.get("phone")?.toString().trim() || null;
    const city = formData.get("city")?.toString().trim() || null;

    // Parse les métiers (jusqu'à 3, peuvent être custom)
    type MetierPickInput = { name: string; slug: string | null; isCustom?: boolean };
    let metiersPicked: MetierPickInput[] = [];
    try {
      const parsed = JSON.parse(metiersJsonRaw);
      if (Array.isArray(parsed)) {
        metiersPicked = parsed
          .filter((m): m is MetierPickInput => m && typeof m.name === "string")
          .slice(0, 3); // sécurité serveur : max 3
      }
    } catch {
      // ignore
    }

    if (!fullName || !companyName || !sirenRaw || metiersPicked.length === 0) {
      return { error: "Tous les champs entreprise sont obligatoires (au moins 1 métier)." };
    }
    if (!/^\d{9}$/.test(sirenRaw)) {
      return { error: "Le SIREN doit faire 9 chiffres." };
    }

    // Email / SIREN déjà pris ?
    const { data: dupeEmail } = await admin
      .from("users").select("id").eq("email", email).is("deleted_at", null).maybeSingle();
    if (dupeEmail) return { error: "Un compte existe déjà avec cet email." };

    const { data: dupeSiren } = await admin
      .from("users").select("id").eq("siren", sirenRaw).is("deleted_at", null).maybeSingle();
    if (dupeSiren) return { error: "Un compte existe déjà avec ce SIREN." };

    // Vérification SIREN INSEE
    const sirenCheck = await verifySiren(sirenRaw);
    if (!sirenCheck.found) {
      return { error: "Ce SIREN ne correspond à aucune entreprise enregistrée." };
    }
    if (sirenCheck.status && sirenCheck.status !== "A") {
      return { error: "Cette entreprise est référencée mais cessée." };
    }

    // Résolution des métiers : existants par slug, sinon création custom
    const slugifyName = (s: string) =>
      s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 80);

    const resolvedMetierIds: number[] = [];
    for (const pick of metiersPicked) {
      const slug = pick.slug ?? slugifyName(pick.name);
      // 1) Cherche par slug existant
      const { data: existing } = await admin
        .from("metiers")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (existing?.id) {
        resolvedMetierIds.push(existing.id);
        continue;
      }

      // 2) Pas trouvé → crée un nouveau métier (catégorie "Services" par défaut, à modérer)
      const { data: created } = await admin
        .from("metiers")
        .insert({
          name: pick.name.slice(0, 255),
          slug,
          category: "Services",
          icon: "🔧",
          description: "Métier ajouté par un artisan, en attente de validation admin.",
        })
        .select("id")
        .single();

      if (created?.id) resolvedMetierIds.push(created.id);
    }

    if (resolvedMetierIds.length === 0) {
      return { error: "Impossible de résoudre les métiers. Réessaie." };
    }

    const primaryMetierId = resolvedMetierIds[0]!;

    // Crée le user Supabase Auth (avec email confirmé pour MVP)
    const { data: authUser, error: authErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: { full_name: fullName, role: "artisan" },
    });
    if (authErr || !authUser.user) {
      return { error: authErr?.message ?? "Échec de création du compte." };
    }

    // Crée le user public.users
    const { data: created, error: createErr } = await admin
      .from("users")
      .insert({
        client_number: generateClientNumber(),
        referral_code: generateReferralCode(companyName || fullName),
        name: `${fullName} - ${companyName}`,
        email,
        phone,
        city,
        role: "artisan",
        siren: sirenRaw,
        siren_status: sirenCheck.status,
        siren_last_checked_at: new Date().toISOString(),
        validation_status: "pending",
      })
      .select("id")
      .single();

    if (createErr || !created) {
      // Rollback auth user
      await admin.auth.admin.deleteUser(authUser.user.id);
      return { error: "Impossible de créer le profil. Réessaie." };
    }

    // Crée le profil artisan (métier principal = premier de la liste)
    const { data: profile } = await admin
      .from("artisan_profiles")
      .insert({
        user_id: created.id,
        metier_id: primaryMetierId,
        company_name: companyName,
        is_active: true,
      })
      .select("id")
      .single();

    // Insère TOUS les métiers dans la pivot (jusqu'à 3)
    if (profile) {
      const pivotRows = resolvedMetierIds.map((mid) => ({
        artisan_profile_id: profile.id,
        metier_id: mid,
      }));
      await admin.from("artisan_profile_metier").insert(pivotRows);
    }

    // Connexion automatique
    const supa = await createClient();
    await supa.auth.signInWithPassword({ email, password });
    revalidatePath("/", "layout");
    redirect("/mon-profil?welcome=artisan");
  }

  // ── Cas PARTICULIER ─────────────────────────────────────────────
  const firstName = formData.get("first_name")?.toString().trim() ?? "";
  const lastName = formData.get("last_name")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() || null;
  const city = formData.get("city")?.toString().trim() || null;
  const fullName = `${firstName} ${lastName}`.trim() || email.split("@")[0];

  const { data: dupeEmail } = await admin
    .from("users").select("id").eq("email", email).is("deleted_at", null).maybeSingle();
  if (dupeEmail) return { error: "Un compte existe déjà avec cet email." };

  const { data: authUser, error: authErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
    user_metadata: { full_name: fullName, role: "particulier" },
  });
  if (authErr || !authUser.user) {
    return { error: authErr?.message ?? "Échec de création du compte." };
  }

  const { error: createErr } = await admin.from("users").insert({
    client_number: generateClientNumber(),
    referral_code: generateReferralCode(fullName),
    name: fullName,
    email,
    phone,
    city,
    role: "particulier",
    validation_status: "approved", // particuliers auto-validés
    validated_at: new Date().toISOString(),
  });

  if (createErr) {
    await admin.auth.admin.deleteUser(authUser.user.id);
    return { error: "Impossible de créer le compte. Réessaie." };
  }

  const supa = await createClient();
  await supa.auth.signInWithPassword({ email, password });
  revalidatePath("/", "layout");
  redirect("/mon-profil?welcome=particulier");
}

/**
 * Demande de réinitialisation de mot de passe.
 * Gère 3 cas :
 *  - User dans auth.users → reset normal
 *  - User dans public.users seulement (legacy) → crée d'abord l'auth user puis reset
 *  - Aucun user → réponse silencieuse (pas de leak d'existence)
 */
export async function requestPasswordResetAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  if (!email) return { error: "Email requis." };

  const admin = createSupabaseAdminClient();
  const supabase = await createClient();

  // Vérifier si user existe dans auth.users via admin
  // (on ne peut pas lister les users facilement, on tente directement)
  let authUserExists = false;
  try {
    const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    authUserExists = list.users.some((u) => u.email?.toLowerCase() === email);
  } catch {
    // ignore — on retombera sur le path "création"
  }

  // Si pas dans auth.users, vérifier public.users (legacy)
  if (!authUserExists) {
    const { data: legacy } = await admin
      .from("users")
      .select("id, name, role, email")
      .ilike("email", email)
      .is("deleted_at", null)
      .maybeSingle();

    if (legacy) {
      // Créer le compte Auth avec mot de passe temporaire random
      const tempPassword = `Bsc-${Math.random().toString(36).slice(2)}-${Date.now()}`;
      const { error: createErr } = await admin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          full_name: legacy.name,
          role: legacy.role,
          migrated_from_legacy: true,
        },
      });
      if (createErr && !createErr.message?.toLowerCase().includes("already")) {
        console.log("[reset] createUser error:", createErr.message);
        // On retourne quand même success pour ne pas leak
        return { success: "Si un compte existe, un email a été envoyé." };
      }
    }
  }

  // Envoyer le mail de reset (dans tous les cas — Supabase no-op si user absent)
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reinitialiser-mot-de-passe`,
  });

  if (error) {
    console.log("[reset] resetPasswordForEmail error:", error.message);
  }

  // Réponse uniforme : ne pas leak l'existence
  return { success: "Si un compte existe, vous recevrez un email avec un lien de réinitialisation." };
}

/** Déconnexion */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

/** Connexion OAuth Google */
export async function googleLoginAction() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error || !data.url) redirect("/connexion?error=oauth");
  redirect(data.url);
}
