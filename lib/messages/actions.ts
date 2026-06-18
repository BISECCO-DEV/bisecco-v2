"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentDbUser } from "@/lib/auth/current-user";
import { pushNotification } from "@/lib/notifications/actions";
import { sendMail } from "@/lib/mail/mailer";

const APP_URL_BASE = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://bisecco.fr";
const MAX_BODY = 4000;
const RATE_MAX = 20;
const RATE_WINDOW_MS = 60 * 1000;

export type MsgResult = { ok: true; threadId: number } | { ok: false; error: string };

/** Trouve ou crée un thread entre 2 users. user_a_id < user_b_id (contrainte DB). */
async function ensureThread(userIdA: number, userIdB: number): Promise<number | null> {
  if (userIdA === userIdB) return null;
  const [lo, hi] = userIdA < userIdB ? [userIdA, userIdB] : [userIdB, userIdA];

  const admin = createSupabaseAdminClient();
  const { data: existing } = await admin
    .from("message_threads")
    .select("id")
    .eq("user_a_id", lo)
    .eq("user_b_id", hi)
    .maybeSingle();

  if (existing) return existing.id as number;

  const { data: created } = await admin
    .from("message_threads")
    .insert({ user_a_id: lo, user_b_id: hi })
    .select("id")
    .single();

  return (created?.id as number) ?? null;
}

/** Envoyer un message à un autre user (créé le thread si besoin). */
export async function sendMessageAction(
  recipientId: number,
  body: string,
): Promise<MsgResult> {
  const me = await getCurrentDbUser();
  if (!me) return { ok: false, error: "Connexion requise." };
  if (recipientId === me.id) return { ok: false, error: "Vous ne pouvez pas vous envoyer un message." };

  const text = body.trim().slice(0, MAX_BODY);
  if (!text || text.length < 2) return { ok: false, error: "Message vide." };

  const admin = createSupabaseAdminClient();

  // Rate limit : 20 messages / minute par sender
  const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
  const { count } = await admin
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("sender_id", me.id)
    .gte("created_at", since);
  if ((count ?? 0) >= RATE_MAX) {
    return { ok: false, error: "Doucement, patientez quelques secondes." };
  }

  // Vérifier que le destinataire existe et n'est pas supprimé
  const { data: recipient } = await admin
    .from("users")
    .select("id, name, email")
    .eq("id", recipientId)
    .is("deleted_at", null)
    .maybeSingle();
  if (!recipient) return { ok: false, error: "Destinataire introuvable." };

  const threadId = await ensureThread(me.id, recipientId);
  if (!threadId) return { ok: false, error: "Impossible de créer le thread." };

  const { error: insErr } = await admin.from("messages").insert({
    thread_id: threadId,
    sender_id: me.id,
    body: text,
  });
  if (insErr) return { ok: false, error: "Envoi échoué." };

  // Push notification + email
  await pushNotification(
    recipientId,
    "new_message",
    `Nouveau message de ${me.name ?? "un utilisateur"}`,
    text.slice(0, 100),
    `/messagerie/${threadId}`,
    "💬",
  );

  if (recipient.email) {
    const html = `
      <div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:30px;background:#f7f7f5;">
        <div style="background:white;border-radius:16px;padding:32px;">
          <h1 style="font-size:22px;color:#0d1e4a;margin:0 0 16px;font-weight:800;">Nouveau message 💬</h1>
          <p style="color:#3c4566;line-height:1.6;margin:0 0 20px;">Bonjour ${recipient.name ?? ""},</p>
          <p style="color:#3c4566;line-height:1.6;margin:0 0 20px;">
            <strong>${me.name ?? "Un utilisateur"}</strong> vous a envoyé un message sur Bisecco :
          </p>
          <div style="background:#f7f7f5;border-left:4px solid #f07a2f;padding:16px 20px;border-radius:0 8px 8px 0;color:#3c4566;line-height:1.5;margin:0 0 24px;white-space:pre-wrap;">${text.replace(/</g, "&lt;").replace(/>/g, "&gt;").slice(0, 500)}${text.length > 500 ? "..." : ""}</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
            <tr>
              <td style="background:#f07a2f;border-radius:12px;">
                <a href="${APP_URL_BASE}/messagerie/${threadId}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:white;text-decoration:none;">
                  Répondre →
                </a>
              </td>
            </tr>
          </table>
        </div>
      </div>
    `;
    const textVersion = `Bonjour ${recipient.name ?? ""},\n\n${me.name ?? "Un utilisateur"} vous a envoye un message sur Bisecco:\n\n"${text.slice(0, 300)}"\n\nRepondre: ${APP_URL_BASE}/messagerie/${threadId}`;
    await sendMail({
      to: recipient.email,
      subject: `Nouveau message de ${me.name ?? "Bisecco"}`,
      html,
      text: textVersion,
    });
  }

  revalidatePath("/messagerie");
  revalidatePath(`/messagerie/${threadId}`);

  return { ok: true, threadId };
}

/** Liste les threads du user courant avec dernier message + unread count. */
export async function listThreadsAction(): Promise<Array<{
  id: number;
  other_user: { id: number; name: string; client_number: string | null; role: string; profile_photo?: string | null };
  last_message_at: string | null;
  last_message_preview: string | null;
  unread_count: number;
}>> {
  const me = await getCurrentDbUser();
  if (!me) return [];

  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("message_threads")
    .select(`
      id, last_message_at, last_message_preview, unread_a_count, unread_b_count,
      user_a:user_a_id ( id, name, client_number, role ),
      user_b:user_b_id ( id, name, client_number, role )
    `)
    .or(`user_a_id.eq.${me.id},user_b_id.eq.${me.id}`)
    .order("last_message_at", { ascending: false })
    .limit(100);

  type RawRow = {
    id: number;
    last_message_at: string | null;
    last_message_preview: string | null;
    unread_a_count: number;
    unread_b_count: number;
    user_a: { id: number; name: string; client_number: string | null; role: string } | { id: number; name: string; client_number: string | null; role: string }[] | null;
    user_b: { id: number; name: string; client_number: string | null; role: string } | { id: number; name: string; client_number: string | null; role: string }[] | null;
  };

  return ((data ?? []) as unknown as RawRow[]).map((t) => {
    const a = Array.isArray(t.user_a) ? t.user_a[0] : t.user_a;
    const b = Array.isArray(t.user_b) ? t.user_b[0] : t.user_b;
    const isA = a?.id === me.id;
    const other = isA ? b : a;
    const unread = isA ? t.unread_a_count : t.unread_b_count;
    return {
      id: t.id,
      other_user: other!,
      last_message_at: t.last_message_at,
      last_message_preview: t.last_message_preview,
      unread_count: unread ?? 0,
    };
  });
}

/** Liste les messages d'un thread (vérifie accès). */
export async function listMessagesAction(threadId: number): Promise<Array<{ id: number; sender_id: number; body: string; created_at: string; read_at: string | null }>> {
  const me = await getCurrentDbUser();
  if (!me) return [];

  const admin = createSupabaseAdminClient();
  const { data: thread } = await admin
    .from("message_threads")
    .select("user_a_id, user_b_id")
    .eq("id", threadId)
    .maybeSingle();

  if (!thread || (thread.user_a_id !== me.id && thread.user_b_id !== me.id)) return [];

  const { data } = await admin
    .from("messages")
    .select("id, sender_id, body, created_at, read_at")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true })
    .limit(500);

  return (data ?? []) as Array<{ id: number; sender_id: number; body: string; created_at: string; read_at: string | null }>;
}

/** Marque les messages d'un thread comme lus côté courant. */
export async function markThreadReadAction(threadId: number): Promise<void> {
  const me = await getCurrentDbUser();
  if (!me) return;

  const admin = createSupabaseAdminClient();
  const { data: thread } = await admin
    .from("message_threads")
    .select("user_a_id, user_b_id")
    .eq("id", threadId)
    .maybeSingle();

  if (!thread || (thread.user_a_id !== me.id && thread.user_b_id !== me.id)) return;

  const isA = thread.user_a_id === me.id;
  await admin
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("thread_id", threadId)
    .neq("sender_id", me.id)
    .is("read_at", null);

  await admin
    .from("message_threads")
    .update(isA ? { unread_a_count: 0 } : { unread_b_count: 0 })
    .eq("id", threadId);

  revalidatePath("/messagerie");
}

/** Détails enrichis d'un user pour le panneau droit de /messagerie. */
export type ThreadPanelData = {
  id: number;
  name: string;
  role: "artisan" | "particulier" | "admin";
  client_number: string | null;
  profile_photo: string | null;
  city: string | null;
  phone: string | null;
  created_at: string;
  // Si artisan
  company_name: string | null;
  metier_name: string | null;
  metier_category: string | null;
  siren_status: string | null;
  validation_status: string | null;
  // Compteurs
  messages_count: number;
  quotes_count: number;
};

/** Récupère les détails d'un autre user pour le panneau droit du chat. */
export async function getThreadPanelDataAction(otherUserId: number): Promise<ThreadPanelData | null> {
  const me = await getCurrentDbUser();
  if (!me) return null;

  const admin = createSupabaseAdminClient();

  // 1) User info de base + (si artisan) profil + métier
  const { data: user } = await admin
    .from("users")
    .select(`
      id, name, role, client_number, profile_photo, city, phone, created_at,
      siren_status, validation_status,
      artisan_profiles ( company_name, metiers ( name, category ) )
    `)
    .eq("id", otherUserId)
    .is("deleted_at", null)
    .maybeSingle();

  if (!user) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile: any = Array.isArray(user.artisan_profiles) ? user.artisan_profiles[0] : user.artisan_profiles;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metierRaw: any = profile && "metiers" in profile ? profile.metiers : null;
  const metier = Array.isArray(metierRaw) ? metierRaw[0] : metierRaw;

  // 2) Compteurs : messages échangés + devis communs
  const [lo, hi] = me.id < otherUserId ? [me.id, otherUserId] : [otherUserId, me.id];
  const { data: thread } = await admin
    .from("message_threads")
    .select("id")
    .eq("user_a_id", lo)
    .eq("user_b_id", hi)
    .maybeSingle();

  let messages_count = 0;
  if (thread) {
    const { count } = await admin
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("thread_id", thread.id);
    messages_count = count ?? 0;
  }

  // Devis communs (entre les deux users, dans un sens ou l'autre)
  const { count: quotes_count } = await admin
    .from("quote_requests")
    .select("*", { count: "exact", head: true })
    .or(
      `and(client_id.eq.${me.id},artisan_id.eq.${otherUserId}),and(client_id.eq.${otherUserId},artisan_id.eq.${me.id})`,
    );

  return {
    id: user.id as number,
    name: user.name as string,
    role: user.role as ThreadPanelData["role"],
    client_number: (user.client_number as string | null) ?? null,
    profile_photo: (user.profile_photo as string | null) ?? null,
    city: (user.city as string | null) ?? null,
    phone: (user.phone as string | null) ?? null,
    created_at: user.created_at as string,
    company_name: profile?.company_name ?? null,
    metier_name: metier?.name ?? null,
    metier_category: metier?.category ?? null,
    siren_status: (user.siren_status as string | null) ?? null,
    validation_status: (user.validation_status as string | null) ?? null,
    messages_count,
    quotes_count: quotes_count ?? 0,
  };
}

/**
 * Supprime une conversation (thread) côté serveur · les deux participants perdent l'historique.
 * Sécurité : le user doit être participant du thread.
 */
export async function deleteThreadAction(threadId: number): Promise<{ ok: boolean; error?: string }> {
  const me = await getCurrentDbUser();
  if (!me) return { ok: false, error: "Connexion requise." };

  const admin = createSupabaseAdminClient();
  const { data: thread } = await admin
    .from("message_threads")
    .select("id, user_a_id, user_b_id")
    .eq("id", threadId)
    .maybeSingle();

  if (!thread) return { ok: false, error: "Conversation introuvable." };
  if (thread.user_a_id !== me.id && thread.user_b_id !== me.id) {
    return { ok: false, error: "Accès refusé." };
  }

  // Cascade : on supprime les messages puis le thread.
  await admin.from("messages").delete().eq("thread_id", threadId);
  const { error } = await admin.from("message_threads").delete().eq("id", threadId);

  if (error) {
    console.error("[deleteThreadAction]", error);
    return { ok: false, error: error.message };
  }

  revalidatePath("/messagerie");
  return { ok: true };
}

/** Récupère ou crée le thread avec un user spécifique (pour bouton "Contacter"). */
export async function getOrCreateThreadAction(otherUserId: number): Promise<{ ok: true; threadId: number } | { ok: false; error: string }> {
  const me = await getCurrentDbUser();
  if (!me) return { ok: false, error: "Connexion requise." };
  if (otherUserId === me.id) return { ok: false, error: "Vous ne pouvez pas vous envoyer de message." };

  const threadId = await ensureThread(me.id, otherUserId);
  if (!threadId) return { ok: false, error: "Impossible de créer la conversation." };
  return { ok: true, threadId };
}
