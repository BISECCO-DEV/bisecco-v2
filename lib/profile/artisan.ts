"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/db/current-user";

export type ArtisanProfileState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

const activiteSchema = z.object({
  metier_ids: z.array(z.coerce.number().int().positive()).min(1, "Au moins un métier").max(3, "Maximum 3 métiers"),
  company_name: z.string().trim().max(200).optional().or(z.literal("")),
  service_radius: z.coerce.number().int().min(0).max(500).optional().nullable(),
  availability: z.string().trim().max(200).optional().or(z.literal("")),
});

/** Récupère le profil artisan principal (is_active=true) du user connecté. */
export async function getMyArtisanProfile() {
  const user = await getCurrentUser();
  if (!user || user.id == null || user.role !== "artisan") return null;

  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("artisan_profiles")
    .select("id, metier_id, company_name, service_radius, availability, latitude, longitude")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  return data;
}

/** Récupère tous les métiers actuellement liés à l'artisan (multi). */
export async function getMyArtisanMetierIds(): Promise<number[]> {
  const profile = await getMyArtisanProfile();
  if (!profile) return [];
  const admin = createSupabaseAdminClient();
  const ids = new Set<number>();
  if (profile.metier_id) ids.add(profile.metier_id);
  const { data } = await admin
    .from("artisan_profile_metier")
    .select("metier_id")
    .eq("artisan_profile_id", profile.id);
  for (const row of data ?? []) ids.add(row.metier_id);
  return Array.from(ids);
}

export async function updateActiviteAction(
  _prev: ArtisanProfileState | undefined,
  formData: FormData,
): Promise<ArtisanProfileState> {
  const user = await getCurrentUser();
  if (!user || user.id == null) return { error: "Vous devez être connecté." };
  if (user.role !== "artisan") {
    return { error: "Réservé aux artisans." };
  }

  // Récupérer les métiers (envoyés en JSON)
  let metierIds: number[] = [];
  try {
    const raw = formData.get("metier_ids");
    if (typeof raw === "string") metierIds = JSON.parse(raw);
  } catch {
    return { error: "Format de métiers invalide." };
  }

  const parsed = activiteSchema.safeParse({
    metier_ids: metierIds,
    company_name: formData.get("company_name") ?? "",
    service_radius: formData.get("service_radius") || null,
    availability: formData.get("availability") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as string;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Champs invalides.", fieldErrors };
  }

  const { metier_ids, company_name, service_radius, availability } = parsed.data;
  const metier_id = metier_ids[0]; // métier principal

  const admin = createSupabaseAdminClient();

  // Vérifier qu'on a un profile, sinon le créer
  const { data: existing } = await admin
    .from("artisan_profiles")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  let profileId: number | undefined;
  if (existing) {
    profileId = existing.id;
    const { error } = await admin
      .from("artisan_profiles")
      .update({
        metier_id,
        company_name: company_name || null,
        service_radius: service_radius ?? null,
        availability: availability || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    if (error) return { error: "Erreur lors de la mise à jour." };
  } else {
    const { data: created, error } = await admin
      .from("artisan_profiles")
      .insert({
        user_id: user.id,
        metier_id,
        company_name: company_name || null,
        service_radius: service_radius ?? null,
        availability: availability || null,
        is_active: true,
      })
      .select("id")
      .single();
    if (error || !created) return { error: "Erreur lors de la création." };
    profileId = created.id;
  }

  // Sync table join artisan_profile_metier
  await admin.from("artisan_profile_metier").delete().eq("artisan_profile_id", profileId);
  if (metier_ids.length > 0) {
    await admin.from("artisan_profile_metier").insert(
      metier_ids.map((mid) => ({ artisan_profile_id: profileId!, metier_id: mid })),
    );
  }

  revalidatePath("/mon-profil/edit");
  revalidatePath("/mon-profil");
  return { ok: true };
}

// =====================================================================
// Services
// =====================================================================

const serviceSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(150),
  price: z.string().trim().max(50).optional().or(z.literal("")),
});

const servicesSchema = z.object({
  services: z.array(serviceSchema).max(20, "Maximum 20 services"),
});

export type ServicesState = {
  ok?: boolean;
  error?: string;
};

export type ServiceRow = { id: number; name: string; price: string | null };

export async function listMyServices(): Promise<ServiceRow[]> {
  const profile = await getMyArtisanProfile();
  if (!profile) return [];
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("services")
    .select("id, name, price")
    .eq("artisan_profile_id", profile.id)
    .order("id", { ascending: true });
  return data ?? [];
}

/**
 * Remplace tous les services de l'artisan par la liste fournie.
 * (delete-all + insert-all · simple et correct pour la V1)
 */
export async function setServicesAction(
  _prev: ServicesState | undefined,
  formData: FormData,
): Promise<ServicesState> {
  const user = await getCurrentUser();
  if (!user || user.id == null) return { error: "Vous devez être connecté." };
  if (user.role !== "artisan") return { error: "Réservé aux artisans." };

  const profile = await getMyArtisanProfile();
  if (!profile) {
    return { error: "Configurez d'abord votre activité (métier)." };
  }

  // Désérialiser le JSON envoyé depuis le client
  const rawJson = formData.get("services");
  if (typeof rawJson !== "string") return { error: "Données manquantes." };

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawJson);
  } catch {
    return { error: "Format invalide." };
  }

  const parsed = servicesSchema.safeParse({ services: parsedJson });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  const admin = createSupabaseAdminClient();

  // delete-all
  const { error: delErr } = await admin
    .from("services")
    .delete()
    .eq("artisan_profile_id", profile.id);
  if (delErr) return { error: "Erreur de suppression." };

  // insert-all (si non vide)
  if (parsed.data.services.length > 0) {
    const rows = parsed.data.services.map((s) => ({
      artisan_profile_id: profile.id,
      name: s.name,
      price: s.price || null,
    }));
    const { error: insErr } = await admin.from("services").insert(rows);
    if (insErr) return { error: "Erreur d'enregistrement." };
  }

  revalidatePath("/mon-profil/edit");
  revalidatePath("/mon-profil");
  return { ok: true };
}
