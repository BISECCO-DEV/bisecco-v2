"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { X, Send, Loader2, ChevronUp, ChevronDown, Maximize2, ShieldCheck } from "lucide-react";
import {
  listMessagesAction, sendMessageAction, markThreadReadAction,
} from "@/lib/messages/actions";
import { EmojiPickerButton } from "@/components/features/feed/EmojiPickerButton";

type Msg = {
  id: number;
  sender_id: number;
  body: string;
  created_at: string;
  read_at: string | null;
};

type Props = {
  threadId: number;
  currentUserId: number;
  otherUser: {
    id: number;
    name: string;
    client_number: string | null;
    role: string;
    profile_photo?: string | null;
  };
  onClose: () => void;
};

const POLL_MS = 5000;

/**
 * Fenêtre de chat inline à gauche du dock messagerie — style LinkedIn.
 * - Header avec avatar + nom + 3 actions (minimize / fullscreen / close)
 * - Liste messages (scroll auto en bas)
 * - Polling 5 sec pour nouveaux messages
 * - Input avec emoji + bouton envoyer
 * - Marque le thread comme lu au montage
 */
export function MessageriedChatWindow({ threadId, currentUserId, otherUser, onClose }: Props) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Charge + polling
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await listMessagesAction(threadId);
        if (!cancelled) {
          setMessages(data);
          setLoaded(true);
        }
      } catch {
        if (!cancelled) setLoaded(true);
      }
    };
    load();
    markThreadReadAction(threadId).catch(() => {});
    const interval = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [threadId]);

  // Scroll en bas à chaque nouveau message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const otherAvatar =
    otherUser.profile_photo ??
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(otherUser.name)}`;
  const isPro = otherUser.role === "artisan";
  const otherProfileHref = otherUser.client_number ? `/profil/${otherUser.client_number}` : "#";

  const insertEmoji = (emoji: string) => {
    const el = textareaRef.current;
    if (!el) {
      setInput((c) => c + emoji);
      return;
    }
    const start = el.selectionStart ?? input.length;
    const end = el.selectionEnd ?? input.length;
    setInput(input.slice(0, start) + emoji + input.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + emoji.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const send = () => {
    const text = input.trim();
    if (text.length < 2 || pending) return;
    setError(null);
    startTransition(async () => {
      const res = await sendMessageAction(otherUser.id, text);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setInput("");
      // Recharge la liste pour voir le message envoyé
      const data = await listMessagesAction(threadId);
      setMessages(data);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className={`bg-white rounded-t-2xl shadow-[0_-4px_24px_-4px_rgba(13,30,74,0.2)] border border-ink-100 overflow-hidden flex flex-col transition-all w-[min(360px,calc(100vw-2rem))] ${
      minimized ? "h-[52px]" : "h-[min(500px,calc(100vh-6rem))]"
    }`}>
      {/* HEADER */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-ink-100 bg-white">
        <Link href={otherProfileHref} className="flex-shrink-0 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={otherAvatar}
            alt=""
            className="w-9 h-9 rounded-full object-cover bg-ink-100"
          />
          {isPro && (
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white inline-flex items-center justify-center">
              <ShieldCheck size={8} className="text-white" strokeWidth={3} />
            </span>
          )}
        </Link>
        <Link
          href={otherProfileHref}
          className="flex-1 min-w-0 hover:text-brand-600 transition"
        >
          <div className="font-extrabold text-ink-700 text-[0.86rem] truncate leading-tight">
            {otherUser.name}
          </div>
          <div className="text-[0.65rem] text-ink-400 leading-tight mt-0.5 capitalize">
            {isPro ? "Professionnel" : otherUser.role}
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setMinimized((m) => !m)}
          className="w-7 h-7 rounded-lg hover:bg-ink-100 text-ink-500 inline-flex items-center justify-center transition flex-shrink-0"
          aria-label={minimized ? "Agrandir" : "Réduire"}
        >
          {minimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <Link
          href={`/messagerie/${threadId}`}
          className="w-7 h-7 rounded-lg hover:bg-ink-100 text-ink-500 inline-flex items-center justify-center transition flex-shrink-0"
          aria-label="Ouvrir en plein écran"
          title="Plein écran"
        >
          <Maximize2 size={12} />
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-lg hover:bg-ink-100 text-ink-500 inline-flex items-center justify-center transition flex-shrink-0"
          aria-label="Fermer"
        >
          <X size={14} />
        </button>
      </div>

      {!minimized && (
        <>
          {/* MESSAGES SCROLL */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 bg-ink-50/30">
            {!loaded ? (
              <div className="space-y-2 animate-pulse">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`flex ${i % 2 === 0 ? "" : "justify-end"}`}>
                    <div className="h-9 bg-ink-100 rounded-2xl w-32" />
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-sm text-ink-400">
                Aucun message. Dis bonjour 👋
              </div>
            ) : (
              messages.map((m, i) => {
                const mine = m.sender_id === currentUserId;
                const prev = i > 0 ? messages[i - 1] : null;
                const showAvatar = !mine && (!prev || prev.sender_id !== m.sender_id);
                return (
                  <div key={m.id} className={`flex items-end gap-1.5 ${mine ? "justify-end" : ""}`}>
                    {!mine && (
                      <div className="w-6 h-6 flex-shrink-0">
                        {showAvatar && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={otherAvatar}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover bg-ink-100"
                          />
                        )}
                      </div>
                    )}
                    <div
                      className={`max-w-[260px] px-3 py-2 rounded-2xl text-[0.86rem] leading-snug whitespace-pre-wrap break-words ${
                        mine
                          ? "bg-brand-500 text-white rounded-br-sm"
                          : "bg-white border border-ink-100 text-ink-700 rounded-bl-sm"
                      }`}
                      title={new Date(m.created_at).toLocaleString("fr-FR")}
                    >
                      {m.body}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ERROR */}
          {error && (
            <div className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold border-t border-red-200">
              ⚠ {error}
            </div>
          )}

          {/* INPUT */}
          <div className="border-t border-ink-100 p-2 flex items-end gap-1.5 bg-white">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Écris un message…"
                maxLength={2000}
                className="w-full px-3 py-2 pr-10 rounded-xl border-2 border-ink-200 focus:border-brand-500 outline-none text-sm resize-none max-h-24"
              />
              <div className="absolute bottom-1 right-1">
                <EmojiPickerButton onSelect={insertEmoji} />
              </div>
            </div>
            <button
              type="button"
              onClick={send}
              disabled={pending || input.trim().length < 2}
              className="w-10 h-10 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white inline-flex items-center justify-center transition flex-shrink-0"
              aria-label="Envoyer"
            >
              {pending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
