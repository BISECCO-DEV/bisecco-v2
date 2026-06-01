"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search, Send, ChevronLeft, MessageSquare, Smile, Paperclip, Bold, Italic,
  ShieldCheck, MapPin, Briefcase, FileText, Info, Flag, ExternalLink, Phone, Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  listThreadsAction,
  listMessagesAction,
  sendMessageAction,
  markThreadReadAction,
  getThreadPanelDataAction,
  deleteThreadAction,
  type ThreadPanelData,
} from "@/lib/messages/actions";
import { playNotificationSound } from "@/lib/notifications/sound";
import { CtaButton } from "@/components/ui/CtaButton";
import { artisanProfilePath } from "@/lib/utils";

type Thread = {
  id: number;
  other_user: { id: number; name: string; client_number: string | null; role: string };
  last_message_at: string | null;
  last_message_preview: string | null;
  unread_count: number;
};

type Msg = { id: number; sender_id: number; body: string; created_at: string; read_at: string | null };

// ─── Utils ────────────────────────────────────────────────────────────────
function timeFor(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function fullTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

function formatDateSeparator(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayD = new Date(d);
  dayD.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - dayD.getTime()) / 86400000);
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Hier";
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

const CATEGORY_LABELS: Record<string, string> = {
  batiment:            "Bâtiment & second œuvre",
  facade_equipement:   "Façade & équipement",
  services_techniques: "Services techniques",
  metiers_bouche:      "Métiers de bouche",
  services_proximite:  "Services à la personne",
};

// ─── Component ────────────────────────────────────────────────────────────
export function MessagerieClient({ currentUserId, initialThreadId }: { currentUserId: number; initialThreadId?: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(initialThreadId ?? null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [panel, setPanel] = useState<ThreadPanelData | null>(null);
  const [showPanelMobile, setShowPanelMobile] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const selected = threads.find((t) => t.id === selectedId);

  const loadThreads = useCallback(async () => {
    const list = await listThreadsAction();
    setThreads(list);
  }, []);

  useEffect(() => { loadThreads(); }, [loadThreads]);

  useEffect(() => {
    const t = searchParams.get("thread");
    if (t) {
      const id = parseInt(t, 10);
      if (!Number.isNaN(id)) setSelectedId(id);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!selectedId) {
      setMsgs([]);
      setPanel(null);
      return;
    }
    listMessagesAction(selectedId).then(setMsgs);
    markThreadReadAction(selectedId).then(() => {
      setThreads((prev) => prev.map((t) => (t.id === selectedId ? { ...t, unread_count: 0 } : t)));
    });
  }, [selectedId]);

  // Charger les détails du user sélectionné pour le panneau droit
  useEffect(() => {
    if (!selected) {
      setPanel(null);
      return;
    }
    getThreadPanelDataAction(selected.other_user.id).then(setPanel);
  }, [selected]);

  // Realtime
  useEffect(() => {
    const supabase = createClient();
    const ch = supabase
      .channel("messagerie-user")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const m = payload.new as Msg & { thread_id: number };
          if (m.thread_id === selectedId) {
            setMsgs((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
            if (m.sender_id !== currentUserId) {
              markThreadReadAction(selectedId);
              playNotificationSound();
            }
          } else if (m.sender_id !== currentUserId) {
            playNotificationSound();
          }
          loadThreads();
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [selectedId, currentUserId, loadThreads]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs]);

  const filteredThreads = threads.filter((t) =>
    !search || t.other_user.name.toLowerCase().includes(search.toLowerCase()),
  );

  const send = async () => {
    if (!selected || !input.trim() || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    setError(null);

    const optimistic: Msg = {
      id: -Date.now(),
      sender_id: currentUserId,
      body: text,
      created_at: new Date().toISOString(),
      read_at: null,
    };
    setMsgs((m) => [...m, optimistic]);

    const res = await sendMessageAction(selected.other_user.id, text);
    setSending(false);
    if (!res.ok) {
      setError(res.error);
      setMsgs((m) => m.filter((x) => x.id !== optimistic.id));
    }
  };

  // Groupage des messages par jour pour les séparateurs
  const groupedMsgs: Array<{ date: string; messages: Msg[] }> = [];
  let currentDay: string | null = null;
  for (const m of msgs) {
    const d = dayKey(m.created_at);
    if (d !== currentDay) {
      groupedMsgs.push({ date: m.created_at, messages: [m] });
      currentDay = d;
    } else {
      groupedMsgs[groupedMsgs.length - 1].messages.push(m);
    }
  }

  return (
    <div className="bg-sand-50 min-h-[calc(100vh-80px)]">
      <div className="container-default py-5">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-4 h-[calc(100vh-120px)] min-h-[600px]">

          {/* ═══════════ COLONNE 1 · INBOX ═══════════ */}
          <aside className={`bg-white rounded-2xl border border-sand-200 overflow-hidden flex flex-col ${selectedId ? "hidden lg:flex" : "flex"}`}>
            {/* Header inbox */}
            <div className="p-4 border-b border-sand-200">
              <div className="flex items-center justify-between mb-3.5">
                <h1 className="font-display font-semibold text-[1.2rem] tracking-tight text-ink-900 inline-flex items-center gap-2">
                  Votre Inbox
                </h1>
                <span className="text-[0.7rem] text-ink-400 font-medium">
                  {threads.length} ouverte{threads.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un contact…"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-sand-50 border border-sand-200 focus:border-brand-500 focus:bg-white outline-none text-[0.84rem]"
                />
              </div>
            </div>

            {/* Liste des conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredThreads.length === 0 ? (
                <div className="p-8 text-center text-sm text-ink-400">
                  <MessageSquare size={28} className="mx-auto text-ink-200 mb-2" />
                  {search ? "Aucun résultat" : "Aucune conversation. Cliquez sur \"Contacter\" depuis un profil pour démarrer."}
                </div>
              ) : (
                filteredThreads.map((t) => {
                  const active = t.id === selectedId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedId(t.id)}
                      className={`w-full text-left px-4 py-3 border-b border-sand-200 last:border-b-0 transition relative ${
                        active ? "bg-brand-50/60" : "hover:bg-sand-50"
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r bg-brand-500" aria-hidden />
                      )}
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-display font-semibold text-white flex-shrink-0 ${
                          t.other_user.role === "artisan" ? "bg-gradient-to-br from-brand-500 to-orange-300" : "bg-gradient-to-br from-info to-blue-400"
                        }`}>
                          {t.other_user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-[0.86rem] text-ink-900 truncate">{t.other_user.name}</span>
                            <span className="text-[0.66rem] text-ink-400 flex-shrink-0 font-mono">{timeFor(t.last_message_at)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-0.5">
                            <p className="text-[0.78rem] text-ink-500 truncate">{t.last_message_preview ?? "·"}</p>
                            {t.unread_count > 0 && (
                              <span className="bg-red-500 text-white text-[0.6rem] font-bold rounded-full min-w-[18px] h-[18px] px-1.5 flex items-center justify-center flex-shrink-0">
                                {t.unread_count > 9 ? "9+" : t.unread_count}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* ═══════════ COLONNE 2 · CHAT ═══════════ */}
          <section className={`bg-white rounded-2xl border border-sand-200 overflow-hidden flex flex-col ${selectedId ? "flex" : "hidden lg:flex"}`}>
            {!selected ? (
              <div className="flex-1 flex flex-col items-center justify-center text-ink-400 text-sm gap-3">
                <MessageSquare size={36} className="text-sand-300" />
                <p>Sélectionnez une conversation pour commencer</p>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <header className="px-5 py-3.5 border-b border-sand-200 flex items-center gap-3">
                  <button
                    onClick={() => { setSelectedId(null); router.push("/messagerie"); }}
                    className="lg:hidden text-ink-500 hover:text-brand-500"
                    aria-label="Retour à la liste"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className={`w-9 h-9 rounded-full font-display font-semibold text-white flex items-center justify-center flex-shrink-0 ${
                    selected.other_user.role === "artisan" ? "bg-gradient-to-br from-brand-500 to-orange-300" : "bg-gradient-to-br from-info to-blue-400"
                  }`}>
                    {selected.other_user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-display font-semibold text-[0.96rem] text-ink-900 truncate">{selected.other_user.name}</h2>
                      <span className="text-[0.66rem] text-ink-400 font-medium">·</span>
                      <span className="text-[0.7rem] text-ink-500 capitalize">{selected.other_user.role}</span>
                    </div>
                    <p className="text-[0.7rem] text-ink-400 mt-0.5 inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden /> En ligne
                    </p>
                  </div>
                  {/* Bouton appeler (si téléphone disponible) */}
                  {panel?.phone && (
                    <a
                      href={`tel:${panel.phone.replace(/[\s.()-]/g, "")}`}
                      className="w-9 h-9 rounded-md border border-sand-200 grid place-items-center text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition"
                      aria-label={`Appeler ${selected.other_user.name}`}
                      title={`Appeler ${panel.phone}`}
                    >
                      <Phone size={16} />
                    </a>
                  )}
                  {/* Bouton supprimer la conversation */}
                  <button
                    type="button"
                    onClick={async () => {
                      if (!selected) return;
                      const ok = window.confirm(
                        `Supprimer la conversation avec ${selected.other_user.name} ?\n\nTous les messages échangés seront définitivement effacés des deux côtés.`,
                      );
                      if (!ok) return;
                      const res = await deleteThreadAction(selected.id);
                      if (res.ok) {
                        setSelectedId(null);
                        router.push("/messagerie");
                        router.refresh();
                      } else {
                        alert(res.error ?? "Erreur lors de la suppression.");
                      }
                    }}
                    className="w-9 h-9 rounded-md border border-sand-200 grid place-items-center text-red-500 hover:bg-red-50 hover:border-red-300 transition"
                    aria-label="Supprimer la conversation"
                    title="Supprimer la conversation"
                  >
                    <Trash2 size={16} />
                  </button>
                  {/* Bouton mobile pour ouvrir le panneau droit */}
                  <button
                    type="button"
                    onClick={() => setShowPanelMobile((s) => !s)}
                    className="lg:hidden w-9 h-9 rounded-md border border-sand-200 grid place-items-center text-ink-500 hover:bg-sand-50"
                    aria-label="Infos contact"
                  >
                    <Info size={16} />
                  </button>
                </header>

                {/* Messages scroll area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-sand-50/50">
                  {groupedMsgs.length === 0 ? (
                    <div className="text-center text-sm text-ink-400 py-8">
                      Aucun message. Soyez le premier à dire bonjour !
                    </div>
                  ) : (
                    groupedMsgs.map((group, gi) => (
                      <div key={`g-${gi}`} className="space-y-2.5">
                        {/* Date separator */}
                        <div className="flex items-center justify-center my-3">
                          <span className="bg-white border border-sand-200 px-3 py-1 rounded-full text-[0.66rem] font-medium text-ink-500 font-display capitalize">
                            {formatDateSeparator(group.date)}
                          </span>
                        </div>
                        {group.messages.map((m) => {
                          const fromMe = m.sender_id === currentUserId;
                          return (
                            <div key={m.id} className={`flex ${fromMe ? "justify-end" : "justify-start"}`}>
                              <div className="max-w-[75%]">
                                <div className={`px-4 py-2.5 text-[0.86rem] leading-relaxed whitespace-pre-wrap shadow-sm ${
                                  fromMe
                                    ? "bg-brand-500 text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-md"
                                    : "bg-white border border-sand-200 text-ink-900 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-md"
                                }`}>
                                  {m.body}
                                </div>
                                <div className={`text-[0.64rem] text-ink-400 mt-1 font-mono ${fromMe ? "text-right" : ""}`}>
                                  {fullTime(m.created_at)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))
                  )}
                  {error && (
                    <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>
                  )}
                </div>

                {/* Composer riche */}
                <form
                  onSubmit={(e) => { e.preventDefault(); if (input.trim() && !sending) send(); }}
                  className="border-t border-sand-200 bg-white"
                >
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (input.trim() && !sending) send();
                      }
                    }}
                    placeholder="Écrivez un message…"
                    rows={2}
                    maxLength={4000}
                    disabled={sending}
                    className="w-full px-5 pt-3.5 pb-2 bg-transparent border-0 outline-none text-[0.88rem] resize-none disabled:opacity-60"
                  />
                  <div className="flex items-center justify-between px-3 pb-3 gap-2">
                    <div className="flex items-center gap-0.5 text-ink-400">
                      <button
                        type="button"
                        title="Gras (bientôt)"
                        className="w-8 h-8 rounded-md hover:bg-sand-100 grid place-items-center hover:text-ink-700 transition"
                      >
                        <Bold size={14} />
                      </button>
                      <button
                        type="button"
                        title="Italique (bientôt)"
                        className="w-8 h-8 rounded-md hover:bg-sand-100 grid place-items-center hover:text-ink-700 transition"
                      >
                        <Italic size={14} />
                      </button>
                      <span className="w-px h-4 bg-sand-200 mx-1" aria-hidden />
                      <button
                        type="button"
                        title="Emoji (bientôt)"
                        className="w-8 h-8 rounded-md hover:bg-sand-100 grid place-items-center hover:text-ink-700 transition"
                      >
                        <Smile size={14} />
                      </button>
                      <button
                        type="button"
                        title="Joindre un fichier (bientôt)"
                        className="w-8 h-8 rounded-md hover:bg-sand-100 grid place-items-center hover:text-ink-700 transition"
                      >
                        <Paperclip size={14} />
                      </button>
                    </div>
                    <CtaButton
                      type="submit"
                      variant="primary"
                      size="sm"
                      icon={Send}
                      disabled={!input.trim() || sending}
                    >
                      Envoyer
                    </CtaButton>
                  </div>
                </form>
              </>
            )}
          </section>

          {/* ═══════════ COLONNE 3 · PANNEAU UTILISATEUR ═══════════ */}
          <aside className={`bg-white rounded-2xl border border-sand-200 overflow-hidden flex-col ${
            selected ? (showPanelMobile ? "flex absolute inset-4 z-10 lg:relative lg:inset-auto lg:flex" : "hidden lg:flex") : "hidden lg:flex"
          }`}>
            {!selected || !panel ? (
              <div className="flex-1 flex flex-col items-center justify-center text-ink-400 text-sm gap-2 p-6">
                <Info size={28} className="text-sand-300" />
                <p className="text-center">Les informations de contact apparaîtront ici</p>
              </div>
            ) : (
              <>
                {/* Mobile close button */}
                <div className="lg:hidden flex justify-end p-2">
                  <button
                    type="button"
                    onClick={() => setShowPanelMobile(false)}
                    className="w-8 h-8 rounded-md hover:bg-sand-100 grid place-items-center text-ink-500"
                    aria-label="Fermer"
                  >
                    <ChevronLeft size={16} className="rotate-180" />
                  </button>
                </div>

                {/* Header avec avatar */}
                <div className="px-5 py-4 text-center border-b border-sand-200">
                  <div className={`w-20 h-20 rounded-2xl mx-auto mb-3 grid place-items-center font-display font-semibold text-white text-2xl ${
                    panel.role === "artisan" ? "bg-gradient-to-br from-brand-500 to-orange-300" : "bg-gradient-to-br from-info to-blue-400"
                  }`}>
                    {panel.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="font-display font-semibold text-[1rem] text-ink-900 leading-tight">{panel.name}</h3>
                  <div className="text-[0.74rem] text-ink-500 mt-0.5 capitalize">
                    {panel.role}
                    {panel.role === "artisan" && panel.validation_status === "approved" && (
                      <span className="inline-flex items-center gap-1 ml-2 text-emerald-600 font-medium">
                        <ShieldCheck size={11} /> Vérifié
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats compactes */}
                <div className="grid grid-cols-2 border-b border-sand-200">
                  <div className="text-center py-3 border-r border-sand-200">
                    <div className="font-display font-semibold text-[1rem] text-ink-900">{panel.messages_count}</div>
                    <div className="text-[0.62rem] text-ink-400 uppercase tracking-wider mt-0.5">Messages</div>
                  </div>
                  <div className="text-center py-3">
                    <div className="font-display font-semibold text-[1rem] text-ink-900">{panel.quotes_count}</div>
                    <div className="text-[0.62rem] text-ink-400 uppercase tracking-wider mt-0.5">Devis</div>
                  </div>
                </div>

                {/* Infos détails */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <div className="text-[0.66rem] font-semibold text-ink-400 uppercase tracking-[0.08em] mb-3">
                    Informations
                  </div>
                  <dl className="space-y-3 text-[0.82rem]">
                    {panel.city && (
                      <div className="flex items-center gap-2.5">
                        <MapPin size={14} className="text-ink-400 flex-shrink-0" />
                        <dt className="sr-only">Ville</dt>
                        <dd className="text-ink-700">{panel.city}</dd>
                      </div>
                    )}
                    {panel.role === "artisan" && panel.metier_name && (
                      <div className="flex items-center gap-2.5">
                        <Briefcase size={14} className="text-ink-400 flex-shrink-0" />
                        <dt className="sr-only">Métier</dt>
                        <dd className="text-ink-700">
                          {panel.metier_name}
                          {panel.metier_category && (
                            <span className="text-ink-400"> · {CATEGORY_LABELS[panel.metier_category] ?? panel.metier_category}</span>
                          )}
                        </dd>
                      </div>
                    )}
                    {panel.role === "artisan" && panel.company_name && (
                      <div className="flex items-start gap-2.5">
                        <FileText size={14} className="text-ink-400 flex-shrink-0 mt-0.5" />
                        <dt className="sr-only">Entreprise</dt>
                        <dd className="text-ink-700">{panel.company_name}</dd>
                      </div>
                    )}
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 flex-shrink-0 grid place-items-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </span>
                      <dt className="sr-only">Statut</dt>
                      <dd className="text-ink-700">En ligne</dd>
                    </div>
                  </dl>

                  {/* Actions */}
                  <div className="mt-6 space-y-2">
                    {panel.role === "artisan" && panel.client_number && (
                      <Link
                        href={artisanProfilePath(panel.name, panel.client_number)}
                        className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-sand-50 border border-sand-200 hover:bg-white hover:border-brand-200 text-[0.82rem] font-medium text-ink-700 transition"
                      >
                        <span className="inline-flex items-center gap-2">
                          <ExternalLink size={13} />
                          Voir le profil complet
                        </span>
                      </Link>
                    )}
                    <Link
                      href={`/signaler?type=user&id=${panel.id}`}
                      className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-sand-50 border border-sand-200 hover:bg-red-50 hover:border-red-200 hover:text-red-700 text-[0.82rem] font-medium text-ink-700 transition"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Flag size={13} />
                        Signaler ce contact
                      </span>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
