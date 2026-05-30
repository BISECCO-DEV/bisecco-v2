"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentDbUser, requireDbAdmin } from "@/lib/auth/current-user";

const MAX_BODY = 2000;
const RATE_WINDOW_MS = 10_000;
const RATE_MAX = 6;

/** Visiteur : crée (si besoin) sa conversation et renvoie son id. */
export async function ensureConversationAction(
  sessionToken: string,
  visitorName?: string | null,
  visitorEmail?: string | null,
): Promise<{ id: string } | { error: string }> {
  if (!sessionToken || sessionToken.length < 16 || sessionToken.length > 64) {
    return { error: "Token invalide." };
  }

  const admin = createSupabaseAdminClient();
  const me = await getCurrentDbUser();

  const { data: existing } = await admin
    .from("chat_conversations")
    .select("id")
    .eq("session_token", sessionToken)
    .maybeSingle();

  if (existing) return { id: existing.id as string };

  const { data: created, error } = await admin
    .from("chat_conversations")
    .insert({
      session_token: sessionToken,
      user_id: me?.id ?? null,
      visitor_name: visitorName?.slice(0, 80) || me?.name || null,
      visitor_email: visitorEmail?.toLowerCase().slice(0, 191) || me?.email || null,
      status: "open",
    })
    .select("id")
    .single();

  if (error || !created) return { error: "Impossible de créer la conversation." };
  return { id: created.id as string };
}

/** Visiteur : envoie un message dans sa conversation (anti-spam IP + rate-limit). */
export async function sendVisitorMessageAction(
  sessionToken: string,
  body: string,
): Promise<{ ok: true } | { error: string }> {
  const text = body.trim().slice(0, MAX_BODY);
  if (!text) return { error: "Message vide." };
  if (!sessionToken) return { error: "Session manquante." };

  const admin = createSupabaseAdminClient();
  const { data: conv } = await admin
    .from("chat_conversations")
    .select("id, status")
    .eq("session_token", sessionToken)
    .maybeSingle();

  if (!conv) return { error: "Conversation introuvable." };
  if (conv.status === "closed") return { error: "Conversation fermée." };

  // Rate-limit léger : pas plus de RATE_MAX messages / RATE_WINDOW_MS dans cette conv
  const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
  const { count } = await admin
    .from("chat_messages")
    .select("*", { count: "exact", head: true })
    .eq("conversation_id", conv.id)
    .eq("sender_type", "visitor")
    .gte("created_at", since);
  if ((count ?? 0) >= RATE_MAX) {
    return { error: "Doucement ! Patientez quelques secondes." };
  }

  const { error } = await admin.from("chat_messages").insert({
    conversation_id: conv.id,
    sender_type: "visitor",
    body: text,
  });
  if (error) return { error: "Envoi échoué." };

  return { ok: true };
}

/** Admin : envoie un message dans une conversation. */
export async function sendAdminMessageAction(
  conversationId: string,
  body: string,
): Promise<{ ok: true } | { error: string }> {
  const me = await requireDbAdmin();
  const text = body.trim().slice(0, MAX_BODY);
  if (!text) return { error: "Message vide." };
  if (!conversationId) return { error: "Conversation manquante." };

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("chat_messages").insert({
    conversation_id: conversationId,
    sender_type: "admin",
    sender_admin_id: me.id,
    body: text,
  });
  if (error) return { error: "Envoi échoué." };

  revalidatePath("/admin/chat-live");
  return { ok: true };
}

/** Visiteur : marque les messages admin comme lus. */
export async function markVisitorReadAction(sessionToken: string): Promise<void> {
  if (!sessionToken) return;
  const admin = createSupabaseAdminClient();
  const { data: conv } = await admin
    .from("chat_conversations")
    .select("id")
    .eq("session_token", sessionToken)
    .maybeSingle();
  if (!conv) return;

  await admin
    .from("chat_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", conv.id)
    .eq("sender_type", "admin")
    .is("read_at", null);

  await admin
    .from("chat_conversations")
    .update({ unread_visitor_count: 0 })
    .eq("id", conv.id);
}

/** Admin : marque tous les messages visiteur d'une conv comme lus. */
export async function markAdminReadAction(conversationId: string): Promise<void> {
  await requireDbAdmin();
  if (!conversationId) return;
  const admin = createSupabaseAdminClient();
  await admin
    .from("chat_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .eq("sender_type", "visitor")
    .is("read_at", null);

  await admin
    .from("chat_conversations")
    .update({ unread_admin_count: 0 })
    .eq("id", conversationId);

  revalidatePath("/admin/chat-live");
}

/** Admin : ferme une conversation. */
export async function closeConversationAction(conversationId: string): Promise<void> {
  await requireDbAdmin();
  const admin = createSupabaseAdminClient();
  await admin
    .from("chat_conversations")
    .update({ status: "closed", updated_at: new Date().toISOString() })
    .eq("id", conversationId);
  revalidatePath("/admin/chat-live");
}

/** Admin : count des conversations avec messages non lus. */
export async function countUnreadAdminConversationsAction(): Promise<number> {
  try {
    await requireDbAdmin();
  } catch {
    return 0;
  }
  const admin = createSupabaseAdminClient();
  const { count } = await admin
    .from("chat_conversations")
    .select("*", { count: "exact", head: true })
    .gt("unread_admin_count", 0)
    .eq("status", "open");
  return count ?? 0;
}
