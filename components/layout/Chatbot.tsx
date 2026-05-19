"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send, Sparkles, ShieldCheck } from "lucide-react";

// Routes où le chatbot N'apparait PAS (admin, maintenance, etc.)
const CHATBOT_HIDDEN_ROUTES = ["/admin", "/maintenance", "/coming-soon"];

type Msg = { id: string; from: "bot" | "user"; text: string; time: string };

const SUGGESTIONS = [
  "Comment trouver un artisan ?",
  "Combien coûte un devis ?",
  "Comment vérifiez-vous les artisans ?",
  "Je suis artisan, comment m'inscrire ?",
];

const BOT_RESPONSES: Record<string, string> = {
  "comment trouver un artisan": "Pour trouver un artisan, allez dans la rubrique « Rechercher » ou demandez un devis directement. Vous recevrez plusieurs propositions d'artisans vérifiés en moins de 24h, gratuitement.",
  "combien coûte un devis": "C'est totalement gratuit ! Vous pouvez demander autant de devis que vous voulez, sans aucun engagement. Bisecco ne prélève aucune commission.",
  "comment vérifiez-vous les artisans": "Chaque artisan doit fournir son numéro SIREN à l'inscription. Nous le contrôlons automatiquement via l'API officielle du gouvernement (recherche-entreprises.api.gouv.fr). Aucun faux profil ne passe.",
  "je suis artisan, comment m'inscrire": "C'est gratuit et ça prend 2 minutes ! Cliquez sur « Inscription » en haut à droite, sélectionnez « Professionnel », ajoutez votre SIREN et c'est parti. Vous recevrez vos premiers leads dans la semaine.",
  default: "Bonne question ! Je peux vous aider sur : la recherche d'un artisan, le fonctionnement des devis, la vérification SIREN, ou l'inscription artisan. Vous pouvez aussi nous écrire directement à contact@bisecco.fr.",
};

function getResponse(query: string): string {
  const q = query.toLowerCase();
  for (const key in BOT_RESPONSES) {
    if (key !== "default" && q.includes(key.split(" ").filter((w) => w.length > 3)[0])) {
      return BOT_RESPONSES[key];
    }
  }
  return BOT_RESPONSES.default;
}

function nowTime() {
  return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function Chatbot() {
  const pathname = usePathname();
  const hidden = pathname ? CHATBOT_HIDDEN_ROUTES.some((r) => pathname.startsWith(r)) : false;

  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "1", from: "bot", text: "Bonjour 👋 Je suis Camille, l'assistante de Bisecco. Comment puis-je vous aider ?", time: nowTime() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, typing]);

  const send = (text: string) => {
    const userMsg: Msg = { id: Date.now().toString(), from: "user", text, time: nowTime() };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { id: Date.now().toString() + "b", from: "bot", text: getResponse(text), time: nowTime() }]);
    }, 1100);
  };

  if (hidden) return null;

  return (
    <>
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
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
          </>
        )}
      </button>

      {/* Panneau chat */}
      {open && (
        <div className="fixed bottom-[148px] lg:bottom-24 right-5 z-[90] w-[min(380px,calc(100vw-32px))] h-[min(560px,calc(100vh-200px))] lg:h-[min(560px,calc(100vh-120px))] bg-white rounded-3xl shadow-2xl border border-ink-100 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <header className="relative bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 text-white p-5 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-brand-500/30 blur-2xl" />
            <div className="relative flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-xl">
                ✨
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold">Camille</h3>
                  <Sparkles size={11} className="text-brand-400" />
                </div>
                <div className="text-xs text-white/65 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  En ligne · Réponse instantanée
                </div>
              </div>
            </div>
          </header>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-ink-50/30 to-white">
            {msgs.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%]`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.from === "user"
                      ? "bg-brand-500 text-white rounded-br-sm shadow-[0_4px_12px_rgba(240,122,47,0.25)]"
                      : "bg-white border border-ink-100 text-ink-700 rounded-bl-sm shadow-sm"
                  }`}>
                    {m.text}
                  </div>
                  <div className={`text-[0.65rem] text-ink-400 mt-1 ${m.from === "user" ? "text-right" : ""}`}>
                    {m.time}
                  </div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white border border-ink-100 flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-ink-300 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-ink-300 animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-ink-300 animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            )}

            {/* Suggestions au démarrage */}
            {msgs.length === 1 && !typing && (
              <div className="space-y-2 mt-2">
                <div className="text-[0.7rem] font-bold tracking-wider uppercase text-ink-400 px-1">
                  Questions fréquentes
                </div>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="block w-full text-left px-3 py-2 rounded-xl bg-white border border-ink-100 hover:border-brand-300 hover:bg-brand-50/30 text-sm text-ink-700 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) send(input); }} className="px-3 py-3 border-t border-ink-100 bg-white flex items-end gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écrivez votre message…"
              className="flex-1 px-3 py-2.5 rounded-xl bg-ink-50 border border-ink-100 focus:border-brand-500 focus:bg-white outline-none text-sm placeholder:text-ink-300"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 disabled:opacity-40 transition flex-shrink-0"
              aria-label="Envoyer"
            >
              <Send size={15} />
            </button>
          </form>

          <div className="px-4 py-2 bg-ink-50 text-[0.65rem] text-ink-400 text-center flex items-center justify-center gap-1.5 border-t border-ink-100">
            <ShieldCheck size={10} /> Conversation sécurisée · Confidentialité respectée
          </div>
        </div>
      )}
    </>
  );
}
