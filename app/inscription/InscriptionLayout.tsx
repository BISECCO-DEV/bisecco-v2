"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Hammer,
  Search,
  Users,
  MessageSquare,
  FileText,
} from "lucide-react";
import { SignupForm } from "@/components/auth/SignupForm";

type Role = "artisan" | "particulier";

const ARTISAN_STEPS = [
  {
    num: "01",
    icon: Hammer,
    title: "Vérification SIREN INSEE",
    text: "Votre SIRET est contrôlé en temps réel à l'inscription.",
  },
  {
    num: "02",
    icon: Search,
    title: "Profil indexé Google en 24h",
    text: "Une page locale par métier × ville, optimisée SEO.",
  },
  {
    num: "03",
    icon: ArrowRight,
    title: "Premiers contacts directs",
    text: "Les particuliers vous écrivent sans intermédiaire.",
  },
];

const PARTICULIER_STEPS = [
  {
    num: "01",
    icon: Search,
    title: "Recherchez par métier et ville",
    text: "176 métiers couverts (du plombier au développeur web), filtrage par localisation et spécialité.",
  },
  {
    num: "02",
    icon: FileText,
    title: "Demandez des devis gratuits",
    text: "Sans engagement, sans frais cachés, comparez en toute liberté.",
  },
  {
    num: "03",
    icon: MessageSquare,
    title: "Échangez en direct",
    text: "Messagerie intégrée avec l'artisan, sans intermédiaire payant.",
  },
];

export function InscriptionLayout() {
  const [role, setRole] = useState<Role>("artisan");
  const isArtisan = role === "artisan";

  const steps = isArtisan ? ARTISAN_STEPS : PARTICULIER_STEPS;
  const badge = isArtisan ? "Réseau d'artisans français" : "Trouvez le bon artisan";
  const title = isArtisan
    ? { l1: "Le réseau qui", highlight: "change tout", l3: "pour les artisans." }
    : { l1: "Trouvez l'artisan", highlight: "qu'il vous faut", l3: "près de chez vous." };
  const subtitle = isArtisan
    ? "Profil vérifié SIREN, messagerie directe avec vos clients,"
    : "Artisans vérifiés SIREN, comparez les profils,";
  const subtitleStrong = isArtisan ? "zéro commission" : "zéro frais cachés";
  const subtitleEnd = isArtisan ? ". Votre activité, en mieux." : ". Sans intermédiaire.";

  return (
    <div className="min-h-[calc(100vh-160px)] bg-ink-50">
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-160px)]">
        {/* ═══════════ COL GAUCHE · réactive au rôle ═══════════ */}
        <aside className="hidden lg:flex relative overflow-hidden bg-[#0a1d44] flex-col">
          {/* Pattern hexagones */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='84' height='96' viewBox='0 0 84 96'><path d='M42 0L84 24v48L42 96 0 72V24z' fill='none' stroke='%23ffffff' stroke-width='1.2'/></svg>")`,
              backgroundSize: "84px 96px",
            }}
          />
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-brand-500/[0.20] blur-[160px] pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-500/[0.15] blur-[140px] pointer-events-none" />

          {/* TOP : Logo */}
          <div className="relative p-10 xl:p-12">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl overflow-hidden shadow-[0_8px_20px_-4px_rgba(0,0,0,0.4)] group-hover:scale-105 transition-transform">
                <Image src="/logo.jpg" alt="Bisecco" width={44} height={44} />
              </div>
              <span className="font-display font-bold text-xl tracking-[0.12em] text-white">
                BISECCO
              </span>
            </Link>
          </div>

          {/* MIDDLE : Pitch éditorial */}
          <div className="relative flex-1 flex flex-col justify-center px-10 xl:px-16">
            <span className="inline-flex items-center self-start gap-2 px-3 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-[0.7rem] font-bold tracking-[0.14em] uppercase backdrop-blur-sm">
              {isArtisan ? (
                <Hammer size={11} strokeWidth={2.8} className="text-brand-400" />
              ) : (
                <Users size={11} strokeWidth={2.8} className="text-brand-400" />
              )}
              {badge}
            </span>

            <h2 className="mt-7 text-[44px] xl:text-[58px] leading-[0.98] font-semibold text-white tracking-[-0.035em]">
              {title.l1}{" "}
              <span className="relative inline-block">
                <span className="relative text-brand-500">{title.highlight}</span>
                <span className="absolute -bottom-2 left-0 right-0 h-[10px] bg-brand-500/30 -z-0 rounded-full blur-[3px]" />
              </span>
              <br />
              {title.l3}
            </h2>

            <p className="mt-7 text-white/65 text-[1.05rem] leading-relaxed max-w-md">
              {subtitle}{" "}
              <strong className="text-white">{subtitleStrong}</strong>
              {subtitleEnd}
            </p>

            {/* 3 STEPS · adaptés au rôle */}
            <div className="mt-12 max-w-md space-y-5">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.num} className="group flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-brand-400 group-hover:bg-white/[0.10] group-hover:border-brand-400/40 transition-all">
                        <Icon size={18} strokeWidth={2.2} />
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center w-5 h-5 rounded-md bg-brand-500 text-white text-[0.58rem] font-extrabold tabular-nums shadow-[0_4px_10px_-2px_rgba(240,122,47,0.5)]">
                        {step.num}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                      <div className="font-extrabold text-white text-[0.98rem] tracking-tight">
                        {step.title}
                      </div>
                      <div className="text-[0.85rem] text-white/60 mt-1 leading-snug">
                        {step.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BOTTOM : trust bar */}
          <div className="relative px-10 xl:px-12 pb-10 xl:pb-12">
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.78rem] text-white/55">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={13} strokeWidth={2.4} className="text-emerald-400" />
                <span className="font-semibold text-white/85">
                  {isArtisan ? "SIREN INSEE" : "Artisans vérifiés"}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block w-1 h-1 rounded-full bg-white/30" />
                Données chiffrées (RGPD)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block w-1 h-1 rounded-full bg-white/30" />
                Hébergement français
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block w-1 h-1 rounded-full bg-white/30" />
                {isArtisan ? "Sans engagement" : "100 % gratuit"}
              </span>
            </div>
          </div>
        </aside>

        {/* ═══════════ COL DROITE · Formulaire ═══════════ */}
        <main className="relative bg-white flex items-center justify-center px-4 py-10 sm:py-14 lg:py-12 lg:px-12 xl:px-16">
          <div className="hidden lg:block absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-brand-500/[0.04] blur-[120px] pointer-events-none" />

          <div className="relative w-full max-w-[520px]">
            <div className="flex justify-center mb-6 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl overflow-hidden shadow-card">
                  <Image src="/logo.jpg" alt="Bisecco" width={44} height={44} />
                </div>
                <span className="font-display font-bold text-xl tracking-[0.12em] text-ink-700">
                  BISECCO
                </span>
              </Link>
            </div>

            <div className="text-center lg:text-left mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.66rem] font-bold tracking-[0.14em] uppercase">
                <Sparkles size={10} strokeWidth={2.8} className="text-brand-500" />
                Inscription gratuite
              </span>
              <h1 className="mt-4 text-[2rem] sm:text-[2.4rem] font-semibold text-ink-700 tracking-[-0.03em] leading-[1.05]">
                Créer mon compte
                <span className="text-brand-500">.</span>
              </h1>
              <p className="mt-3 text-[0.95rem] text-ink-500 leading-relaxed">
                {isArtisan
                  ? "2 minutes · Vérification SIREN automatique · 0 € à vie."
                  : "2 minutes · Demandez des devis gratuits · 0 € à vie."}
              </p>
            </div>

            <SignupForm role={role} onRoleChange={setRole} />

            <div className="mt-7 pt-6 border-t border-ink-100 flex items-center justify-between flex-wrap gap-3">
              <p className="text-[0.88rem] text-ink-500">
                Déjà inscrit&nbsp;?{" "}
                <Link
                  href="/connexion"
                  className="inline-flex items-center gap-1 text-brand-500 font-bold hover:underline"
                >
                  Se connecter
                  <ArrowRight size={12} strokeWidth={2.8} />
                </Link>
              </p>
              <div className="inline-flex items-center gap-1.5 text-[0.74rem] text-ink-400">
                <ShieldCheck size={12} strokeWidth={2.6} className="text-emerald-500" />
                <span>Données chiffrées · RGPD</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
