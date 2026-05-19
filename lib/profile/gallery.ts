"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/db/current-user";

const BUCKET = "user-uploads";
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_GALLERY = 3;

export type GalleryItem = {
  id: number;
  url: string;
  path: string;
  caption: string | null;
  sort_order: number;
};

export type GalleryActionState = {
  ok?: boolean;
  error?: string;
};

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
 * Liste la galerie du user connecté.
 * Tri par sort_order ASC puis created_at DESC.
 */
export async function listMyGallery(): Promise<GalleryItem[]> {
  const user = await getCurrentUser();
  if (!user || user.id == null) return [];

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("gallery_images")
    .select("id, image_path, caption, sort_order")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => {
    const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(row.image_path);
    return {
      id: row.id,
      url: pub.publicUrl,
      path: row.image_path,
      caption: row.caption,
      sort_order: row.sort_order,
    };
  });
}

/**
 * Ajoute une image à la galerie du user connecté.
 * Path : {auth_id}/gallery/{timestamp}-{random}.{ext}
 */
export async function addGalleryImageAction(
  _prev: GalleryActionState | undefined,
  formData: FormData,
): Promise<GalleryActionState> {
  const user = await getCurrentUser();
  if (!user || user.id == null) return { error: "Vous devez être connecté." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Aucun fichier reçu." };
  }
  if (!ALLOWED_MIMES.includes(file.type)) {
    return { error: "Format non supporté (JPG, PNG, WebP, AVIF)." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { error: "Fichier trop lourd (5 Mo max)." };
  }

  const admin = createSupabaseAdminClient();

  // Vérifier le quota
  const { count } = await admin
    .from("gallery_images")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);
  if ((count ?? 0) >= MAX_GALLERY) {
    return { error: `Limite de ${MAX_GALLERY} photos atteinte.` };
  }

  const ext = extFromMime(file.type);
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const path = `${user.auth_id}/gallery/${fileName}`;

  const { error: uploadError } = await admin.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false, cacheControl: "3600" });

  if (uploadError) {
    return { error: `Échec de l'upload : ${uploadError.message}` };
  }

  // Insertion en base
  const { error: insertError } = await admin
    .from("gallery_images")
    .insert({
      user_id: user.id,
      image_path: path,
      sort_order: (count ?? 0),
    });

  if (insertError) {
    // Rollback du fichier uploadé
    await admin.storage.from(BUCKET).remove([path]);
    return { error: "Échec de l'enregistrement de la photo." };
  }

  revalidatePath("/mon-profil/edit");
  revalidatePath("/mon-profil");
  return { ok: true };
}

/**
 * Supprime une image de la galerie (file storage + db row).
 */
export async function removeGalleryImageAction(
  _prev: GalleryActionState | undefined,
  formData: FormData,
): Promise<GalleryActionState> {
  const user = await getCurrentUser();
  if (!user || user.id == null) return { error: "Vous devez être connecté." };

  const id = Number(formData.get("id"));
  if (!Number.isFinite(id) || id <= 0) return { error: "ID invalide." };

  const admin = createSupabaseAdminClient();

  // Récupérer le path AVANT delete (et vérifier que c'est bien le user)
  const { data: row } = await admin
    .from("gallery_images")
    .select("image_path, user_id")
    .eq("id", id)
    .maybeSingle();

  if (!row || row.user_id !== user.id) {
    return { error: "Image introuvable ou non autorisée." };
  }

  // Delete db row d'abord
  const { error: dbError } = await admin
    .from("gallery_images")
    .delete()
    .eq("id", id);
  if (dbError) return { error: "Échec de la suppression." };

  // Puis delete le fichier (best effort)
  await admin.storage.from(BUCKET).remove([row.image_path]);

  revalidatePath("/mon-profil/edit");
  revalidatePath("/mon-profil");
  return { ok: true };
}
