"use client";

import { useState } from "react";
import { Search, Send, Paperclip, MoreVertical, Phone, Star, ChevronLeft, CheckCheck, Plus, Smile } from "lucide-react";

type Conversation = {
  id: string;
  name: string;
  metier: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  rating: number;
};

type Message = {
  id: string;
  text: string;
  time: string;
  fromMe: boolean;
  read?: boolean;
};

const DEMO_CONVERSATIONS: Conversation[] = [
  { id: "1", name: "Jean Dupont",    metier: "Maçon",      avatar: "https://i.pravatar.cc/100?img=12", lastMessage: "Je peux passer demain à 10h si ça vous va.", lastTime: "12:24", unread: 2, online: true,  rating: 4.8 },
  { id: "2", name: "Hugo Martin",    metier: "Carreleur",  avatar: "https://i.pravatar.cc/100?img=33", lastMessage: "Je vous envoie le devis ce soir.",       lastTime: "11:02", unread: 0, online: false, rating: 4.9 },
  { id: "3", name: "Sophie Lambert", metier: "Couvreur",   avatar: "https://i.pravatar.cc/100?img=47", lastMessage: "Merci pour vos précisions !",            lastTime: "Hier",  unread: 0, online: true,  rating: 5.0 },
  { id: "4", name: "Marc Lefevre",   metier: "Menuisier",  avatar: "https://i.pravatar.cc/100?img=68", lastMessage: "C'est noté, à très vite.",               lastTime: "Lun.",  unread: 0, online: false, rating: 4.7 },
  { id: "5", name: "Emma Delcroix",  metier: "Plombier",   avatar: "https://i.pravatar.cc/100?img=48", lastMessage: "Le RDV est confirmé.",                   lastTime: "Dim.",  unread: 0, online: false, rating: 4.6 },
];

const DEMO_MESSAGES: Record<string, Message[]> = {
  "1": [
    { id: "m1", text: "Bonjour Jean, j'aimerais un devis pour rénover ma cuisine de 12m².", time: "10:15", fromMe: true, read: true },
    { id: "m2", text: "Bonjour ! Bien sûr, je peux passer évaluer le chantier. Avez-vous des photos ?", time: "10:32", fromMe: false },
    { id: "m3", text: "Oui je vous envoie ça tout de suite.", time: "10:34", fromMe: true, read: true },
    { id: "m4", text: "Parfait. Je vais regarder et je reviens vers vous avec une fourchette de prix.", time: "10:45", fromMe: false },
    { id: "m5", text: "Merci ! Plutôt en début de semaine prochaine pour passer ?", time: "11:10", fromMe: true, read: true },
    { id: "m6", text: "Je peux passer demain à 10h si ça vous va.", time: "12:24", fromMe: false },
  ],
};

export function MessagerieClient() {
  const [activeId, setActiveId] = useState<string | null>("1");
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);

  const conversations = DEMO_CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.metier.toLowerCase().includes(search.toLowerCase())
  );

  const active = DEMO_CONVERSATIONS.find((c) => c.id === activeId);
  const messages = activeId ? DEMO_MESSAGES[activeId] || [] : [];

  const openChat = (id: string) => {
    setActiveId(id);
    setShowMobileChat(true);
  };

  return (
    <div className="bg-ink-50 h-[calc(100vh-80px)] overflow-hidden">
      <div className="container-default h-full py-6">
        <div className="bg-white rounded-3xl border border-ink-100 shadow-card overflow-hidden h-full grid grid-cols-1 md:grid-cols-[340px_1fr]">

          {/* ═══ SIDEBAR CONVERSATIONS ═══ */}
          <aside className={`border-r border-ink-100 flex flex-col bg-ink-50/40 ${showMobileChat ? "hidden md:flex" : "flex"}`}>
            <div className="p-5 border-b border-ink-100 bg-white">
              <h1 className="text-xl font-bold text-ink-700 mb-3">Messages</h1>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-ink-50 border border-ink-100 focus-within:border-brand-500 focus-within:bg-white transition">
                <Search size={15} className="text-ink-300" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher une conversation…"
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-ink-300"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-ink-400 text-sm">Aucune conversation</div>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => openChat(c.id)}
                    className={`w-full flex items-start gap-3 px-4 py-3 border-b border-ink-100 hover:bg-white transition text-left ${
                      activeId === c.id ? "bg-white" : ""
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.avatar} alt="" className="w-12 h-12 rounded-full border border-ink-100" loading="lazy" />
                      {c.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-ink-700 text-sm truncate">{c.name}</strong>
                        <span className="text-[0.7rem] text-ink-400 flex-shrink-0">{c.lastTime}</span>
                      </div>
                      <div className="text-[0.7rem] text-brand-500 font-semibold">{c.metier} · ★ {c.rating}</div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className={`text-xs truncate ${c.unread > 0 ? "text-ink-700 font-semibold" : "text-ink-400"}`}>
                          {c.lastMessage}
                        </p>
                        {c.unread > 0 && (
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-500 text-white text-[0.65rem] font-bold flex items-center justify-center">
                            {c.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            <button className="m-3 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition shadow-[0_4px_12px_rgba(240,122,47,0.3)]">
              <Plus size={16} /> Nouvelle conversation
            </button>
          </aside>

          {/* ═══ CHAT ACTIF ═══ */}
          <main className={`flex flex-col ${!showMobileChat ? "hidden md:flex" : "flex"}`}>
            {!active ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-ink-50/30">
                <div className="w-20 h-20 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
                  <Send size={32} className="text-brand-500" />
                </div>
                <h2 className="text-lg font-bold text-ink-700">Sélectionnez une conversation</h2>
                <p className="text-sm text-ink-400 mt-2 max-w-xs">
                  Choisissez un artisan dans la liste pour démarrer ou continuer une discussion.
                </p>
              </div>
            ) : (
              <>
                {/* Header chat */}
                <header className="px-5 py-4 border-b border-ink-100 flex items-center gap-3 bg-white">
                  <button
                    onClick={() => setShowMobileChat(false)}
                    className="md:hidden p-1 -ml-1 text-ink-500"
                    aria-label="Retour"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="relative flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={active.avatar} alt="" className="w-11 h-11 rounded-full border border-ink-100" />
                    {active.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <strong className="text-ink-700">{active.name}</strong>
                      <Star size={11} fill="#f07a2f" className="text-brand-500" />
                      <span className="text-xs font-bold text-ink-600">{active.rating}</span>
                    </div>
                    <div className="text-xs text-ink-400">
                      {active.metier} · {active.online ? <span className="text-emerald-600 font-semibold">En ligne</span> : "Hors ligne"}
                    </div>
                  </div>
                  <button className="w-9 h-9 rounded-lg hover:bg-ink-50 flex items-center justify-center text-ink-500" aria-label="Appeler">
                    <Phone size={16} />
                  </button>
                  <button className="w-9 h-9 rounded-lg hover:bg-ink-50 flex items-center justify-center text-ink-500" aria-label="Plus">
                    <MoreVertical size={16} />
                  </button>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-ink-50/30 to-white space-y-3">
                  <div className="text-center my-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-ink-100 text-[0.7rem] text-ink-500 font-semibold">
                      Aujourd&apos;hui
                    </span>
                  </div>

                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] flex ${m.fromMe ? "flex-row-reverse" : ""} items-end gap-2`}>
                        {!m.fromMe && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={active.avatar} alt="" className="w-7 h-7 rounded-full flex-shrink-0" />
                        )}
                        <div>
                          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            m.fromMe
                              ? "bg-brand-500 text-white rounded-br-sm shadow-[0_4px_12px_rgba(240,122,47,0.2)]"
                              : "bg-white border border-ink-100 text-ink-700 rounded-bl-sm shadow-sm"
                          }`}>
                            {m.text}
                          </div>
                          <div className={`text-[0.65rem] text-ink-400 mt-1 flex items-center gap-1 ${m.fromMe ? "justify-end" : ""}`}>
                            {m.time}
                            {m.fromMe && m.read && <CheckCheck size={11} className="text-blue-500" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <form
                  onSubmit={(e) => { e.preventDefault(); setText(""); }}
                  className="px-4 py-3 border-t border-ink-100 bg-white flex items-end gap-2"
                >
                  <button type="button" className="w-10 h-10 rounded-lg hover:bg-ink-50 flex items-center justify-center text-ink-400 flex-shrink-0" aria-label="Pièce jointe">
                    <Paperclip size={18} />
                  </button>
                  <div className="flex-1 flex items-end gap-2 px-3 py-1.5 rounded-2xl bg-ink-50 border border-ink-100 focus-within:border-brand-500 focus-within:bg-white transition">
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Écrivez un message…"
                      rows={1}
                      className="flex-1 bg-transparent outline-none text-sm resize-none py-2 max-h-32 placeholder:text-ink-300"
                    />
                    <button type="button" className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-ink-400 flex-shrink-0" aria-label="Emoji">
                      <Smile size={16} />
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!text.trim()}
                    className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition flex-shrink-0 shadow-[0_4px_12px_rgba(240,122,47,0.3)]"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
