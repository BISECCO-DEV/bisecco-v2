"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/db/current-user";

export type QuickReply = {
  id: number;
  label: string;
  body: string;
  sort_order: number;
};

export type QuickReplyState = { ok?: boolean; error?: string };

const MAX = 10;
const MAX_LABEL = 80;
const MAX_BODY = 2000;

/** Liste les templates du user connecté. */
export async function listMyQuickReplies(): Promise<QuickReply[]> {
  const me = await getCurrentUser();
  if (!me || me.id == null) return [];

  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("quick_replies")
    .select("id, label, body, sort_order")
    .eq("user_id", me.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (data ?? []) as QuickReply[];
}

/** Crée un nouveau template. */
export async function createQuickReplyAction(
  _prev: QuickReplyState | undefined,
  formData: FormData,
): Promise<QuickReplyState> {
  const me = await getCurrentUser();
  if (!me || me.id == null) return { error: "Connexion requise." };

  const label = String(formData.get("label") ?? "").trim().slice(0, MAX_LABEL);
  const body = String(formData.get("body") ?? "").trim().slice(0, MAX_BODY);

  if (!label || label.length < 2) return { error: "Le titre doit faire au moins 2 caractères." };
  if (!body || body.length < 5) return { error: "Le message doit faire au moins 5 caractères." };

  const admin = createSupabaseAdminClient();
  const { count } = await admin
    .from("quick_replies")
    .select("id", { count: "exact", head: true })
    .eq("user_id", me.id);
  if ((count ?? 0) >= MAX) {
    return { error: `Limite de ${MAX} réponses atteinte.` };
  }

  const { error } = await admin.from("quick_replies").insert({
    user_id: me.id,
    label,
    body,
    sort_order: count ?? 0,
  });
  if (error) return { error: "Erreur d'enregistrement." };

  revalidatePath("/mon-profil/parametres");
  return { ok: true };
}

/** Supprime un template (vérifie ownership). */
export async function deleteQuickReplyAction(
  _prev: QuickReplyState | undefined,
  formData: FormData,
): Promise<QuickReplyState> {
  const me = await getCurrentUser();
  if (!me || me.id == null) return { error: "Connexion requise." };

  const id = Number(formData.get("id"));
  if (!Number.isFinite(id) || id <= 0) return { error: "ID invalide." };

  const admin = createSupabaseAdminClient();
  await admin.from("quick_replies")
    .delete()
    .eq("id", id)
    .eq("user_id", me.id);

  revalidatePath("/mon-profil/parametres");
  return { ok: true };
}
