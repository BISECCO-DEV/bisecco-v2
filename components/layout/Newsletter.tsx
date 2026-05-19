"use client";

import { useState } from "react";
import { Mail, CheckCircle2, Send } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="bg-gradient-to-br from-ink-700 to-ink-800 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-brand-500/15 blur-2xl pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <Mail size={16} className="text-brand-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">Newsletter</h3>
        </div>
        <p className="text-xs text-white/65 leading-relaxed mb-4">
          Recevez nos meilleurs conseils pour vos travaux et les nouveautés Bisecco. Pas de spam, jamais.
        </p>

        {sent ? (
          <div className="flex items-center gap-2 px-3 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-sm">
            <CheckCircle2 size={14} />
            <span>Merci ! Confirmez votre email pour finaliser l&apos;inscription.</span>
          </div>
        ) : (
          <form onSubmit={submit} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.fr"
              className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 text-sm outline-none focus:border-brand-400 transition"
            />
            <button
              type="submit"
              disabled={loading || !email}
              className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 disabled:opacity-50 transition flex-shrink-0"
              aria-label="S'inscrire"
            >
              <Send size={14} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
