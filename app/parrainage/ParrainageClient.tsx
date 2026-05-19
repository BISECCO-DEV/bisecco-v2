"use client";

import { useState } from "react";
import { Copy, Check, TrendingUp, Users, Award } from "lucide-react";
import { InviteButton } from "@/components/features/InviteButton";

const REFERRAL_CODE = "JEAN-D-2026";
const REFERRAL_URL = "https://bisecco.fr/inscription?ref=JEAN-D-2026";

export function ParrainageClient() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(REFERRAL_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl shadow-card border border-ink-100 p-7 md:p-9">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-7 pb-7 border-b border-ink-100">
        {[
          { value: "0",   label: "Parrainages validés", icon: Users,      color: "text-brand-500" },
          { value: "0€",  label: "Gains cumulés",       icon: TrendingUp, color: "text-emerald-500" },
          { value: "Or",  label: "Statut",              icon: Award,      color: "text-amber-500" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <s.icon size={16} className={`${s.color} mx-auto mb-1.5`} />
            <div className="text-2xl font-bold text-ink-700 tracking-tight">{s.value}</div>
            <div className="text-xs text-ink-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Code parrainage */}
      <div className="mb-4">
        <label className="block text-[0.7rem] font-bold tracking-wider text-ink-400 uppercase mb-2">
          Votre code de parrainage
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-4 py-3 rounded-xl bg-ink-50 border-2 border-ink-100 font-mono font-bold text-ink-700 text-lg tracking-wider">
            {REFERRAL_CODE}
          </div>
          <button
            onClick={copy}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition shadow-[0_4px_12px_rgba(240,122,47,0.3)]"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copié !" : "Copier"}
          </button>
        </div>
      </div>

      {/* URL */}
      <div className="mb-7">
        <label className="block text-[0.7rem] font-bold tracking-wider text-ink-400 uppercase mb-2">
          Lien de parrainage
        </label>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-ink-50 border border-ink-100 text-sm text-ink-600 truncate">
          {REFERRAL_URL}
        </div>
      </div>

      {/* Partage */}
      <div className="text-[0.7rem] font-bold tracking-wider text-ink-400 uppercase mb-3">
        Inviter vos contacts
      </div>
      <InviteButton referralUrl={REFERRAL_URL} variant="primary" className="w-full justify-center" />
      <p className="mt-3 text-[0.72rem] text-ink-400 leading-relaxed">
        Sur Android, votre répertoire s&apos;ouvre directement. Sur iPhone, l&apos;app Messages se lance
        avec votre texte prêt · vous choisissez vos contacts dedans.
        <strong className="text-ink-600"> Les SMS sont envoyés depuis votre forfait</strong>, Bisecco ne facture rien.
      </p>
    </div>
  );
}
