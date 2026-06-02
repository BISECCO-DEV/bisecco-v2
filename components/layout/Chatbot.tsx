"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  ensureConversationAction,
  sendVisitorMessageAction,
  markVisitorReadAction,
} from "@/lib/chat/actions";

// Routes où le chat N'apparait PAS
const HIDDEN_ROUTES = ["/admin", "/maintenance"];

const STORAGE_KEY = "bisecco_chat_session";
const NAME_KEY = "bisecco_chat_name";
const EMAIL_KEY = "bisecco_chat_email";

type Msg = {
  id: number;
  conversation_id: string;
  sender_type: "visitor" | "admin";
  body: string;
  created_at: string;
};

function genToken(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getStored(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStored(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

/** Chatbot support Camille — uniquement pour les VISITEURS non connectés.
 *  Les utilisateurs connectés ont la messagerie réelle (MessageriedDock). */
export function Chatbot({ currentUserId }: { currentUserId?: number | null } = {}) {
  const pathname = usePathname();
  const hidden = (pathname ? HIDDEN_ROUTES.some((r) => pathname.startsWith(r)) : false) || Boolean(currentUserId);

  const [open, setOpen] = useState(false);
  const [convId, setConvId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsIdentity, setNeedsIdentity] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [unread, setUnread] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Init : récupère/crée le token de session et la conv
  const initConversation = useCallback(async () => {
    let token = getStored(STORAGE_KEY);
    if (!token) {
      token = genToken();
      setStored(STORAGE_KEY, token);
    }

    const storedName = getStored(NAME_KEY);
    const storedEmail = getStored(EMAIL_KEY);

    // Si pas d'identité connue, on demande avant de créer la conv
    if (!storedName && !storedEmail) {
      setNeedsIdentity(true);
      return;
    }

    const res = await ensureConversationAction(token, storedName, storedEmail);
    if ("id" in res) {
      setConvId(res.id);
    } else {
      setError(res.error);
    }
  }, []);

  // Charge l'historique quand convId est connu
  useEffect(() => {
    if (!convId) return;
    const supabase = createClient() as unknown as {
      from: (t: string) => {
        select: (c: string) => {
          eq: (c: string, v: string) => {
            order: (c: string, o: { ascending: boolean }) => {
              limit: (n: number) => Promise<{ data: Msg[] | null }>;
            };
          };
        };
      };
    };
    supabase
      .from("chat_messages")
      .select("id, conversation_id, sender_type, body, created_at")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true })
      .limit(200)
      .then(({ data }) => {
        if (data) setMsgs(data ?? []);
      });
  }, [convId]);

  // Realtime subscription
  useEffect(() => {
    if (!convId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`chat:${convId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${convId}`,
        },
        (payload) => {
          const m = payload.new as Msg;
          setMsgs((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
          if (m.sender_type === "admin" && !open) {
            setUnread((u) => u + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [convId, open]);

  // Auto-scroll en bas
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, open]);

  // Marque lu quand on ouvre
  useEffect(() => {
    if (open && convId) {
      const token = getStored(STORAGE_KEY);
      if (token) markVisitorReadAction(token);
      setUnread(0);
    }
  }, [open, convId]);

  // Lance l'init la 1ère fois qu'on ouvre le chat
  useEffect(() => {
    if (open && !convId && !needsIdentity) {
      initConversation();
    }
  }, [open, convId, needsIdentity, initConversation]);

  const submitIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim().slice(0, 80);
    const cleanEmail = email.trim().toLowerCase().slice(0, 191);
    if (!cleanName || !cleanEmail || !cleanEmail.includes("@")) {
      setError("Nom et email requis.");
      return;
    }
    setStored(NAME_KEY, cleanName);
    setStored(EMAIL_KEY, cleanEmail);
    setNeedsIdentity(false);
    setError(null);
    initConversation();
  };

  const send = async (text: string) => {
    const token = getStored(STORAGE_KEY);
    if (!token) return;
    setSending(true);
    setError(null);

    // Optimistic
    const optimistic: Msg = {
      id: -Date.now(),
      conversation_id: convId ?? "",
      sender_type: "visitor",
      body: text,
      created_at: new Date().toISOString(),
    };
    setMsgs((m) => [...m, optimistic]);
    setInput("");

    const res = await sendVisitorMessageAction(token, text);
    setSending(false);
    if ("error" in res) {
      setError(res.error);
      setMsgs((m) => m.filter((x) => x.id !== optimistic.id));
    }
  };

  if (hidden) return null;

  return (
    <>
      {/* Label flottant · visible uniquement chat fermé */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="hidden sm:flex fixed bottom-[34px] lg:bottom-[22px] right-[88px] z-[89] items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-ink-700 font-bold text-[0.84rem] shadow-[0_8px_28px_-6px_rgba(13,30,74,0.25),0_2px_8px_rgba(13,30,74,0.08)] border border-ink-100 hover:-translate-x-0.5 transition-all animate-reveal-up group"
          style={{ animationDelay: "1500ms" }}
          aria-label="Ouvrir le chat avec Camille"
        >
          <span className="relative flex w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
            <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-500" />
          </span>
          Une question ? Discutez avec Camille
          {/* Tail pointing right toward the button */}
          <span
            className="absolute -right-[7px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-r border-t border-ink-100 rotate-45"
            aria-hidden
          />
        </button>
      )}

      {/* Bouton flottant */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-20 lg:bottom-5 right-5 z-[90] w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center shadow-[0_8px_30px_rgba(240,122,47,0.5)] hover:scale-110 transition-transform ${
          open ? "rotate-180" : ""
        }`}
        aria-label={open ? "Fermer le chat" : "Ouvrir le chat"}
      >
        {open ? <X size={22} /> : (
          <>
            <MessageCircle size={22} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 border-2 border-white text-white text-[0.65rem] font-bold flex items-center justify-center">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
            {unread === 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
            )}
          </>
        )}
      </button>

      {/* Panneau */}
      {open && (
        <div className="fixed bottom-[148px] lg:bottom-24 right-5 z-[90] w-[min(380px,calc(100vw-32px))] h-[min(560px,calc(100vh-200px))] lg:h-[min(560px,calc(100vh-120px))] bg-white rounded-3xl shadow-2xl border border-ink-100 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="relative bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 text-white p-5 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-brand-500/30 blur-2xl" />
            <div className="relative flex items-center gap-3">
              <div className="relative w-11 h-11 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=faces&q=85"
                  alt="Camille · Support Bisecco"
                  className="w-11 h-11 rounded-2xl object-cover border-2 border-white/15 shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-ink-800" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold leading-tight">Camille Bisecco</h3>
                <div className="text-xs text-white/65 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  En ligne · Réponse rapide
                </div>
              </div>
            </div>
          </header>

          {/* Contenu : identity OU messages */}
          {needsIdentity ? (
            <form onSubmit={submitIdentity} className="flex-1 p-5 space-y-3 overflow-y-auto">
              <p className="text-sm text-ink-600">
                Pour démarrer la conversation, dites-nous qui vous êtes :
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                required
                maxLength={80}
                className="w-full px-3 py-2.5 rounded-xl bg-ink-50 border border-ink-100 focus:border-brand-500 focus:bg-white outline-none text-sm"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                required
                maxLength={191}
                className="w-full px-3 py-2.5 rounded-xl bg-ink-50 border border-ink-100 focus:border-brand-500 focus:bg-white outline-none text-sm"
              />
              {error && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold transition"
              >
                Démarrer la conversation
              </button>
              <p className="text-[0.65rem] text-ink-400 text-center">
                Vos infos servent uniquement à vous répondre.
              </p>
            </form>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-ink-50/30 to-white">
                {msgs.length === 0 && (
                  <div className="text-center text-sm text-ink-500 py-8">
                    Bonjour ! Comment pouvons-nous vous aider ?
                  </div>
                )}
                {msgs.map((m) => (
                  <div key={m.id} className={`flex ${m.sender_type === "visitor" ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[80%]">
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        m.sender_type === "visitor"
                          ? "bg-brand-500 text-white rounded-br-sm shadow-[0_4px_12px_rgba(240,122,47,0.25)]"
                          : "bg-white border border-ink-100 text-ink-700 rounded-bl-sm shadow-sm"
                      }`}>
                        {m.body}
                      </div>
                      <div className={`text-[0.65rem] text-ink-400 mt-1 ${m.sender_type === "visitor" ? "text-right" : ""}`}>
                        {formatTime(m.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
                {error && (
                  <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); if (input.trim() && !sending) send(input.trim()); }} className="px-3 py-3 border-t border-ink-100 bg-white flex items-end gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Écrivez votre message…"
                  disabled={sending || !convId}
                  maxLength={2000}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-ink-50 border border-ink-100 focus:border-brand-500 focus:bg-white outline-none text-sm placeholder:text-ink-300 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending || !convId}
                  className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 disabled:opacity-40 transition flex-shrink-0"
                  aria-label="Envoyer"
                >
                  <Send size={15} />
                </button>
              </form>

              <div className="px-4 py-2 bg-ink-50 text-[0.65rem] text-ink-400 text-center flex items-center justify-center gap-1.5 border-t border-ink-100">
                <ShieldCheck size={10} /> Conversation sécurisée
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
