"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/db/current-user";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

/** Upload une image dans user-uploads/{auth_id}/feed/{uuid}.{ext}.
 *  Retourne le path storage (à pousser dans feed_posts.images). */
export async function uploadFeedImageAction(
  formData: FormData,
): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  const user = await requireUser();
  if (!user.auth_id) return { ok: false, error: "Auth requise." };

  const file = formData.get("file") as File | null;
  if (!file) return { ok: false, error: "Aucun fichier." };
  if (!ALLOWED_MIME.includes(file.type)) {
    return { ok: false, error: "Format non supporté (JPG/PNG/WEBP/AVIF uniquement)." };
  }
  if (file.size > MAX_SIZE) {
    return { ok: false, error: "Image trop lourde (max 5 Mo)." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const uuid = crypto.randomUUID();
  const path = `${user.auth_id}/feed/${uuid}.${ext}`;

  const admin = createSupabaseAdminClient();
  const arrayBuffer = await file.arrayBuffer();
  const { error } = await admin.storage
    .from("user-uploads")
    .upload(path, new Uint8Array(arrayBuffer), {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("[uploadFeedImageAction]", error);
    return { ok: false, error: error.message };
  }

  return { ok: true, path };
}

/** Convertit un path storage en URL publique. */
export async function getFeedImageUrl(path: string): Promise<string> {
  if (path.startsWith("http")) return path;
  const admin = createSupabaseAdminClient();
  const { data } = admin.storage.from("user-uploads").getPublicUrl(path);
  return data.publicUrl;
}
