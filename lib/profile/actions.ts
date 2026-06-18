"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/db/current-user";

export type UpdateProfileState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof UpdateProfileInput, string>>;
};

const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(120),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[\d\s+().-]*$/, "Numéro invalide")
    .optional()
    .or(z.literal("")),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  street_address: z.string().trim().max(200).optional().or(z.literal("")),
  latitude: z.coerce.number().min(-90).max(90).optional().or(z.literal(NaN)),
  longitude: z.coerce.number().min(-180).max(180).optional().or(z.literal(NaN)),
  contact_via_email: z.coerce.boolean().optional(),
  contact_via_phone: z.coerce.boolean().optional(),
  public_contact_email: z
    .string()
    .trim()
    .email("Email invalide")
    .max(191)
    .optional()
    .or(z.literal("")),
});

type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/**
 * Met à jour le profil de l'utilisateur connecté.
 * Champs autorisés : name, phone, city, description.
 * (email/siren/role/validation_status verrouillés côté serveur)
 */
export async function updateProfileAction(
  _prev: UpdateProfileState | undefined,
  formData: FormData,
): Promise<UpdateProfileState> {
  const user = await getCurrentUser();
  if (!user || user.id == null) {
    return { error: "Vous devez être connecté." };
  }

  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone") ?? "",
    city: formData.get("city") ?? "",
    description: formData.get("description") ?? "",
    street_address: formData.get("street_address") ?? "",
    latitude: formData.get("latitude") ?? "",
    longitude: formData.get("longitude") ?? "",
    contact_via_email: formData.get("contact_via_email") === "on" || formData.get("contact_via_email") === "true",
    contact_via_phone: formData.get("contact_via_phone") === "on" || formData.get("contact_via_phone") === "true",
    public_contact_email: formData.get("public_contact_email") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: UpdateProfileState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof UpdateProfileInput;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Certains champs sont invalides.", fieldErrors };
  }

  const {
    name, phone, city, description, street_address, latitude, longitude,
    contact_via_email, contact_via_phone, public_contact_email,
  } = parsed.data;
  const hasCoords = Number.isFinite(latitude) && Number.isFinite(longitude);

  // Pour les pros : au moins UN canal de contact doit être actif
  // (si les 2 toggles sont décochés, on force email par défaut)
  let effectiveEmail = contact_via_email;
  let effectivePhone = contact_via_phone;
  if (user.role === "artisan" && effectiveEmail === false && effectivePhone === false) {
    effectiveEmail = true;
  }
  // Si téléphone activé mais pas de numéro → on refuse
  if (user.role === "artisan" && effectivePhone === true && !phone) {
    return {
      error: "Pour être joignable par téléphone, renseigne ton numéro.",
      fieldErrors: { phone: "Numéro requis pour activer le contact téléphonique." },
    };
  }

  const admin = createSupabaseAdminClient();
  const update: Record<string, unknown> = {
    name,
    phone: phone || null,
    city: city || null,
    description: description || null,
    updated_at: new Date().toISOString(),
  };
  if (street_address !== undefined) {
    update.street_address = street_address || null;
  }
  if (hasCoords) {
    update.latitude = latitude;
    update.longitude = longitude;
  }
  // Préférences contact (pros uniquement, mais on n'efface jamais pour un particulier)
  if (user.role === "artisan") {
    update.contact_via_email = effectiveEmail;
    update.contact_via_phone = effectivePhone;
    update.public_contact_email = public_contact_email || null;
  }

  let { error } = await admin.from("users").update(update).eq("id", user.id);

  // Fallback : si une migration récente n'a pas été appliquée (lat/lng,
  // street_address, contact_via_*…), on retombe sur les champs historiques.
  if (error && /column .* does not exist/i.test(error.message)) {
    const legacyUpdate = {
      name: update.name,
      phone: update.phone,
      city: update.city,
      description: update.description,
      updated_at: update.updated_at,
    };
    const retry = await admin.from("users").update(legacyUpdate).eq("id", user.id);
    error = retry.error;
  }

  if (error) {
    return { error: "Erreur lors de l'enregistrement. Réessayez." };
  }

  // Pour les artisans : synchronise aussi artisan_profiles.latitude/longitude
  if (hasCoords && user.role === "artisan") {
    await admin
      .from("artisan_profiles")
      .update({ latitude, longitude })
      .eq("user_id", user.id);
  }

  revalidatePath("/mon-profil");
  revalidatePath("/mon-profil/edit");
  return { ok: true };
}

// =====================================================================
// Upload photos (avatar / cover)
// =====================================================================

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const BUCKET = "user-uploads";

export type UploadPhotoState = {
  ok?: boolean;
  error?: string;
  url?: string;
};

type PhotoKind = "avatar" | "cover";

function extFromMime(mime: string): string {
  switch (mime) {
    case "image/jpeg": return "jpg";
    case "image/png": return "png";
    case "image/webp": return "webp";
    case "image/avif": return "avif";
    default: return "jpg";
  }
}

/**
 * Upload une photo de profil ou de couverture pour l'utilisateur connecté.
 * Path : {auth_id}/{kind}.{ext}  (écrase la précédente si même clé)
 * Met à jour la colonne `profile_photo` ou `cover_photo` de la table users.
 */
async function uploadPhoto(
  kind: PhotoKind,
  formData: FormData,
): Promise<UploadPhotoState> {
  const user = await getCurrentUser();
  if (!user || user.id == null) {
    return { error: "Vous devez être connecté." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Aucun fichier reçu." };
  }
  if (!ALLOWED_MIMES.includes(file.type)) {
    return { error: "Format non supporté (JPG, PNG, WebP, AVIF uniquement)." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { error: "Fichier trop lourd (5 Mo max)." };
  }

  const ext = extFromMime(file.type);
  const path = `${user.auth_id}/${kind}.${ext}`;

  const admin = createSupabaseAdminClient();

  // Upload (upsert = écrase si existe déjà)
  const { error: uploadError } = await admin.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType: file.type,
      upsert: true,
      cacheControl: "3600",
    });

  if (uploadError) {
    return { error: `Échec de l'upload : ${uploadError.message}` };
  }

  // URL publique + cache-buster pour forcer le navigateur à recharger
  const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(path);
  const publicUrl = `${pub.publicUrl}?v=${Date.now()}`;

  // Mettre à jour la colonne correspondante
  const column = kind === "avatar" ? "profile_photo" : "cover_photo";
  const { error: updateError } = await admin
    .from("users")
    .update({ [column]: publicUrl, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (updateError) {
    return { error: "Photo uploadée mais échec de la mise à jour du profil." };
  }

  revalidatePath("/mon-profil");
  revalidatePath("/mon-profil/edit");
  return { ok: true, url: publicUrl };
}

export async function uploadAvatarAction(
  _prev: UploadPhotoState | undefined,
  formData: FormData,
): Promise<UploadPhotoState> {
  return uploadPhoto("avatar", formData);
}

export async function uploadCoverAction(
  _prev: UploadPhotoState | undefined,
  formData: FormData,
): Promise<UploadPhotoState> {
  return uploadPhoto("cover", formData);
}

/**
 * Supprime l'avatar ou la couverture du user connecté
 * (efface tous les fichiers possibles dans le bucket + met la colonne à null)
 */
async function removePhoto(kind: PhotoKind): Promise<UploadPhotoState> {
  const user = await getCurrentUser();
  if (!user || user.id == null) {
    return { error: "Vous devez être connecté." };
  }

  const admin = createSupabaseAdminClient();

  // Liste tous les fichiers possibles (différentes extensions)
  const toRemove = ALLOWED_MIMES.map((m) => `${user.auth_id}/${kind}.${extFromMime(m)}`);
  await admin.storage.from(BUCKET).remove(toRemove);

  const column = kind === "avatar" ? "profile_photo" : "cover_photo";
  const { error } = await admin
    .from("users")
    .update({ [column]: null, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { error: "Échec de la suppression en base." };

  revalidatePath("/mon-profil");
  revalidatePath("/mon-profil/edit");
  return { ok: true };
}

export async function removeAvatarAction(): Promise<UploadPhotoState> {
  return removePhoto("avatar");
}

export async function removeCoverAction(): Promise<UploadPhotoState> {
  return removePhoto("cover");
}
