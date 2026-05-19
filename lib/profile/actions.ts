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
  });

  if (!parsed.success) {
    const fieldErrors: UpdateProfileState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof UpdateProfileInput;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Certains champs sont invalides.", fieldErrors };
  }

  const { name, phone, city, description } = parsed.data;

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("users")
    .update({
      name,
      phone: phone || null,
      city: city || null,
      description: description || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: "Erreur lors de l'enregistrement. Réessayez." };
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
