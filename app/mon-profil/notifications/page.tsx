import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Bell, MessageCircle, FileText, Star, Eye, Settings, Check, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  listNotifications,
  readAllNotificationsAction,
  readNotificationAction,
} from "@/lib/notifications/actions";

export const metadata: Metadata = {
  title: "Notifications",
  robots: { index: false, follow: false },
};

const ICONS: Record<string, { color: string; bg: string; Icon: typeof MessageCircle }> = {
  quote_received:   { color: "text-brand-500",   bg: "bg-brand-50",   Icon: FileText },
  quote_responded:  { color: "text-blue-500",    bg: "bg-blue-50",    Icon: MessageCircle },
  review_received:  { color: "text-amber-500",   bg: "bg-amber-50",   Icon: Star },
  review_approved:  { color: "text-emerald-500", bg: "bg-emerald-50", Icon: Star },
  account_approved: { color: "text-emerald-500", bg: "bg-emerald-50", Icon: Check },
  account_rejected: { color: "text-red-500",     bg: "bg-red-50",     Icon: AlertTriangle },
  message:          { color: "text-blue-500",    bg: "bg-blue-50",    Icon: MessageCircle },
  view:             { color: "text-emerald-500", bg: "bg-emerald-50", Icon: Eye },
  system:           { color: "text-purple-500",  bg: "bg-purple-50",  Icon: Settings },
};

function iconConfig(type: string) {
  return ICONS[type] ?? ICONS.system;
}

function timeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.floor((now - then) / 1000); // secondes
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `Il y a ${Math.floor(diff / 86400)} j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default async function NotificationsPage() {
  // Auth check serveur-side
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion?next=/mon-profil/notifications");

  const notifications = await listNotifications(50);
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  // Server Action wrappers (besoin d'une fonction sans args pour bind / forms)
  async function readOne(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("id")?.toString() ?? "0", 10);
    if (id > 0) await readNotificationAction(id);
  }

  async function readAll() {
    "use server";
    await readAllNotificationsAction();
  }

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-10">
        <Link href="/mon-profil" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Mon espace
        </Link>

        <div className="mt-4 mb-8 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-ink-700 tracking-tight flex items-center gap-2">
              <Bell size={22} className="text-brand-500" /> Notifications
            </h1>
            <p className="text-ink-400 mt-1">
              {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "Toutes lues"} sur {notifications.length} au total.
            </p>
          </div>
          {unreadCount > 0 && (
            <form action={readAll}>
              <button type="submit" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-ink-200 hover:border-brand-500 text-sm font-bold text-ink-700 transition">
                <Check size={13} /> Tout marquer lu
              </button>
            </form>
          )}
        </div>

        {/* Liste */}
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-ink-200 p-12 text-center">
            <div className="text-5xl mb-3">🔔</div>
            <p className="text-ink-500">Aucune notification pour le moment.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
            {notifications.map((n) => {
              const cfg = iconConfig(n.type);
              const unread = !n.read_at;
              return (
                <form key={n.id} action={readOne}>
                  <input type="hidden" name="id" value={n.id} />
                  <button
                    type="submit"
                    className={`w-full flex items-start gap-3 px-5 py-4 hover:bg-ink-50/60 transition text-left group border-b border-ink-100 last:border-0 ${
                      unread ? "bg-brand-50/30" : ""
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                      {n.icon ? (
                        <span className="text-lg leading-none">{n.icon}</span>
                      ) : (
                        <cfg.Icon size={16} className={cfg.color} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 text-sm font-semibold text-ink-700 leading-snug">
                          {n.title}
                        </div>
                        {unread && <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-1.5" />}
                      </div>
                      {n.message && (
                        <div className="text-[0.82rem] text-ink-500 mt-0.5 leading-snug">{n.message}</div>
                      )}
                      <span className="text-[0.7rem] text-ink-400 font-medium mt-1 block">{timeAgo(n.created_at)}</span>
                    </div>
                  </button>
                </form>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
