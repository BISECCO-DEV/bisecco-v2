"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, MessageCircle, FileText, Star, Eye, Settings, Check } from "lucide-react";

type Notification = {
  id: string;
  type: "message" | "devis" | "review" | "view" | "system";
  title: string;
  sub?: string;
  time: string;
  read: boolean;
  href?: string;
};

const DEMO_NOTIFS: Notification[] = [
  { id: "1", type: "message", title: "Nouveau message de Marie L.",                    sub: "« Bonjour, est-ce que vous… »", time: "Il y a 5 min",  read: false, href: "/messagerie/1" },
  { id: "2", type: "devis",   title: "Nouvelle demande de devis",                      sub: "Rénovation salle de bain · Meaux", time: "Il y a 2h",      read: false, href: "/mon-profil/devis" },
  { id: "3", type: "review",  title: "Pierre M. vous a noté 5★",                        sub: "« Excellent artisan… »",            time: "Hier",           read: true,  href: "/profil/1" },
  { id: "4", type: "view",    title: "Votre profil a été consulté 12 fois aujourd'hui", time: "Aujourd'hui",                       read: true,  href: "/mon-profil" },
  { id: "5", type: "system",  title: "Bienvenue sur Bisecco !",                         sub: "Complétez votre profil pour gagner en visibilité", time: "Hier",  read: true,  href: "/mon-profil/edit" },
];

const ICONS = {
  message: { icon: MessageCircle, color: "text-blue-500",    bg: "bg-blue-50" },
  devis:   { icon: FileText,      color: "text-brand-500",   bg: "bg-brand-50" },
  review:  { icon: Star,          color: "text-amber-500",   bg: "bg-amber-50" },
  view:    { icon: Eye,           color: "text-emerald-500", bg: "bg-emerald-50" },
  system:  { icon: Settings,      color: "text-purple-500",  bg: "bg-purple-50" },
};

type NotificationsDropdownProps = {
  /** Compteur réel récupéré côté serveur (override le calcul local sur DEMO_NOTIFS) */
  unreadCount?: number;
};

export function NotificationsDropdown({ unreadCount }: NotificationsDropdownProps = {}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(DEMO_NOTIFS);
  const ref = useRef<HTMLDivElement>(null);

  const unread = typeof unreadCount === "number" ? unreadCount : items.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const markAllRead = () => setItems((it) => it.map((n) => ({ ...n, read: true })));

  return (
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
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-[380px] max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-2xl border border-ink-100 overflow-hidden z-[100] animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
            <div>
              <h3 className="font-bold text-ink-700">Notifications</h3>
              {unread > 0 && (
                <p className="text-xs text-ink-400 mt-0.5">{unread} non lue{unread > 1 ? "s" : ""}</p>
              )}
            </div>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs font-bold text-brand-500 hover:text-brand-600 inline-flex items-center gap-1">
                <Check size={12} /> Tout marquer lu
              </button>
            )}
          </div>

          {/* Liste */}
          <div className="max-h-[400px] overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-5 py-12 text-center text-ink-400 text-sm">
                <Bell size={24} className="mx-auto text-ink-200 mb-2" />
                Aucune notification
              </div>
            ) : (
              items.map((n) => {
                const cfg = ICONS[n.type];
                return (
                  <Link
                    key={n.id}
                    href={n.href || "#"}
                    onClick={() => setOpen(false)}
                    className={`flex items-start gap-3 px-5 py-3 border-b border-ink-100 last:border-0 hover:bg-ink-50/60 transition group ${
                      !n.read ? "bg-brand-50/30" : ""
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
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      {n.sub && <p className="text-xs text-ink-400 mt-0.5 truncate">{n.sub}</p>}
                      <span className="text-[0.7rem] text-ink-300 font-medium mt-1 block">{n.time}</span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Footer */}
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
  );
}
