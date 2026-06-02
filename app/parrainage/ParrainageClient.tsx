"use client";

import Link from "next/link";
import { useState } from "react";
import { Copy, Check, TrendingUp, Users, Award, LogIn } from "lucide-react";
import { InviteButton } from "@/components/features/InviteButton";
import { CtaButton } from "@/components/ui/CtaButton";

type Props = {
  referralCode: string | null;
  stats: { validated: number; signed_up: number };
  signedIn: boolean;
};

export function ParrainageClient({ referralCode, stats, signedIn }: Props) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // baseUrl côté client : window.location.origin permet de marcher en local + prod sans hardcoder
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://bisecco.fr";
  const referralUrl = referralCode
    ? `${baseUrl}/r/${referralCode}`
    : `${baseUrl}/inscription`;

  const copyCode = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // ─── Non connecté · CTA inscription ───────────────────────────────────
  if (!signedIn) {
    return (
      <div className="bg-white rounded-3xl border border-sand-200 shadow-[0_10px_30px_-10px_rgba(13,30,74,0.12)] p-8 md:p-10 text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 grid place-items-center mx-auto mb-5 text-brand-500">
          <LogIn size={24} strokeWidth={2} />
        </div>
        <h3 className="font-display font-semibold text-[1.4rem] tracking-tight text-ink-900">
          Connectez-vous pour parrainer
        </h3>
        <p className="text-ink-500 mt-2 max-w-md mx-auto leading-relaxed">
          Créez votre compte ou connectez-vous pour récupérer votre code de
          parrainage personnel et inviter vos proches.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <CtaButton href="/inscription" variant="primary" size="md">
            Créer mon compte
          </CtaButton>
          <CtaButton href="/connexion?redirect=/parrainage" variant="white" size="md">
            Me connecter
          </CtaButton>
        </div>
      </div>
    );
  }

  // ─── Connecté · panneau parrainage ────────────────────────────────────
  return (
    <div className="bg-white rounded-3xl border border-sand-200 shadow-[0_10px_30px_-10px_rgba(13,30,74,0.12)] p-7 md:p-9">
      {/* Stats · vraies données */}
      <div className="grid grid-cols-3 gap-4 mb-7 pb-7 border-b border-sand-200">
        {[
          { value: String(stats.validated),     label: "Parrainages validés", icon: Users,      color: "text-brand-500" },
          { value: String(stats.signed_up),     label: "En attente",           icon: TrendingUp, color: "text-ok"   },
          { value: stats.validated >= 5 ? "Or" : stats.validated >= 2 ? "Argent" : "Bronze",
                                                 label: "Statut",              icon: Award,      color: "text-warn" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <s.icon size={16} className={`${s.color} mx-auto mb-1.5`} />
            <div className="font-display font-semibold text-[1.8rem] text-ink-900 tracking-[-0.025em] leading-none">{s.value}</div>
            <div className="text-[0.74rem] text-ink-400 mt-1.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Code parrainage */}
      <div className="mb-4">
        <label className="block text-[0.66rem] font-semibold tracking-[0.14em] text-ink-400 uppercase mb-2">
          Votre code de parrainage
        </label>
        {referralCode ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 px-4 py-3 rounded-xl bg-sand-50 border-2 border-sand-200 font-mono font-bold text-ink-900 text-lg tracking-wider">
              {referralCode}
            </div>
            <button
              type="button"
              onClick={copyCode}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-tl-xl rounded-tr-xl rounded-br-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 hover:-translate-y-0.5 transition shadow-[0_8px_20px_-4px_rgba(240,122,47,0.45)]"
            >
              {copiedCode ? <Check size={16} /> : <Copy size={16} />}
              {copiedCode ? "Copié !" : "Copier"}
            </button>
          </div>
        ) : (
          <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
            Votre code de parrainage est en cours de génération. Recharger la page dans quelques secondes.
          </div>
        )}
      </div>

      {/* URL de partage */}
      <div className="mb-7">
        <label className="block text-[0.66rem] font-semibold tracking-[0.14em] text-ink-400 uppercase mb-2">
          Lien de parrainage
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2.5 rounded-xl bg-sand-50 border border-sand-200 text-sm text-ink-600 truncate">
            {referralUrl}
          </div>
          <button
            type="button"
            onClick={copyUrl}
            className="inline-flex items-center gap-2 px-3 py-2.5 rounded-tl-xl rounded-tr-xl rounded-br-xl bg-white border border-sand-200 text-ink-700 font-semibold hover:bg-sand-50 hover:-translate-y-0.5 transition"
          >
            {copiedUrl ? <Check size={14} /> : <Copy size={14} />}
            {copiedUrl ? "Copié" : "Copier"}
          </button>
        </div>
      </div>

      {/* Partage */}
      <div className="text-[0.66rem] font-semibold tracking-[0.14em] text-ink-400 uppercase mb-3">
        Inviter vos contacts
      </div>
      <InviteButton referralUrl={referralUrl} variant="primary" className="w-full justify-center" />
      <p className="mt-3 text-[0.74rem] text-ink-400 leading-relaxed">
        Sur Android, votre répertoire s&apos;ouvre directement. Sur iPhone, l&apos;app Messages se lance
        avec votre texte prêt · vous choisissez vos contacts dedans.{" "}
        <strong className="text-ink-700">Les SMS sont envoyés depuis votre forfait</strong>, Bisecco ne facture rien.
      </p>

      {/* Lien vers dashboard détaillé */}
      <div className="mt-7 pt-5 border-t border-sand-200 text-center">
        <Link
          href="/mon-profil"
          className="text-[0.84rem] font-semibold text-brand-500 hover:underline"
        >
          Retour à mon espace →
        </Link>
      </div>
    </div>
  );
}
