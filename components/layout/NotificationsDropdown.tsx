"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Bell, MessageCircle, FileText, Star, Eye, Settings, Check, AlertTriangle, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  listNotifications,
  readAllNotificationsAction,
  deleteAllNotificationsAction,
  type AppNotification,
} from "@/lib/notifications/actions";
import { playNotificationSound } from "@/lib/notifications/sound";

const ICONS: Record<string, { icon: typeof MessageCircle; color: string; bg: string }> = {
  new_message:     { icon: MessageCircle, color: "text-blue-500",    bg: "bg-blue-50" },
  quote_received:  { icon: FileText,      color: "text-brand-500",   bg: "bg-brand-50" },
  review_received: { icon: Star,          color: "text-amber-500",   bg: "bg-amber-50" },
  review_approved: { icon: Star,          color: "text-emerald-500", bg: "bg-emerald-50" },
  profile_view:    { icon: Eye,           color: "text-emerald-500", bg: "bg-emerald-50" },
  report:          { icon: AlertTriangle, color: "text-red-500",     bg: "bg-red-50" },
  system:          { icon: Settings,      color: "text-purple-500",  bg: "bg-purple-50" },
};

function iconFor(type: string) {
  return ICONS[type] ?? ICONS.system;
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
  if (diff < 86400 * 7) return `Il y a ${Math.floor(diff / 86400)} j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

type NotificationsDropdownProps = {
  /** Compteur initial (depuis SSR) · sera mis à jour live ensuite */
  unreadCount?: number;
  /** ID du user courant (pour le channel realtime). null = pas connecté */
  currentUserId?: number | null;
};

export function NotificationsDropdown({ unreadCount: initialUnread = 0, currentUserId }: NotificationsDropdownProps = {}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(initialUnread);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ title: string; message: string | null; href: string | null } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const list = await listNotifications(30);
    setItems(list);
    setUnread(list.filter((n) => !n.read_at).length);
    setLoading(false);
  }, []);

  // Initial load à l'ouverture du dropdown
  useEffect(() => {
    if (open && items.length === 0) refresh();
  }, [open, items.length, refresh]);

  // Realtime subscription : nouveau message ou notif
  useEffect(() => {
    if (!currentUserId) return;
    const supabase = createClient();
    const ch = supabase
      .channel(`notif-user-${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "app_notifications",
          filter: `user_id=eq.${currentUserId}`,
        },
        (payload) => {
          const newNotif = payload.new as AppNotification;
          // Re-fetch pour avoir la liste à jour
          refresh();
          setUnread((u) => u + 1);
          // Bip + toast
          playNotificationSound();
          setToast({
            title: newNotif.title,
            message: newNotif.message,
            href: newNotif.action_url,
          });
          setTimeout(() => setToast(null), 5000);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [currentUserId, refresh]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const markAllRead = async () => {
    await readAllNotificationsAction();
    setItems((it) => it.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })));
    setUnread(0);
  };

  const deleteAll = async () => {
    if (!confirm("Supprimer toutes vos notifications ? Action irréversible.")) return;
    await deleteAllNotificationsAction();
    setItems([]);
    setUnread(0);
  };

  return (
    <>
      {/* Toast en haut à droite quand nouvelle notif arrive */}
      {toast && (
        <Link
          href={toast.href || "/mon-profil/notifications"}
          onClick={() => setToast(null)}
          className="fixed top-20 right-5 z-[200] w-[340px] max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-2xl border border-brand-200 overflow-hidden animate-slide-up cursor-pointer hover:border-brand-400 transition"
        >
          <div className="flex items-start gap-3 p-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
              <Bell size={16} className="text-brand-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-ink-700 text-sm truncate">{toast.title}</p>
              {toast.message && <p className="text-xs text-ink-500 mt-0.5 line-clamp-2">{toast.message}</p>}
              <p className="text-[0.65rem] text-brand-500 font-bold mt-1">Cliquer pour voir →</p>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-brand-400 to-brand-600 animate-toast-progress" />
        </Link>
      )}

    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg text-white/70 hover:text-white hover:bg-white/[0.10] transition"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] rounded-full bg-brand-500 text-white text-[0.65rem] font-bold flex items-center justify-center px-1 border-2 border-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-[380px] max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-2xl border border-ink-100 overflow-hidden z-[100]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100 gap-2">
            <div className="min-w-0">
              <h3 className="font-bold text-ink-700">Notifications</h3>
              {unread > 0 && (
                <p className="text-xs text-ink-400 mt-0.5">{unread} non lue{unread > 1 ? "s" : ""}</p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-bold text-brand-500 hover:text-brand-600 inline-flex items-center gap-1"
                  title="Tout marquer comme lu"
                >
                  <Check size={12} /> Lu
                </button>
              )}
              {items.length > 0 && (
                <button
                  onClick={deleteAll}
                  className="text-xs font-bold text-red-500 hover:text-red-600 inline-flex items-center gap-1"
                  title="Tout supprimer"
                >
                  <Trash2 size={12} /> Vider
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {loading && items.length === 0 ? (
              <div className="px-5 py-12 text-center text-ink-400 text-sm">Chargement…</div>
            ) : items.length === 0 ? (
              <div className="px-5 py-12 text-center text-ink-400 text-sm">
                <Bell size={24} className="mx-auto text-ink-200 mb-2" />
                Aucune notification
              </div>
            ) : (
              items.map((n) => {
                const cfg = iconFor(n.type);
                const isUnread = !n.read_at;
                return (
                  <Link
                    key={n.id}
                    href={n.action_url || "/mon-profil/notifications"}
                    onClick={() => setOpen(false)}
                    className={`flex items-start gap-3 px-5 py-3 border-b border-ink-100 last:border-0 hover:bg-ink-50/60 transition group ${
                      isUnread ? "bg-brand-50/30" : ""
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                      <cfg.icon size={15} className={cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 text-sm text-ink-700 font-semibold leading-snug">
                          {n.title}
                        </div>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      {n.message && <p className="text-xs text-ink-400 mt-0.5 truncate">{n.message}</p>}
                      <span className="text-[0.7rem] text-ink-300 font-medium mt-1 block">
                        {timeAgo(n.created_at)}
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          <Link
            href="/mon-profil/notifications"
            onClick={() => setOpen(false)}
            className="block px-5 py-3 text-center text-xs font-bold text-brand-500 hover:text-brand-600 hover:bg-ink-50 transition border-t border-ink-100"
          >
            Voir toutes les notifications →
          </Link>
        </div>
      )}
    </div>
    </>
  );
}
