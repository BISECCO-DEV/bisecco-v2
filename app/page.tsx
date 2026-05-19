import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { HomeLocalSearch } from "@/components/features/home/HomeLocalSearch";
import { HomeFaq } from "@/components/features/home/HomeFaq";
import { HomeHowItWorks } from "@/components/features/home/HomeHowItWorks";
import { HomeMetiers } from "@/components/features/home/HomeMetiers";
import { HomeComparison } from "@/components/features/home/HomeComparison";
import { HomeArtisanPitch } from "@/components/features/home/HomeArtisanPitch";
import { HomeBlogTeasers } from "@/components/features/home/HomeBlogTeasers";
import {
  ShieldCheck,
  Sparkles,
  Star,
  ArrowRight,
  UserPlus,
  Zap,
  Briefcase,
  TrendingUp,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative flex items-start md:items-center min-h-[78vh] md:min-h-[78vh] lg:min-h-[80vh] bg-[#05122e] overflow-hidden">
        {/* Image de fond · <picture> responsive (mobile portrait / desktop landscape) */}
        <picture className="absolute inset-0" aria-hidden="true">
          <source media="(max-width: 768px)" srcSet="/hero-network-mobile.webp" />
          { }
          <img
            src="/hero-network.webp"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center"
          />
        </picture>
        {/* Gradient horizontal · desktop : fond plein largeur naturel sans cassure */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, #05122e 0%, #05122e 25%, rgba(5,18,46,0.92) 38%, rgba(5,18,46,0.65) 50%, rgba(5,18,46,0.30) 65%, rgba(5,18,46,0.05) 80%, transparent 100%)",
          }}
        />
        {/* Gradient vertical · mobile : voile en haut pour lisibilité, image visible en bas */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,18,46,0.92) 0%, rgba(5,18,46,0.82) 35%, rgba(5,18,46,0.55) 60%, rgba(5,18,46,0.20) 85%, transparent 100%)",
          }}
        />
        {/* Légère vignette verticale pour la profondeur · desktop uniquement */}
        <div
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,18,46,0.4) 0%, transparent 30%, transparent 70%, rgba(5,18,46,0.5) 100%)",
          }}
        />
        {/* Lueur orange subtile en bas à gauche pour la chaleur */}
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none" />
        {/* Lueur bleue en haut à droite */}
        <div className="absolute top-0 right-0 w-[800px] h-[500px] rounded-full bg-blue-500/15 blur-[140px] pointer-events-none" />

        <div className="container-default w-full pt-[130px] pb-12 sm:pt-[140px] sm:pb-16 md:pt-[160px] md:pb-24 text-white relative z-10">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="lg:pr-8 text-center md:text-left">
              {/* H1 premium · staggered reveal + gradient shimmer + SVG draw-in */}
              <h1
                className="text-[26px] xs:text-[30px] sm:text-[40px] md:text-[48px] lg:text-[56px] leading-[1.1] sm:leading-[1.06] font-extrabold tracking-[-0.025em] animate-reveal-up break-words"
                style={{ animationDelay: "100ms" }}
              >
                1<sup className="text-[0.55em] font-extrabold align-super">er</sup> réseau social d&apos;artisans,
                <br className="hidden sm:inline" />
                <span className="text-brand-500">
                  développé pour les particuliers.
                </span>
              </h1>

              {/* Description · reveal après le titre */}
              <p
                className="mt-5 sm:mt-7 text-[14px] sm:text-[17px] text-white/80 max-w-xl mx-auto md:mx-0 leading-[1.55] sm:leading-[1.6] animate-reveal-up"
                style={{ animationDelay: "350ms" }}
              >
                <span className="text-white font-semibold">Inscrivez votre entreprise.</span>
                {" "}Recevez vos premiers contacts cette semaine.
              </p>

              {/* Trust chips · cascade stagger */}
              <div className="flex flex-wrap justify-center md:justify-start gap-1.5 sm:gap-2 mt-5 sm:mt-7">
                {[
                  { icon: Zap,         label: "Devis 2 min" },
                  { icon: ShieldCheck, label: "Sans intermédiaire" },
                  { icon: Sparkles,    label: "100 % gratuit" },
                ].map((chip, i) => (
                  <span
                    key={chip.label}
                    className="flex-shrink-0 inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 text-[12px] sm:text-[0.82rem] font-semibold text-white whitespace-nowrap animate-reveal-up"
                    style={{ animationDelay: `${550 + i * 90}ms` }}
                  >
                    <chip.icon size={12} strokeWidth={2.6} className="text-brand-400" />
                    {chip.label}
                  </span>
                ))}
              </div>

              {/* CTAs — reveal au mount, hover bg-color subtil, c'est tout. */}
              <div className="flex flex-nowrap items-center justify-center md:justify-start gap-2 sm:gap-3 mt-6 sm:mt-10">
                <Link
                  href="/rechercher"
                  className="group inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-[12px] sm:text-[14px] whitespace-nowrap animate-reveal-up transition-colors"
                  style={{ animationDelay: "850ms" }}
                >
                  Trouver mon artisan
                  <ArrowRight size={13} strokeWidth={2.6} className="transition-transform duration-200 group-hover:translate-x-0.5 sm:hidden" />
                  <ArrowRight size={15} strokeWidth={2.6} className="transition-transform duration-200 group-hover:translate-x-0.5 hidden sm:inline" />
                </Link>
                <Link
                  href="/mon-profil/cv"
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-white font-bold text-[12px] sm:text-[14px] border border-white/30 hover:border-white/60 transition-colors whitespace-nowrap animate-reveal-up"
                  style={{ animationDelay: "950ms" }}
                >
                  Déposer mon CV
                  <ArrowRight size={13} strokeWidth={2.4} className="opacity-60 sm:hidden" />
                  <ArrowRight size={15} strokeWidth={2.4} className="opacity-60 hidden sm:inline" />
                </Link>
              </div>

              {/* Live social proof · entrance delay + counter animation */}
            </div>
            {/* Colonne droite vide · l'image hero-network occupe la zone */}
            <div className="hidden lg:block" />
          </div>
        </div>
        <ScrollIndicator targetId="gratuit" offset={110} label="Découvrir" />
      </section>

      {/* ═══════════ COMMENT ÇA MARCHE · dual particulier/artisan avec tabs ═══════════ */}
      <HomeHowItWorks />

      {/* ═══════════ MÉTIERS POPULAIRES · grid SEO ═══════════ */}
      <HomeMetiers />

      {/* ═══════════ RECHERCHE LOCALE · Carte interactive + Carousel ═══════════ */}
      <HomeLocalSearch />


      {/* ═══════════ 100% GRATUIT · 2 cards (fond hex navy) ═══════════ */}
      <section id="gratuit" className="relative overflow-hidden bg-[#05122e] py-24">
        {/* Pattern hexagonal en fond */}
        <div
          className="absolute inset-0 opacity-[0.15] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='92' viewBox='0 0 80 92'><path d='M20 0 L60 0 L80 34.6 L60 69.3 L20 69.3 L0 34.6 Z' fill='none' stroke='%231e4fa3' stroke-width='1'/><path d='M0 34.6 L20 69.3 L0 104 L-20 69.3 Z' fill='none' stroke='%231e4fa3' stroke-width='1'/><path d='M60 -34.6 L80 0 L80 34.6 L60 69.3' fill='none' stroke='%231e4fa3' stroke-width='1'/></svg>")`,
            backgroundSize: "80px 92px",
          }}
        />
        {/* Glow lights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-500/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-20 right-0 w-[500px] h-[300px] bg-blue-500/8 blur-[100px] rounded-full pointer-events-none" />

        <div className="container-default relative">
          {/* Header */}
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs font-bold tracking-wider uppercase">
                <Sparkles size={13} className="animate-pulse-slow" /> Aucune carte bancaire requise
              </span>
              <h2 className="text-3xl md:text-[2.4rem] font-bold mt-5 text-white tracking-tight">
                Bisecco, c&apos;est <span className="text-brand-500">100% gratuit</span>
              </h2>
              <p className="mt-4 text-white/65 leading-relaxed">
                Pas d&apos;abonnement. Pas de commission. Vous gardez 100% de vos revenus.
              </p>
            </div>
          </Reveal>

          {/* 2 cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* PARTICULIERS · accent orange */}
            <Reveal delay={100} direction="up">
              <div className="relative rounded-3xl p-8 bg-white/[0.03] border border-white/10 backdrop-blur-sm hover:bg-white/[0.06] hover:border-brand-500/30 hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden h-full">
                {/* Top accent bar · shimmer animé */}
                <div className="absolute top-0 left-8 right-8 h-px bg-[linear-gradient(90deg,transparent,#f07a2f,transparent)] bg-[length:200%_100%] animate-shimmer" />
                {/* Halo qui apparaît au hover */}
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-brand-500/15 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f07a2f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Pour les particuliers</h3>
                <p className="text-white/55 text-sm mt-1.5">
                  Trouvez votre artisan en 2 minutes.
                </p>

                <ul className="space-y-3.5 mt-7">
                  {[
                    { icon: "🔍", text: "Recherche illimitée par métier et ville" },
                    { icon: "📧", text: "Contactez les artisans directement" },
                    { icon: "⭐", text: "Consultez les avis clients vérifiés" },
                    { icon: "📑", text: "Demandez des devis sans engagement" },
                    { icon: "🔒", text: "Aucune commission sur les travaux" },
                  ].map((f, i) => (
                    <Reveal key={f.text} delay={200 + i * 80} distance={12}>
                      <li className="flex items-center gap-3 text-sm text-white/85 group/item">
                        <span className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/25 flex items-center justify-center text-base flex-shrink-0 group-hover/item:bg-brand-500/30 group-hover/item:scale-110 transition-all">
                          {f.icon}
                        </span>
                        {f.text}
                      </li>
                    </Reveal>
                  ))}
                </ul>

                <Link
                  href="/rechercher"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 text-white font-semibold shadow-[0_8px_24px_rgba(240,122,47,0.3)] hover:bg-brand-600 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(240,122,47,0.5)] transition-all"
                >
                  Trouver un artisan
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </Reveal>

            {/* ARTISANS · accent bleu */}
            <Reveal delay={200} direction="up">
              <div className="relative rounded-3xl p-8 bg-white/[0.03] border border-white/10 backdrop-blur-sm hover:bg-white/[0.06] hover:border-blue-400/30 hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden h-full">
                <div className="absolute top-0 left-8 right-8 h-px bg-[linear-gradient(90deg,transparent,#60a5fa,transparent)] bg-[length:200%_100%] animate-shimmer" style={{ animationDelay: "0.5s" }} />
                <div className="absolute -bottom-16 -right-16 w-60 h-60 rounded-full bg-blue-500/10 blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-500" />

                <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 9l-5 5L4 9l5-5z" />
                    <path d="M14 4l6 6-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Pour les artisans</h3>
                <p className="text-white/55 text-sm mt-1.5">
                  Recevez vos premiers contacts cette semaine.
                </p>

                <ul className="space-y-3.5 mt-7">
                  {[
                    { icon: "📋", text: "Profil professionnel complet en ligne" },
                    { icon: "🖼️", text: "Galerie de réalisations illimitée" },
                    { icon: "✅", text: "Badge SIREN vérifié sur votre profil" },
                    { icon: "💬", text: "Messagerie directe avec les clients" },
                    { icon: "📊", text: "Statistiques de visites de votre profil" },
                  ].map((f, i) => (
                    <Reveal key={f.text} delay={300 + i * 80} distance={12}>
                      <li className="flex items-center gap-3 text-sm text-white/85 group/item">
                        <span className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-base flex-shrink-0 group-hover/item:bg-blue-500/30 group-hover/item:scale-110 transition-all">
                          {f.icon}
                        </span>
                        {f.text}
                      </li>
                    </Reveal>
                  ))}
                </ul>

                <Link
                  href="/inscription"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 text-white font-semibold shadow-[0_8px_24px_rgba(240,122,47,0.3)] hover:bg-brand-600 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(240,122,47,0.5)] transition-all"
                >
                  Créer mon profil gratuit
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Trust signals bottom */}
          <Reveal delay={400}>
            <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: "✅", title: "SIREN vérifié",     sub: "Chaque artisan est contrôlé" },
                { icon: "🛡️", title: "Zéro commission",   sub: "Sur aucune prestation" },
                { icon: "⭐", title: "Avis authentiques", sub: "Laissés par de vrais clients" },
                { icon: "🔒", title: "Données sécurisées", sub: "Conformité RGPD" },
              ].map((t, i) => (
                <Reveal key={t.title} delay={500 + i * 100} distance={16}>
                  <div className="text-center hover:-translate-y-1 transition-transform duration-300 cursor-default">
                    <div className="text-2xl mb-2 animate-float" style={{ animationDelay: `${i * 0.3}s` }}>{t.icon}</div>
                    <div className="text-sm font-bold text-white">{t.title}</div>
                    <div className="text-xs text-white/50 mt-0.5">{t.sub}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ NOTRE MISSION · card navy + photo artisan ═══════════ */}
      <section className="py-16 sm:py-20 bg-ink-50">
        <div className="container-default">
          <Reveal distance={24}>
            <div className="relative bg-gradient-to-br from-ink-800 via-ink-700 to-ink-900 rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-[0_30px_60px_-25px_rgba(13,30,74,0.45)]">
              {/* Décors d'ambiance */}
              <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-brand-500/[0.10] blur-[120px] pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-blue-500/[0.08] blur-[100px] pointer-events-none" />
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              <div className="relative grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-10 p-7 sm:p-10 lg:p-14 items-center">
                {/* Colonne gauche · texte */}
                <div className="relative">
                  <Reveal delay={100} distance={20}>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-[0.66rem] font-bold tracking-[0.14em] uppercase backdrop-blur-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                      Notre engagement
                    </span>
                  </Reveal>

                  <Reveal delay={200} distance={20}>
                    <h2 className="mt-5 text-[26px] sm:text-[32px] lg:text-[40px] leading-[1.1] font-extrabold text-white tracking-[-0.025em]">
                      Notre mission&nbsp;:{" "}
                      <span className="relative inline-block">
                        <span className="text-brand-500">
                          valoriser chaque professionnel
                        </span>
                        <span className="text-brand-500">.</span>
                      </span>
                    </h2>
                  </Reveal>

                  <Reveal delay={300} distance={20}>
                    <p className="mt-5 sm:mt-6 text-[0.94rem] sm:text-[1.02rem] text-white/75 leading-relaxed max-w-xl">
                      Bisecco est né d&apos;une conviction simple&nbsp;:
                      <span className="text-white font-semibold"> chaque artisan mérite d&apos;être visible </span>
                      et reconnu pour son savoir-faire. Nous construisons le premier réseau social dédié
                      aux professionnels du bâtiment, des services et de l&apos;artisanat.
                    </p>
                  </Reveal>

                  <Reveal delay={400} distance={20}>
                    <p className="mt-5 text-[0.94rem] sm:text-[1rem] text-brand-300 font-semibold leading-relaxed max-w-xl">
                      Permettez-nous d&apos;améliorer votre visibilité en créant votre profil gratuitement.
                    </p>
                  </Reveal>

                  <Reveal delay={500} distance={20}>
                    <div className="mt-7 flex flex-wrap items-center gap-3">
                      <Link
                        href="/inscription"
                        className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-extrabold text-[0.92rem] shadow-[0_10px_28px_-6px_rgba(240,122,47,0.55),inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-6px_rgba(240,122,47,0.65)] transition-all overflow-hidden"
                      >
                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" aria-hidden />
                        <UserPlus size={15} strokeWidth={2.4} className="relative" />
                        <span className="relative">Créer mon profil</span>
                        <ArrowRight size={14} strokeWidth={2.6} className="relative transition-transform group-hover:translate-x-0.5" />
                      </Link>

                      <span className="inline-flex items-center gap-1.5 text-[0.78rem] text-white/55">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        100 % gratuit, sans carte bancaire
                      </span>
                    </div>
                  </Reveal>
                </div>

                {/* Colonne droite · photo artisan */}
                <Reveal delay={250} distance={28}>
                  <div className="relative group">
                    {/* Glow derrière l'image */}
                    <div className="absolute -inset-2 bg-gradient-to-br from-brand-500/30 via-transparent to-blue-500/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity" aria-hidden />

                    <div className="relative aspect-[5/4] rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&h=960&fit=crop&q=80"
                        alt="Artisan professionnel au travail · Bisecco valorise chaque savoir-faire"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      {/* Léger voile bleuté pour cohérence */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-ink-900/35 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ COMPARATIF vs CONCURRENCE ═══════════ */}
      <HomeComparison />

      {/* ═══════════ TÉMOIGNAGES · Style éditorial pro ═══════════ */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full bg-brand-500/[0.04] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/[0.04] blur-[100px] pointer-events-none" />

        <div className="container-default relative">
          {/* Header */}
          <Reveal>
            <div className="grid md:grid-cols-[1fr_auto] items-end gap-6 mb-14">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.65rem] font-bold tracking-[0.14em] uppercase">
                  <ShieldCheck size={11} /> Avis 100% vérifiés
                </span>
                <h2 className="text-3xl md:text-[2.6rem] font-bold mt-4 text-ink-700 tracking-[-0.02em] leading-[1.1]">
                  Ce qu&apos;ils disent<br />
                  <span className="text-ink-400 font-medium">après avoir essayé Bisecco.</span>
                </h2>
              </div>
              <div className="flex items-center gap-6 md:border-l md:border-ink-200 md:pl-6">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-ink-700">4.8</span>
                    <span className="text-ink-400 text-sm">/5</span>
                  </div>
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill={i < 5 ? "#f07a2f" : "#e5e7eb"} className={i < 5 ? "text-brand-500" : "text-ink-200"} />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-ink-400 leading-tight">
                  <strong className="block text-ink-700 text-lg">247</strong>
                  avis publiés
                </div>
              </div>
            </div>
          </Reveal>

          {/* Bento grid */}
          <div className="grid md:grid-cols-12 gap-4">
            {/* Card 1 · FEATURED LARGE (artisan, dark) */}
            <Reveal className="md:col-span-7 md:row-span-2" delay={0}>
              <article className="relative h-full p-8 md:p-10 rounded-3xl bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 text-white overflow-hidden">
                <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-brand-500/20 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-blue-500/10 blur-3xl" />

                <div className="relative h-full flex flex-col">
                  {/* Top meta */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[0.68rem] font-bold uppercase tracking-wider">
                      <Briefcase size={10} /> Témoignage artisan
                    </span>
                    <span className="text-[0.7rem] text-white/55 font-medium">il y a 12 jours</span>
                  </div>

                  {/* Quote */}
                  <blockquote className="flex-1 text-[1.55rem] md:text-[1.7rem] font-medium leading-[1.35] tracking-[-0.01em]">
                    <span className="text-brand-400 text-3xl font-serif leading-none mr-1">&ldquo;</span>
                    Bisecco a transformé mon activité. En 3 mois, j&apos;ai{" "}
                    <span className="text-brand-500 font-bold">
                      triplé mes demandes de devis
                    </span>
                    . Plateforme propre, clients sérieux, zéro commission. Je ne reviendrai jamais sur Pages Jaunes.
                  </blockquote>

                  {/* Rating */}
                  <div className="mt-6 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} fill="#f07a2f" className="text-brand-500" />
                    ))}
                    <span className="text-white/55 text-xs ml-2">5.0 / 5</span>
                  </div>

                  {/* Author */}
                  <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://i.pravatar.cc/120?img=12" alt="" className="w-13 h-13 w-12 h-12 rounded-2xl border border-white/15 object-cover" />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <strong className="font-bold">Jean Dupont</strong>
                        <ShieldCheck size={12} className="text-emerald-400" />
                      </div>
                      <div className="text-sm text-white/55">Maçon · Dupont Maçonnerie · Meaux (77)</div>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>

            {/* Card 2 · particulier, blanche compact */}
            <Reveal className="md:col-span-5" delay={120}>
              <article className="relative h-full p-7 rounded-3xl bg-white border border-ink-100 hover:border-brand-200 hover:-translate-y-0.5 transition group">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[0.68rem] font-bold uppercase tracking-wider">
                    🏠 Particulier
                  </span>
                  <span className="text-[0.7rem] text-ink-400 font-medium">il y a 5 jours</span>
                </div>
                <p className="text-[1.05rem] text-ink-700 leading-snug font-medium">
                  Fuite d&apos;eau un dimanche soir. <strong>2h plus tard, un plombier était chez moi.</strong> Devis annoncé, devis respecté. Sauvée.
                </p>
                <div className="mt-5 pt-4 border-t border-ink-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://i.pravatar.cc/100?img=47" alt="" className="w-9 h-9 rounded-full" />
                    <div className="leading-tight">
                      <div className="font-bold text-ink-700 text-sm">Marie L.</div>
                      <div className="text-[0.72rem] text-ink-400">Meaux · Dépannage plomberie</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#f07a2f" className="text-brand-500" />)}
                  </div>
                </div>
              </article>
            </Reveal>

            {/* Card 3 · particulier honnête (4★) */}
            <Reveal className="md:col-span-5" delay={240}>
              <article className="relative h-full p-7 rounded-3xl bg-white border border-ink-100 hover:border-brand-200 hover:-translate-y-0.5 transition">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[0.68rem] font-bold uppercase tracking-wider">
                    🏠 Particulier
                  </span>
                  <span className="text-[0.7rem] text-ink-400 font-medium">il y a 3 sem.</span>
                </div>
                <p className="text-[1.05rem] text-ink-700 leading-snug font-medium">
                  3 devis reçus en 24h, j&apos;ai pu comparer sans pression. <strong>Carreleur top niveau</strong>, propre et ponctuel.
                </p>
                <div className="mt-5 pt-4 border-t border-ink-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://i.pravatar.cc/100?img=48" alt="" className="w-9 h-9 rounded-full" />
                    <div className="leading-tight">
                      <div className="font-bold text-ink-700 text-sm">Sophie K.</div>
                      <div className="text-[0.72rem] text-ink-400">Chelles · Rénovation cuisine</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#f07a2f" className="text-brand-500" />)}
                  </div>
                </div>
              </article>
            </Reveal>

            {/* Card 4 · Petite citation card avec badge "Stat" */}
            <Reveal className="md:col-span-4" delay={360}>
              <article className="relative h-full p-7 rounded-3xl bg-gradient-to-br from-brand-50 to-amber-50/30 border border-brand-200/60 hover:border-brand-300 hover:-translate-y-0.5 transition">
                <div className="text-5xl font-bold text-brand-500 tracking-tight leading-none">×3</div>
                <p className="text-sm text-ink-600 mt-3 leading-relaxed">
                  C&apos;est le nombre moyen de <strong>demandes de devis supplémentaires</strong> reçues par les artisans dès leur 1ᵉʳ mois sur Bisecco.
                </p>
                <div className="mt-5 pt-4 border-t border-brand-200/60 text-[0.72rem] text-ink-500 font-semibold flex items-center gap-1.5">
                  <TrendingUp size={11} className="text-brand-500" />
                  Données janvier–avril 2026
                </div>
              </article>
            </Reveal>

            {/* Card 5 · Artisan court */}
            <Reveal className="md:col-span-4" delay={480}>
              <article className="relative h-full p-7 rounded-3xl bg-white border border-ink-100 hover:border-brand-200 hover:-translate-y-0.5 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[0.68rem] font-bold uppercase tracking-wider">
                    âš' Artisan
                  </span>
                  <span className="text-[0.7rem] text-ink-400">il y a 1 mois</span>
                </div>
                <p className="text-[1rem] text-ink-700 leading-snug font-medium">
                  J&apos;ai signé <strong>2 chantiers</strong> dès la 1ʳᵉ semaine. Profil rapide à monter, leads de qualité.
                </p>
                <div className="mt-4 pt-3 border-t border-ink-100 flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://i.pravatar.cc/100?img=33" alt="" className="w-7 h-7 rounded-full" />
                  <div className="leading-tight">
                    <div className="font-bold text-ink-700 text-[0.78rem]">Hugo Martin</div>
                    <div className="text-[0.7rem] text-ink-400">Carreleur · Chelles</div>
                  </div>
                </div>
              </article>
            </Reveal>

            {/* Card 6 · Source / lien lire plus */}
            <Reveal className="md:col-span-4" delay={600}>
              <article className="relative h-full p-7 rounded-3xl bg-ink-700 text-white overflow-hidden flex flex-col">
                <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-brand-500/20 blur-2xl" />
                <div className="relative flex-1">
                  <h3 className="text-lg font-bold leading-tight">
                    Lisez les <span className="text-brand-400">247 avis</span> de notre communauté.
                  </h3>
                  <p className="text-sm text-white/65 mt-3 leading-relaxed">
                    Tous nos avis sont vérifiés : seuls les clients ayant échangé avec un artisan via Bisecco peuvent en laisser.
                  </p>
                </div>
                <Link
                  href="/avis"
                  className="relative inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 hover:bg-white/15 text-sm font-bold transition w-fit"
                >
                  Voir tous les avis <ArrowRight size={14} />
                </Link>
              </article>
            </Reveal>
          </div>

        </div>
      </section>

      {/* ═══════════ PARTENAIRES OFFICIELS · fond hex navy ═══════════ */}
      <section className="relative py-20 sm:py-28 bg-[#0a1d44] overflow-hidden">
        {/* Pattern hexagones SVG */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='84' height='96' viewBox='0 0 84 96'><path d='M42 0L84 24v48L42 96 0 72V24z' fill='none' stroke='%23ffffff' stroke-width='1.2'/></svg>")`,
            backgroundSize: "84px 96px",
          }}
        />
        {/* Halos */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-brand-500/[0.10] blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/[0.10] blur-[140px] pointer-events-none" />

        <div className="container-default relative">
          {/* Head */}
          <Reveal distance={20}>
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-[0.7rem] font-bold tracking-[0.14em] uppercase backdrop-blur-sm">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
                Partenaires officiels
              </span>
              <h2 className="mt-5 text-[32px] sm:text-[42px] lg:text-[52px] leading-[1.05] font-extrabold text-white tracking-[-0.025em]">
                Ils nous font{" "}
                <span className="relative inline-block">
                  <span className="text-brand-500">
                    confiance
                  </span>
                  <span className="text-brand-500">.</span>
                </span>
              </h2>
              <p className="mt-5 text-[0.96rem] sm:text-[1.05rem] text-white/65 leading-relaxed max-w-xl mx-auto">
                Des partenaires engagés qui partagent notre vision d&apos;un artisanat
                <strong className="text-white"> accessible</strong> et de
                <strong className="text-white"> qualité</strong>.
              </p>

              {/* Mini stats */}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-6 text-[0.8rem]">
                <div className="flex items-center gap-2 text-white/65">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-300 text-[0.7rem] font-extrabold">1</span>
                  Partenaire officiel
                </div>
                <span className="text-white/15">·</span>
                <div className="flex items-center gap-2 text-white/65">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  Tous vérifiés
                </div>
                <span className="text-white/15">·</span>
                <div className="flex items-center gap-2 text-white/65">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M2 12h20M12 2a14 14 0 0 1 0 20M12 2a14 14 0 0 0 0 20"/></svg>
                  </span>
                  France entière
                </div>
              </div>
            </div>
          </Reveal>

          {/* ─── FEATURED · 3AS Partners (full width, premium) ─── */}
          <Reveal delay={100} distance={24}>
            <a
              href="https://www.3aspartners.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block bg-gradient-to-br from-ink-800/90 via-ink-700/70 to-ink-800/90 backdrop-blur-sm rounded-3xl sm:rounded-[36px] border border-white/10 hover:border-brand-500/50 overflow-hidden transition-all hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-20px_rgba(240,122,47,0.4)] mb-10"
            >
              {/* Glow gradient orange au hover */}
              <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-brand-500/[0.15] blur-[100px] opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-blue-500/[0.10] blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative grid md:grid-cols-[auto_1fr_auto] gap-6 sm:gap-8 lg:gap-12 items-center p-6 sm:p-8 lg:p-10">

                {/* Colonne 1 · Logo + Badge officiel */}
                <div className="relative flex items-center gap-5 md:block">
                  <div className="relative inline-block">
                    {/* Ring ambient autour du logo */}
                    <span className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-brand-500/30 via-brand-500/10 to-transparent blur-md group-hover:blur-xl transition-all" />

                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white flex items-center justify-center shadow-[0_10px_30px_-6px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform">
                      <div className="text-center">
                        <div className="font-display font-extrabold text-[1.6rem] sm:text-[1.85rem] leading-none text-ink-800 tracking-wider">3AS</div>
                        <div className="font-display font-bold text-[0.62rem] sm:text-[0.7rem] text-brand-500 tracking-[0.3em] mt-1">PARTNERS</div>
                      </div>
                    </div>

                    {/* Badge officiel (étoile) */}
                    <span className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 border-[3px] border-ink-800 flex items-center justify-center shadow-[0_4px_14px_rgba(240,122,47,0.6)]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
                    </span>
                  </div>

                  {/* Badge texte sous le logo (mobile inline) */}
                  <div className="md:mt-4 md:text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/15 border border-brand-500/40 text-brand-300 text-[0.62rem] font-extrabold tracking-[0.12em] uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                      Partenaire #1
                    </span>
                  </div>
                </div>

                {/* Colonne 2 · Info détaillée */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="text-white font-extrabold text-[1.4rem] sm:text-[1.65rem] lg:text-[1.85rem] tracking-tight">3AS Partners</h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[0.6rem] font-bold tracking-[0.1em] uppercase">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      Certifié
                    </span>
                  </div>
                  <p className="text-white/75 text-[0.96rem] sm:text-[1.02rem] leading-relaxed max-w-2xl">
                    <strong className="text-white">Domiciliation d&apos;entreprise & accompagnement juridique</strong> pour artisans, auto-entrepreneurs et TPE.
                    Une adresse professionnelle au cœur de Cannes, conseils sur-mesure et gestion administrative simplifiée.
                  </p>

                  {/* Services tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      "Domiciliation",
                      "Conseil juridique",
                      "Gestion administrative",
                      "Boîte postale",
                    ].map((s) => (
                      <span key={s} className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/70 text-[0.74rem] font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Colonne 3 · CTA + URL */}
                <div className="flex flex-col items-stretch md:items-end gap-3 flex-shrink-0 w-full md:w-auto">
                  <span className="text-[0.78rem] text-white/45 font-mono inline-flex items-center gap-1.5">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2c2.5 2.5 4 6 4 10s-1.5 7.5-4 10c-2.5-2.5-4-6-4-10s1.5-7.5 4-10z"/></svg>
                    3aspartners.com
                  </span>
                  <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-extrabold text-[0.92rem] shadow-[0_10px_28px_-6px_rgba(240,122,47,0.55),inset_0_1px_0_rgba(255,255,255,0.25)] group-hover:shadow-[0_16px_36px_-6px_rgba(240,122,47,0.7)] group-hover:-translate-y-0.5 transition-all whitespace-nowrap justify-center">
                    Visiter le site
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"><path d="M7 17L17 7M7 7h10v10"/></svg>
                  </span>
                  <span className="inline-flex items-center justify-center md:justify-end gap-1.5 text-[0.72rem] text-white/45">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    Recommandé aux artisans Bisecco
                  </span>
                </div>
              </div>
            </a>
          </Reveal>

          {/* ─── CTA bottom banner ─── */}
          <Reveal delay={600} distance={20}>
            <div className="mt-10 sm:mt-14 relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-500 p-7 sm:p-9 text-white">
              <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-white/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-ink-900/30 blur-2xl pointer-events-none" />

              <div className="relative grid md:grid-cols-[1fr_auto] items-center gap-5">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-white text-[0.62rem] font-extrabold tracking-[0.14em] uppercase backdrop-blur-sm mb-3">
                    Programme partenaires
                  </span>
                  <h3 className="text-[1.5rem] sm:text-[1.85rem] font-extrabold tracking-tight leading-tight">
                    Devenez partenaire officiel Bisecco.
                  </h3>
                  <p className="mt-2 text-white/85 text-[0.94rem] max-w-xl">
                    Touchez nos 2 400+ artisans actifs, gagnez en visibilité, bénéficiez d&apos;un référencement premium et d&apos;avantages exclusifs.
                  </p>
                </div>
                <Link
                  href="/contact?sujet=partenariat"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-ink-800 text-white font-extrabold text-[0.92rem] shadow-[0_10px_24px_-4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] hover:-translate-y-0.5 hover:bg-ink-900 transition-all whitespace-nowrap"
                >
                  Postuler maintenant
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ VOUS ÊTES ARTISAN ? · pitch B2B dédié ═══════════ */}
      <HomeArtisanPitch />

      {/* ═══════════ ARTICLES BLOG RÉCENTS ═══════════ */}
      <HomeBlogTeasers />

      {/* ═══════════ FAQ premium (client component, one-at-a-time) ═══════════ */}
      <HomeFaq />
    </>
  );
}
