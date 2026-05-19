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

/** Helper interne : push une notif (best-effort) */
export async function pushNotification(
  userId: number,
  type: string,
  title: string,
  message?: string,
  actionUrl?: string,
  icon?: string,
): Promise<void> {
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
}
