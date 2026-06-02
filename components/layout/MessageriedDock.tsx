"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageCircle, ChevronUp, ChevronDown, Search, Edit3, X,
} from "lucide-react";
import { listThreadsAction } from "@/lib/messages/actions";
import { MessageriedChatWindow } from "./MessageriedChatWindow";

type Thread = {
  id: number;
  other_user: { id: number; name: string; client_number: string | null; role: string; profile_photo?: string | null };
  last_message_at: string | null;
  last_message_preview: string | null;
  unread_count: number;
};

/**
 * Dock messagerie flottant bas-droite style LinkedIn.
 *
 * - Collapsé : barre compacte "💬 Messagerie [unread]"
 * - Étendu : panel ~360x440 avec liste des conversations
 * - Cliquer sur une conv → /messagerie/[id]
 * - Auto-hidden sur /messagerie (évite le doublon)
 * - Refresh toutes les 30 sec quand collapsé, 15 sec quand ouvert
 */

const POLL_COLLAPSED_MS = 30000;
const POLL_OPEN_MS = 15000;

export function MessageriedDock({ currentUserId }: { currentUserId: number | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  /** Thread actuellement ouvert dans une fenêtre de chat inline (à gauche du dock). */
  const [activeThread, setActiveThread] = useState<Thread | null>(null);

  // Hidden : non-loggé ou déjà sur /messagerie
  const hidden = !currentUserId || pathname?.startsWith("/messagerie");

  useEffect(() => {
    if (hidden) return;
    let cancelled = false;

    const load = async () => {
      try {
        const data = await listThreadsAction();
        if (!cancelled) {
          setThreads(data);
          setLoaded(true);
        }
      } catch {
        if (!cancelled) setLoaded(true);
      }
    };

    load();
    const interval = setInterval(load, open ? POLL_OPEN_MS : POLL_COLLAPSED_MS);
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [hidden, open]);

  if (hidden) return null;

  const totalUnread = threads.reduce((sum, t) => sum + (t.unread_count ?? 0), 0);
  const filtered = search
    ? threads.filter((t) =>
        t.other_user.name.toLowerCase().includes(search.toLowerCase()),
      )
    : threads;

  return (
    <div className="fixed bottom-4 right-4 z-[55] flex items-end gap-3 max-w-[calc(100vw-2rem)]">
      {/* Fenêtre de chat inline à gauche (si une conv est ouverte) */}
      {activeThread && currentUserId && (
        <MessageriedChatWindow
          threadId={activeThread.id}
          currentUserId={currentUserId}
          otherUser={activeThread.other_user}
          onClose={() => setActiveThread(null)}
        />
      )}

      {/* Sur mobile, masque le dock si une fenêtre de chat est ouverte (place limitée) */}
      <div className={`bg-white rounded-t-2xl ${open ? "rounded-b-none" : "rounded-b-2xl"} shadow-[0_-4px_24px_-4px_rgba(13,30,74,0.15)] border border-ink-100 overflow-hidden transition-all ${
        open
          ? "w-[min(360px,calc(100vw-2rem))]"
          : "w-[min(240px,calc(100vw-2rem))]"
      } ${activeThread ? "hidden sm:block" : ""}`}>
        {/* HEADER cliquable */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-ink-50 transition text-left"
          aria-expanded={open}
          aria-label="Toggle messagerie"
        >
          <div className="relative flex-shrink-0">
            <MessageCircle size={20} className="text-ink-700" />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1.5 min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[0.62rem] font-extrabold inline-flex items-center justify-center">
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            )}
          </div>
          <span className="flex-1 font-extrabold text-ink-700 text-[0.92rem]">Messagerie</span>
          <Link
            href="/messagerie/nouveau"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg hover:bg-ink-100 text-ink-500 transition"
            aria-label="Nouvelle conversation"
            title="Nouvelle conversation"
          >
            <Edit3 size={14} />
          </Link>
          {open ? <ChevronDown size={16} className="text-ink-500" /> : <ChevronUp size={16} className="text-ink-500" />}
        </button>

        {/* CORPS — visible uniquement quand open */}
        {open && (
          <div className="border-t border-ink-100 flex flex-col" style={{ height: 440 }}>
            {/* Recherche */}
            <div className="p-2 border-b border-ink-100">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher une conversation…"
                  className="w-full pl-8 pr-8 py-2 rounded-lg bg-ink-50 text-sm placeholder:text-ink-400 outline-none focus:bg-white focus:ring-2 focus:ring-brand-200 transition"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full hover:bg-ink-200 text-ink-500 inline-flex items-center justify-center"
                    aria-label="Effacer"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
            </div>

            {/* Liste threads */}
            <div className="flex-1 overflow-y-auto">
              {!loaded ? (
                <div className="p-4 space-y-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-ink-100 flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-ink-100 rounded w-1/2" />
                        <div className="h-2.5 bg-ink-100 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-ink-50 mx-auto inline-flex items-center justify-center mb-2">
                    <MessageCircle size={20} className="text-ink-300" />
                  </div>
                  <p className="text-sm text-ink-500 font-semibold">
                    {search ? "Aucun résultat" : "Aucune conversation"}
                  </p>
                  {!search && (
                    <p className="text-xs text-ink-400 mt-1 leading-snug">
                      Contacte un artisan depuis sa fiche pour démarrer.
                    </p>
                  )}
                </div>
              ) : (
                <ul>
                  {filtered.map((t) => (
                    <ThreadItem
                      key={t.id}
                      thread={t}
                      onOpen={(thread) => {
                        setActiveThread(thread);
                        // Reset le unread localement le temps que markRead persiste
                        setThreads((prev) => prev.map((p) => p.id === thread.id ? { ...p, unread_count: 0 } : p));
                      }}
                    />
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <Link
              href="/messagerie"
              className="block px-4 py-2.5 border-t border-ink-100 text-center text-[0.78rem] font-extrabold text-brand-600 hover:bg-brand-50 transition"
            >
              Voir tous les messages →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function ThreadItem({ thread, onOpen }: { thread: Thread; onOpen: (t: Thread) => void }) {
  const avatar =
    thread.other_user.profile_photo ??
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(thread.other_user.name)}`;
  const time = thread.last_message_at ? timeAgo(thread.last_message_at) : "";
  const hasUnread = thread.unread_count > 0;

  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(thread)}
        className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 hover:bg-ink-50 transition border-b border-ink-50 last:border-b-0 ${
          hasUnread ? "bg-brand-50/30" : ""
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar}
          alt=""
          className="w-10 h-10 rounded-full object-cover bg-ink-100 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-[0.86rem] truncate ${hasUnread ? "font-extrabold text-ink-800" : "font-bold text-ink-700"}`}>
              {thread.other_user.name}
            </span>
            <span className="text-[0.65rem] text-ink-400 flex-shrink-0">{time}</span>
          </div>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <p className={`text-[0.78rem] truncate ${hasUnread ? "text-ink-700 font-semibold" : "text-ink-400"}`}>
              {thread.last_message_preview || <span className="italic">Conversation vide</span>}
            </p>
            {hasUnread && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-brand-500 text-white text-[0.62rem] font-extrabold inline-flex items-center justify-center flex-shrink-0">
                {thread.unread_count > 9 ? "9+" : thread.unread_count}
              </span>
            )}
          </div>
        </div>
      </button>
    </li>
  );
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "maintenant";
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
