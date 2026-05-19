"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Zap, UserPlus, Camera, MessageCircle, Search, FileText, CheckCircle2,
  ArrowRight, Hammer, Users,
} from "lucide-react";

type Audience = "particulier" | "artisan";

type Step = {
  num: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  title: string;
  text: string;
  highlight: string;
};

const STEPS_PARTICULIER: Step[] = [
  {
    num: "01",
    icon: Search,
    title: "Décrivez votre projet",
    text: "Métier, ville, descriptif. 2 minutes. Pas d'inscription.",
    highlight: "2 min",
  },
  {
    num: "02",
    icon: FileText,
    title: "Recevez 2 à 5 devis",
    text: "Des artisans vérifiés SIREN vous écrivent en direct. Vous comparez, vous décidez.",
    highlight: "Sous 24h",
  },
  {
    num: "03",
    icon: CheckCircle2,
    title: "Choisissez & démarrez",
    text: "Vous traitez en direct avec l'artisan. Bisecco ne prend rien.",
    highlight: "0 % commission",
  },
];

const STEPS_ARTISAN: Step[] = [
  {
    num: "01",
    icon: UserPlus,
    title: "Inscrivez-vous",
    text: "Compte créé en 2 minutes. Pas de carte bancaire. Pas d'engagement.",
    highlight: "2 min",
  },
  {
    num: "02",
    icon: Camera,
    title: "Créez votre profil",
    text: "Vos métiers, photos, services, zone d'intervention. SIREN vérifié automatiquement via l'INSEE.",
    highlight: "SIREN auto",
  },
  {
    num: "03",
    icon: MessageCircle,
    title: "Recevez vos clients",
    text: "Les particuliers vous écrivent en direct. Vous gardez 100% de vos revenus.",
    highlight: "0 % commission",
  },
];

const TAB_CONFIG: Record<Audience, { icon: typeof Users; label: string; sub: string; cta: { href: string; label: string } }> = {
  particulier: {
    icon: Users,
    label: "Je cherche un artisan",
    sub: "3 étapes pour trouver votre pro près de chez vous.",
    cta: { href: "/rechercher", label: "Trouver mon artisan" },
  },
  artisan: {
    icon: Hammer,
    label: "Je suis artisan",
    sub: "3 étapes pour créer votre profil et recevoir vos premiers clients.",
    cta: { href: "/inscription", label: "Créer mon profil" },
  },
};

export function HomeHowItWorks() {
  const [audience, setAudience] = useState<Audience>("particulier");
  const steps = audience === "particulier" ? STEPS_PARTICULIER : STEPS_ARTISAN;
  const config = TAB_CONFIG[audience];

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-ink-50 via-white to-ink-50">
      {/* Décors */}
      <div className="absolute top-1/2 -left-32 w-[500px] h-[500px] rounded-full bg-brand-500/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/[0.04] blur-[100px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #0d1e4a 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container-default relative">
        {/* Head */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
            <Zap size={11} strokeWidth={2.8} className="text-brand-500" />
            En 3 étapes
          </span>
          <h2 className="mt-5 text-[34px] sm:text-[44px] md:text-[52px] leading-[1.05] font-extrabold text-ink-700 tracking-[-0.025em]">
            Comment ça marche
            <span className="text-brand-500">.</span>
          </h2>
          <p className="mt-4 text-[1rem] sm:text-[1.06rem] text-ink-500 leading-relaxed transition-opacity duration-300">
            {config.sub}
          </p>
        </div>

        {/* Tabs · switch audience */}
        <div className="flex justify-center mb-12 sm:mb-16">
          <div role="tablist" aria-label="Audience" className="inline-flex items-center gap-1 p-1.5 rounded-2xl bg-white border border-ink-100 shadow-[0_4px_20px_-8px_rgba(13,30,74,0.12)]">
            {(["particulier", "artisan"] as const).map((a) => {
              const isActive = audience === a;
              const Icon = TAB_CONFIG[a].icon;
              return (
                <button
                  key={a}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => setAudience(a)}
                  className={`relative inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-[0.86rem] sm:text-[0.92rem] font-bold transition-all ${
                    isActive
                      ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-[0_6px_18px_-4px_rgba(240,122,47,0.5),inset_0_1px_0_rgba(255,255,255,0.25)]"
                      : "text-ink-500 hover:text-ink-700 hover:bg-ink-50"
                  }`}
                >
                  <Icon size={15} strokeWidth={2.4} />
                  {TAB_CONFIG[a].label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Steps avec ligne de connexion */}
        <div className="relative">
          {/* Ligne pointillée connexion (desktop) */}
          <div className="hidden md:block absolute top-[88px] left-[16.66%] right-[16.66%] h-px pointer-events-none">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1">
              <line
                x1="0" y1="0.5" x2="100" y2="0.5"
                stroke="url(#step-line-hiw)"
                strokeWidth="1"
                strokeDasharray="3 4"
                className="animate-dash"
              />
              <defs>
                <linearGradient id="step-line-hiw" x1="0" x2="1">
                  <stop offset="0" stopColor="#f07a2f" stopOpacity="0" />
                  <stop offset="0.15" stopColor="#f07a2f" stopOpacity="0.5" />
                  <stop offset="0.85" stopColor="#f07a2f" stopOpacity="0.5" />
                  <stop offset="1" stopColor="#f07a2f" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="grid md:grid-cols-3 gap-5 sm:gap-6 relative">
            {steps.map(({ num, icon: Icon, title, text, highlight }, i) => (
              <div
                key={`${audience}-${num}`}
                className="group relative h-full bg-white rounded-3xl p-7 sm:p-8 border border-ink-100/80 shadow-[0_4px_20px_rgba(13,30,74,0.06)] hover:shadow-[0_20px_40px_-12px_rgba(13,30,74,0.18)] hover:-translate-y-1.5 hover:border-brand-200 transition-all duration-300 overflow-hidden animate-reveal-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Halo coin top-right */}
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" />

                {/* Watermark numéro */}
                <div className="absolute top-5 right-6 text-[68px] font-extrabold leading-none text-brand-50 group-hover:text-brand-100 group-hover:scale-110 transition-all duration-500 select-none pointer-events-none tracking-[-0.04em]">
                  {num}
                </div>

                {/* Icône badge */}
                <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-[0_8px_20px_-4px_rgba(240,122,47,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 mb-5">
                  <Icon size={22} strokeWidth={2.2} />
                  <span className="absolute inset-0 rounded-2xl ring-4 ring-brand-500/15 group-hover:ring-brand-500/30 transition" />
                </div>

                {/* Title + chip */}
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-[1.18rem] sm:text-[1.25rem] text-ink-700 group-hover:text-brand-600 transition tracking-tight">
                    {title}
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.65rem] font-bold uppercase tracking-wider">
                    ✓ {highlight}
                  </span>
                </div>

                <p className="text-[0.92rem] text-ink-500 mt-3 leading-relaxed">{text}</p>

                <div className="mt-5 pt-4 border-t border-dashed border-ink-100 flex items-center justify-between text-[0.82rem] font-bold text-brand-500 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span>Étape suivante</span>
                  <ArrowRight size={14} strokeWidth={2.6} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA fin */}
        <div className="mt-14 sm:mt-20 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-6 sm:px-8 py-5 sm:py-6 rounded-3xl bg-white border border-ink-100/80 shadow-[0_10px_30px_-10px_rgba(13,30,74,0.12)]">
            <span className="text-[0.92rem] text-ink-600 font-medium">
              Prêt à <strong className="text-ink-800">{audience === "particulier" ? "trouver votre artisan ?" : "démarrer en 2 minutes ?"}</strong>
            </span>
            <Link
              href={config.cta.href}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-extrabold text-[0.88rem] shadow-[0_8px_20px_-4px_rgba(240,122,47,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-4px_rgba(240,122,47,0.6)] transition-all"
            >
              {audience === "particulier" ? <Search size={14} strokeWidth={2.4} /> : <UserPlus size={14} strokeWidth={2.4} />}
              {config.cta.label}
              <ArrowRight size={14} strokeWidth={2.6} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <p className="mt-3 text-[0.78rem] text-ink-400">
            Gratuit · Sans carte bancaire · Désinscription en 1 clic
          </p>
        </div>
      </div>
    </section>
  );
}
