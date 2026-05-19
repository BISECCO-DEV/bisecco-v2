"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, MessageSquare, User, FileText, Send } from "lucide-react";

const REASONS = [
  { id: "fake-profile",  label: "Faux profil / arnaque",        icon: User,         color: "text-red-500" },
  { id: "fake-review",   label: "Faux avis ou avis acheté",     icon: AlertTriangle, color: "text-amber-500" },
  { id: "harassment",    label: "Harcèlement / abus",           icon: MessageSquare, color: "text-purple-500" },
  { id: "siren-error",   label: "Numéro SIREN incorrect",       icon: FileText,     color: "text-blue-500" },
  { id: "other",         label: "Autre problème",                icon: AlertTriangle, color: "text-ink-500" },
];

export function SignalerForm() {
  const [reason, setReason] = useState("");
  const [target, setTarget] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="bg-white rounded-3xl shadow-card border border-ink-100 p-10 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-4">
          <CheckCircle2 size={32} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-ink-700">Signalement envoyé</h2>
        <p className="text-ink-500 mt-2 max-w-md mx-auto">
          Merci de votre vigilance. Notre équipe étudie votre signalement et reviendra vers vous sous 48h si nécessaire.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-3xl shadow-card border border-ink-100 p-7 md:p-8 space-y-5">
      <div>
        <label className="block text-sm font-bold text-ink-600 mb-3">Type de problème</label>
        <div className="grid sm:grid-cols-2 gap-2">
          {REASONS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setReason(r.id)}
              className={`flex items-start gap-3 p-3 rounded-xl text-left transition ${
                reason === r.id
                  ? "bg-brand-50 border-2 border-brand-500"
                  : "bg-ink-50/60 border-2 border-ink-100 hover:border-brand-300"
              }`}
            >
              <r.icon size={18} className={`${r.color} flex-shrink-0 mt-0.5`} />
              <span className="text-sm font-bold text-ink-700">{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-ink-600 mb-1.5">
          Profil / contenu concerné <span className="font-normal text-ink-300">(URL ou nom)</span>
        </label>
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="ex: https://bisecco.fr/profil/123 ou « Jean Dupont »"
          className="w-full px-4 py-3 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-ink-600 mb-1.5">
          Description détaillée <span className="text-ink-300 font-normal">(min. 20 caractères)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
          placeholder="Décrivez précisément ce qui pose problème. Plus vous êtes précis·e, plus nous pouvons agir efficacement."
          className="w-full px-4 py-3 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm resize-y"
        />
        <div className="text-xs text-ink-400 mt-1 text-right">{description.length} caractères</div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-xs text-blue-800">
        <ShieldAlert size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Confidentialité garantie</strong> : votre signalement est anonyme vis-à-vis de la personne signalée. Seule notre équipe modération y a accès.
        </p>
      </div>

      <button
        type="submit"
        disabled={!reason || description.length < 20 || submitting}
        className="btn-primary w-full disabled:opacity-50"
      >
        {submitting ? "Envoi…" : (<><Send size={15} /> Envoyer le signalement</>)}
      </button>
    </form>
  );
}

function ShieldAlert(props: { size?: number; className?: string }) {
  return <AlertTriangle {...props} />;
}
