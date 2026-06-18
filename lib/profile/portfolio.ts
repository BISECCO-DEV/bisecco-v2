"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/db/current-user";

const BUCKET = "user-uploads";
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_PAIRS = 6;

export type PortfolioPair = {
  id: number;
  before_url: string;
  after_url: string;
  before_path: string;
  after_path: string;
  title: string | null;
  description: string | null;
  sort_order: number;
};

export type PortfolioActionState = {
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

function publicUrl(path: string): string {
  const admin = createSupabaseAdminClient();
  return admin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Liste les paires avant/après pour un user_id donné. */
export async function listPortfolio(userId: number): Promise<PortfolioPair[]> {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("portfolio_before_after")
    .select("id, before_path, after_path, title, description, sort_order")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    before_path: row.before_path,
    after_path: row.after_path,
    before_url: publicUrl(row.before_path),
    after_url: publicUrl(row.after_path),
    title: row.title,
    description: row.description,
    sort_order: row.sort_order,
  }));
}

/** Liste les paires du user connecté. */
export async function listMyPortfolio(): Promise<PortfolioPair[]> {
  const user = await getCurrentUser();
  if (!user || user.id == null) return [];
  return listPortfolio(user.id);
}

/**
 * Crée une paire avant/après (2 fichiers + métadonnées).
 * formData attend : before (File), after (File), title?, description?
 */
export async function createPortfolioPairAction(
  _prev: PortfolioActionState | undefined,
  formData: FormData,
): Promise<PortfolioActionState> {
  const user = await getCurrentUser();
  if (!user || user.id == null || !user.auth_id) {
    return { error: "Vous devez être connecté." };
  }

  const before = formData.get("before");
  const after = formData.get("after");
  const title = String(formData.get("title") ?? "").trim().slice(0, 120) || null;
  const description = String(formData.get("description") ?? "").trim().slice(0, 1000) || null;

  if (!(before instanceof File) || before.size === 0) {
    return { error: "Photo « avant » manquante." };
  }
  if (!(after instanceof File) || after.size === 0) {
    return { error: "Photo « après » manquante." };
  }
  for (const f of [before, after]) {
    if (!ALLOWED_MIMES.includes(f.type)) {
      return { error: "Format non supporté (JPG, PNG, WebP, AVIF)." };
    }
    if (f.size > MAX_FILE_SIZE) {
      return { error: "Une des photos dépasse 5 Mo." };
    }
  }

  const admin = createSupabaseAdminClient();

  // Vérifier le quota
  const { count } = await admin
    .from("portfolio_before_after")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);
  if ((count ?? 0) >= MAX_PAIRS) {
    return { error: `Limite de ${MAX_PAIRS} réalisations atteinte.` };
  }

  // Upload des 2 fichiers
  const stamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const beforePath = `${user.auth_id}/portfolio/${stamp}-${random}-before.${extFromMime(before.type)}`;
  const afterPath  = `${user.auth_id}/portfolio/${stamp}-${random}-after.${extFromMime(after.type)}`;

  const upBefore = await admin.storage.from(BUCKET)
    .upload(beforePath, before, { contentType: before.type, upsert: false, cacheControl: "3600" });
  if (upBefore.error) return { error: `Upload avant : ${upBefore.error.message}` };

  const upAfter = await admin.storage.from(BUCKET)
    .upload(afterPath, after, { contentType: after.type, upsert: false, cacheControl: "3600" });
  if (upAfter.error) {
    await admin.storage.from(BUCKET).remove([beforePath]);
    return { error: `Upload après : ${upAfter.error.message}` };
  }

  const { error: insertError } = await admin
    .from("portfolio_before_after")
    .insert({
      user_id: user.id,
      before_path: beforePath,
      after_path: afterPath,
      title,
      description,
      sort_order: count ?? 0,
    });

  if (insertError) {
    await admin.storage.from(BUCKET).remove([beforePath, afterPath]);
    return { error: "Échec de l'enregistrement." };
  }

  revalidatePath("/mon-profil/edit");
  revalidatePath("/mon-profil");
  return { ok: true };
}

/**
 * Supprime une paire avant/après (storage + db).
 */
export async function deletePortfolioPairAction(
  _prev: PortfolioActionState | undefined,
  formData: FormData,
): Promise<PortfolioActionState> {
  const user = await getCurrentUser();
  if (!user || user.id == null) return { error: "Vous devez être connecté." };

  const id = Number(formData.get("id"));
  if (!Number.isFinite(id) || id <= 0) return { error: "ID invalide." };

  const admin = createSupabaseAdminClient();

  const { data: row } = await admin
    .from("portfolio_before_after")
    .select("before_path, after_path, user_id")
    .eq("id", id)
    .maybeSingle();

  if (!row || row.user_id !== user.id) {
    return { error: "Élément introuvable ou non autorisé." };
  }

  const { error: dbError } = await admin
    .from("portfolio_before_after")
    .delete()
    .eq("id", id);
  if (dbError) return { error: "Échec de la suppression." };

  await admin.storage.from(BUCKET).remove([row.before_path, row.after_path]);

  revalidatePath("/mon-profil/edit");
  revalidatePath("/mon-profil");
  return { ok: true };
}
