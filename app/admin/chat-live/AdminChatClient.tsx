"use client";

import { useEffect, useRef, useState } from "react";
import { Send, X, Mail, User as UserIcon, CheckCircle2, Circle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  sendAdminMessageAction,
  markAdminReadAction,
  closeConversationAction,
} from "@/lib/chat/actions";

type Conversation = {
  id: string;
  session_token: string;
  user_id: number | null;
  visitor_name: string | null;
  visitor_email: string | null;
  status: "open" | "closed";
  unread_admin_count: number;
  last_message_at: string | null;
  last_message_preview: string | null;
  created_at: string;
};

type Msg = {
  id: number;
  conversation_id: string;
  sender_type: "visitor" | "admin";
  body: string;
  created_at: string;
};

function formatRelative(iso: string | null): string {
  if (!iso) return "·";
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function AdminChatClient({ initialConversations }: { initialConversations: Conversation[] }) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(initialConversations[0]?.id ?? null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState<"open" | "all" | "closed">("open");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = conversations.filter((c) => filter === "all" || c.status === filter);
  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  // Load messages of selected conversation
  useEffect(() => {
    if (!selectedId) {
      setMsgs([]);
      return;
    }
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
      .eq("conversation_id", selectedId)
      .order("created_at", { ascending: true })
      .limit(500)
      .then(({ data }) => {
        if (data) setMsgs(data);
      });
    markAdminReadAction(selectedId);
    setConversations((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, unread_admin_count: 0 } : c))
    );
  }, [selectedId]);

  // Realtime : nouveaux messages + maj conversations
  useEffect(() => {
    const supabase = createClient();
    const ch = supabase
      .channel("admin-chat-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const m = payload.new as Msg;
          if (m.conversation_id === selectedId) {
            setMsgs((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
            if (m.sender_type === "visitor") markAdminReadAction(m.conversation_id);
          }
          setConversations((prev) =>
            prev.map((c) =>
              c.id === m.conversation_id
                ? {
                    ...c,
                    last_message_at: m.created_at,
                    last_message_preview: m.body.slice(0, 120),
                    unread_admin_count:
                      m.sender_type === "visitor" && c.id !== selectedId
                        ? c.unread_admin_count + 1
                        : c.unread_admin_count,
                  }
                : c
            )
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_conversations" },
        (payload) => {
          const c = payload.new as Conversation;
          setConversations((prev) => (prev.some((x) => x.id === c.id) ? prev : [c, ...prev]));
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [selectedId]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs]);

  const send = async () => {
    if (!selectedId || !input.trim() || sending) return;
    const text = input.trim();
    setSending(true);

    const optimistic: Msg = {
      id: -Date.now(),
      conversation_id: selectedId,
      sender_type: "admin",
      body: text,
      created_at: new Date().toISOString(),
    };
    setMsgs((m) => [...m, optimistic]);
    setInput("");

    const res = await sendAdminMessageAction(selectedId, text);
    setSending(false);
    if ("error" in res) {
      setMsgs((m) => m.filter((x) => x.id !== optimistic.id));
      setToastMsg(res.error);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  const close = async () => {
    if (!selectedId) return;
    if (!confirm("Fermer cette conversation ?")) return;
    await closeConversationAction(selectedId);
    setConversations((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, status: "closed" } : c))
    );
  };

  return (
    <>
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-red-500 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-bold animate-fade-in">
          {toastMsg}
        </div>
      )}
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 h-[calc(100vh-220px)] min-h-[500px]">
      {/* Sidebar conversations */}
      <aside className="bg-white rounded-2xl border border-ink-100 overflow-hidden flex flex-col">
        <div className="flex border-b border-ink-100">
          {(["open", "all", "closed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                filter === f
                  ? "text-brand-600 border-b-2 border-brand-500 bg-brand-50/30"
                  : "text-ink-400 hover:text-ink-600"
              }`}
            >
              {f === "open" ? "Ouvertes" : f === "closed" ? "Fermées" : "Toutes"}
              <span className="ml-1 opacity-60">
                ({conversations.filter((c) => f === "all" || c.status === f).length})
              </span>
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-ink-400">Aucune conversation</div>
          ) : (
            filtered.map((c) => {
              const active = c.id === selectedId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full text-left px-4 py-3 border-b border-ink-100 transition ${
                    active ? "bg-brand-50/50" : "hover:bg-ink-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <UserIcon size={14} className="text-ink-400 flex-shrink-0" />
                      <span className="font-bold text-sm text-ink-700 truncate">
                        {c.visitor_name ?? c.visitor_email ?? "Visiteur"}
                      </span>
                    </div>
                    {c.unread_admin_count > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[0.65rem] font-bold flex-shrink-0">
                        {c.unread_admin_count}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-500 truncate">
                    {c.last_message_preview ?? "·"}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[0.65rem] text-ink-400">{formatRelative(c.last_message_at)}</span>
                    {c.status === "closed" ? (
                      <span className="text-[0.65rem] text-ink-400 flex items-center gap-0.5">
                        <CheckCircle2 size={9} /> fermée
                      </span>
                    ) : (
                      <span className="text-[0.65rem] text-emerald-600 flex items-center gap-0.5">
                        <Circle size={9} className="fill-emerald-500 stroke-none" /> ouverte
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Chat panel */}
      <section className="bg-white rounded-2xl border border-ink-100 overflow-hidden flex flex-col">
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-ink-400 text-sm">
            Sélectionnez une conversation
          </div>
        ) : (
          <>
            <header className="p-4 border-b border-ink-100 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-bold text-ink-700 truncate">
                  {selected.visitor_name ?? "Visiteur"}
                </h2>
                <div className="flex items-center gap-3 text-xs text-ink-500 mt-0.5">
                  {selected.visitor_email && (
                    <span className="flex items-center gap-1">
                      <Mail size={11} /> {selected.visitor_email}
                    </span>
                  )}
                  <span>{formatRelative(selected.created_at)}</span>
                </div>
              </div>
              {selected.status === "open" && (
                <button
                  onClick={close}
                  className="px-3 py-1.5 rounded-lg bg-ink-50 hover:bg-red-50 text-ink-600 hover:text-red-600 text-xs font-bold inline-flex items-center gap-1 transition"
                >
                  <X size={12} /> Fermer
                </button>
              )}
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-ink-50/20 to-white">
              {msgs.length === 0 ? (
                <div className="text-center text-sm text-ink-400 py-8">
                  Aucun message dans cette conversation.
                </div>
              ) : (
                msgs.map((m) => (
                  <div key={m.id} className={`flex ${m.sender_type === "admin" ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[75%]">
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        m.sender_type === "admin"
                          ? "bg-brand-500 text-white rounded-br-sm"
                          : "bg-white border border-ink-100 text-ink-700 rounded-bl-sm shadow-sm"
                      }`}>
                        {m.body}
                      </div>
                      <div className={`text-[0.65rem] text-ink-400 mt-1 ${m.sender_type === "admin" ? "text-right" : ""}`}>
                        {formatTime(m.created_at)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selected.status === "open" ? (
              <form
                onSubmit={(e) => { e.preventDefault(); send(); }}
                className="p-3 border-t border-ink-100 flex items-end gap-2 bg-white"
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Réponse… (Entrée pour envoyer, Maj+Entrée = nouvelle ligne)"
                  rows={2}
                  maxLength={2000}
                  disabled={sending}
                  className="flex-1 px-3 py-2 rounded-xl bg-ink-50 border border-ink-100 focus:border-brand-500 focus:bg-white outline-none text-sm resize-none disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 disabled:opacity-40 transition flex-shrink-0"
                  aria-label="Envoyer"
                >
                  <Send size={15} />
                </button>
              </form>
            ) : (
              <div className="p-4 border-t border-ink-100 bg-ink-50 text-center text-sm text-ink-500">
                Conversation fermée
              </div>
            )}
          </>
        )}
      </section>
    </div>
    </>
  );
}
