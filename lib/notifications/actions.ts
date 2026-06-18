"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentDbUser } from "@/lib/auth/current-user";

export type AppNotification = {
  id: number;
  type: string;
  title: string;
  message: string | null;
  action_url: string | null;
  icon: string | null;
  read_at: string | null;
  created_at: string;
};

/** Liste les notifs du user connecté */
export async function listNotifications(limit = 50): Promise<AppNotification[]> {
  const me = await getCurrentDbUser();
  if (!me) return [];

  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("app_notifications")
    .select("id, type, title, message, action_url, icon, read_at, created_at")
    .eq("user_id", me.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as AppNotification[];
}

/** Count notifs non lues (pour badge header) */
export async function countUnreadNotifications(): Promise<number> {
  const me = await getCurrentDbUser();
  if (!me) return 0;

  const admin = createSupabaseAdminClient();
  const { count } = await admin
    .from("app_notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", me.id)
    .is("read_at", null);

  return count ?? 0;
}

/** Marque une notif comme lue puis redirige vers action_url */
export async function readNotificationAction(id: number) {
  const me = await getCurrentDbUser();
  if (!me) redirect("/connexion");

  const admin = createSupabaseAdminClient();
  const { data: notif } = await admin
    .from("app_notifications")
    .select("id, user_id, action_url")
    .eq("id", id)
    .single();

  if (!notif || notif.user_id !== me!.id) redirect("/mon-profil/notifications");

  await admin.from("app_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id)
    .is("read_at", null);

  revalidatePath("/mon-profil/notifications");
  redirect(notif!.action_url || "/mon-profil/notifications");
}

/** Marque toutes les notifs comme lues */
export async function readAllNotificationsAction() {
  const me = await getCurrentDbUser();
  if (!me) return;

  const admin = createSupabaseAdminClient();
  await admin.from("app_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", me.id)
    .is("read_at", null);

  revalidatePath("/mon-profil/notifications");
}

/** Supprime TOUTES les notifs du user (clean total) */
export async function deleteAllNotificationsAction() {
  const me = await getCurrentDbUser();
  if (!me) return;

  const admin = createSupabaseAdminClient();
  await admin.from("app_notifications")
    .delete()
    .eq("user_id", me.id);

  revalidatePath("/mon-profil/notifications");
}

/**
 * Helper interne : push une notif (best-effort).
 *
 * Effectue 2 actions en parallèle :
 *  1. Insertion dans `app_notifications` (cloche in-app)
 *  2. Web Push (notif système même quand l'app n'est pas ouverte)
 *
 * Les 2 sont best-effort : un échec ne bloque pas l'action principale.
 */
export async function pushNotification(
  userId: number,
  type: string,
  title: string,
  message?: string,
  actionUrl?: string,
  icon?: string,
): Promise<void> {
  // 1) In-app notification
  try {
    const admin = createSupabaseAdminClient();
    await admin.from("app_notifications").insert({
      user_id: userId,
      type,
      title: title.slice(0, 200),
      message: message?.slice(0, 1000) ?? null,
      action_url: actionUrl ?? null,
      icon: icon ?? null,
    });
  } catch {
    // best-effort
  }

  // 2) Web Push (browser/mobile)
  try {
    const { sendPushToUser } = await import("@/lib/push/server");
    await sendPushToUser(userId, {
      title: title.slice(0, 100),
      body: message?.slice(0, 200),
      url: actionUrl ?? "/mon-profil/notifications",
    });
  } catch {
    // best-effort — si VAPID non configuré ou web-push non installé, on ignore
  }
}
