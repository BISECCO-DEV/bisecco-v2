import { Reveal } from "@/components/ui/Reveal";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { CtaButton } from "@/components/ui/CtaButton";
import { JsonLd } from "@/components/ui/JsonLd";
import { HomeLocalSearch } from "@/components/features/home/HomeLocalSearch";
import { HomeFaq } from "@/components/features/home/HomeFaq";
import { HomeSeoLinks } from "@/components/features/home/HomeSeoLinks";
import { HOME_FAQ_ITEMS } from "@/lib/seo/home-faq";
import { faqSchema, organizationSchema, websiteSchema, aggregateRatingSchema } from "@/lib/seo/schemas";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { HomeHowItWorks } from "@/components/features/home/HomeHowItWorks";
import { HomeMetiers } from "@/components/features/home/HomeMetiers";
import { HomeComparison } from "@/components/features/home/HomeComparison";
import { HomeArtisanPitch } from "@/components/features/home/HomeArtisanPitch";
import { HomeBlogTeasers } from "@/components/features/home/HomeBlogTeasers";
import { HomeReviews } from "@/components/features/home/HomeReviews";
import { HomeCommunityStats } from "@/components/features/home/HomeCommunityStats";
import { HomeTopPros } from "@/components/features/home/HomeTopPros";
import {
  ShieldCheck,
  Sparkles,
  UserPlus,
  Zap,
  MapPin,
  ArrowRight,
  Search,
  Hammer,
  Check,
  Banknote,
  Star,
  Lock,
  LifeBuoy,
  Send,
} from "lucide-react";

// Canonical de l'accueil (titre/description hérités du layout racine).
export const metadata = {
  alternates: { canonical: "/" },
};


// Revalidation toutes les 5 min : la home se cache et se régénère en arrière-plan.
// Les sections dynamiques (HomeLocalSearch, HomeReviews) sont rebuild à fréquence
// raisonnable au lieu de hit la DB à chaque visite.
export const revalidate = 300;

/**
 * Récupère la note moyenne réelle des avis approuvés sur la plateforme.
 * Utilisé pour le AggregateRating · Google n'aime PAS les fake ratings.
 * Retourne null si moins de 3 avis (Google demande ce minimum pour afficher des étoiles).
 */
async function fetchGlobalRating(): Promise<{ ratingValue: number; reviewCount: number } | null> {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("rating")
      .eq("status", "approved")
      .eq("is_flagged", false);
    if (error || !data || data.length < 3) return null;
    const total = data.reduce((sum, r) => sum + r.rating, 0);
    return {
      ratingValue: Number((total / data.length).toFixed(1)),
      reviewCount: data.length,
    };
  } catch {
    return null;
  }
}

export default async function HomePage() {
  // JSON-LD : on agrège tous les schemas dans un seul block pour minimiser le HTML
  const faqLd = faqSchema(HOME_FAQ_ITEMS.slice(0, 8).map((f) => ({ question: f.q, answer: f.a })));
  const orgLd = organizationSchema();
  const siteLd = websiteSchema();

  // Étoiles dans Google SERP · seulement si on a au moins 3 vrais avis
  const rating = await fetchGlobalRating();
  const ratingLd = rating ? aggregateRatingSchema(rating.ratingValue, rating.reviewCount) : null;

  const allSchemas = [orgLd, siteLd, faqLd, ...(ratingLd ? [ratingLd] : [])];

  return (
    <>
      <JsonLd data={allSchemas} />
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative flex items-start md:items-center min-h-[78vh] md:min-h-[78vh] lg:min-h-[95vh] bg-[#05122e] overflow-hidden">
        {/* Image de fond · <picture> responsive (mobile portrait / desktop landscape) */}
        <picture className="absolute inset-0 lg:inset-x-0 lg:top-[110px] lg:bottom-0" aria-hidden="true">
          <source media="(max-width: 768px)" srcSet="/hero-network-mobile.webp" />
          { }
          <img
            src="/hero-network.webp"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center lg:object-[85%_center] xl:object-[78%_center] 2xl:object-[72%_center]"
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
                className="text-[24px] sm:text-[36px] lg:text-[44px] leading-[1.2] sm:leading-[1.1] lg:leading-[1.1] font-semibold tracking-[-0.015em] animate-reveal-up"
                style={{ animationDelay: "100ms" }}
              >
                <span className="block lg:whitespace-nowrap">
                  1<sup className="text-[0.55em] font-extrabold align-super">er</sup> réseau social des Professionnels,
                </span>
                <span className="block text-brand-500 lg:whitespace-nowrap">
                  pensé pour les particuliers.
                </span>
              </h1>

              {/* Description · reveal après le titre */}
              <p
                className="mt-5 sm:mt-7 text-[14px] sm:text-[17px] text-white/80 max-w-xl lg:max-w-none mx-auto md:mx-0 leading-[1.55] sm:leading-[1.6] lg:whitespace-nowrap animate-reveal-up"
                style={{ animationDelay: "350ms" }}
              >
                <span className="text-white font-semibold">Inscrivez votre entreprise.</span>
                {" "}Recevez vos premiers contacts cette semaine.
              </p>

              {/* Trust chips · cascade stagger */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 mt-5 sm:mt-7">
                {[
                  { icon: ShieldCheck, label: "Sans intermédiaire" },
                  { icon: Sparkles,    label: "100 % gratuit" },
                ].map((chip, i) => (
                  <span
                    key={chip.label}
                    className="flex-shrink-0 inline-flex items-center gap-1.5 sm:gap-2 py-1 sm:py-1.5 text-[12px] sm:text-[0.82rem] font-semibold text-white whitespace-nowrap animate-reveal-up"
                    style={{ animationDelay: `${550 + i * 90}ms` }}
                  >
                    <chip.icon size={12} strokeWidth={2.6} className="text-brand-400" />
                    {chip.label}
                  </span>
                ))}
              </div>

              {/* CTAs · style ihos (asymétrique + icône) avec orange Bisecco */}
              <div className="flex flex-row items-center justify-center md:justify-start gap-2 sm:gap-3 mt-6 sm:mt-10 animate-reveal-up" style={{ animationDelay: "850ms" }}>
                <CtaButton href="/inscription" variant="primary" size="sm" className="flex-1 sm:flex-none justify-between sm:justify-start sm:px-5 sm:py-3 sm:text-[0.92rem]">
                  Créer mon profil
                </CtaButton>
                <CtaButton href="/rechercher?intent=cv" variant="white" size="sm" className="flex-1 sm:flex-none justify-between sm:justify-start sm:px-5 sm:py-3 sm:text-[0.92rem]">
                  Déposer mon CV
                </CtaButton>
              </div>

              {/* Accroche sous les CTAs */}
              <p
                className="text-center md:text-left mt-4 sm:mt-5 text-[0.92rem] sm:text-[1rem] font-semibold text-white/90 animate-reveal-up"
                style={{ animationDelay: "950ms" }}
              >
                Inscrivez-vous gratuitement et prenez une longueur d&rsquo;avance. 🚀
              </p>

              {/* Live social proof · entrance delay + counter animation */}
            </div>
            {/* Colonne droite vide · l'image hero-network occupe la zone */}
            <div className="hidden lg:block" />
          </div>
        </div>
        <ScrollIndicator targetId="gratuit" offset={110} label="Découvrir" />
      </section>

      {/* ═══════════ SIGNALER UN PROBLÈME · invite au feedback utilisateur ═══════════ */}
      <section className="bg-ink-50 border-b border-ink-100">
        <div className="container-default py-8 sm:py-10">
          <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center gap-5 sm:gap-7 rounded-2xl bg-white border border-ink-100 shadow-[0_4px_20px_rgba(13,30,74,0.06)] px-6 sm:px-8 py-6 sm:py-7">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 grid place-items-center">
              <LifeBuoy size={22} className="text-brand-500" strokeWidth={2.2} />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-bold text-ink-700 text-[1.05rem] sm:text-[1.15rem] tracking-tight">
                Un problème ou une anomalie sur le site ?
              </h2>
              <p className="text-ink-500 text-sm mt-1.5 leading-relaxed max-w-2xl">
                Bisecco évolue chaque semaine. Si vous repérez un bug, une erreur d&apos;affichage
                ou un comportement inattendu, signalez-le-nous directement. Notre équipe le prend
                en charge rapidement.
              </p>
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              <CtaButton href="/contact" variant="primary" size="md" icon={Send} className="w-full justify-center sm:w-auto">
                Nous signaler
              </CtaButton>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ STATS COMMUNAUTÉ LIVE · masqué temporairement (demande client 2026-06-14) ═══════════ */}
      {/* <HomeCommunityStats /> */}

      {/* ═══════════ COMMENT ÇA MARCHE · dual particulier/artisan avec tabs ═══════════ */}
      <HomeHowItWorks />

      {/* ═══════════ MÉTIERS POPULAIRES · grid SEO ═══════════ */}
      <HomeMetiers />

      {/* ═══════════ RECHERCHE LOCALE · Carte interactive + Carousel ═══════════ */}
      <HomeLocalSearch />

      {/* ═══════════ AVANT/APRÈS · vitrine des pros qui ont publié ═══════════ */}
      <HomeTopPros />


      {/* ═══════════ 100 % GRATUIT · 2 cards style "pricing" pro ═══════════ */}
      <section id="gratuit" className="relative overflow-hidden bg-[#05122e] py-20 sm:py-28">
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
          {/* ═══════ HEAD CENTRÉ ═══════ */}
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-[0.7rem] font-bold tracking-[0.14em] uppercase backdrop-blur-sm">
                <Sparkles size={11} strokeWidth={2.8} className="text-brand-400" />
                Aucune carte bancaire requise
              </span>
              <h2 className="mt-5 text-[32px] lg:text-[38px] leading-[1.25] font-semibold text-white tracking-[-0.025em]">
                Bisecco, c&apos;est{" "}
                <span className="relative inline-block">
                  <span className="text-brand-500">100 % gratuit</span>
                  <span className="text-brand-500">.</span>
                </span>
              </h2>
              <p className="mt-5 text-[0.96rem] sm:text-[1.05rem] text-white/65 leading-relaxed max-w-xl mx-auto">
                Pas d&apos;abonnement. Pas de commission. Pas de frais cachés.
                <strong className="text-white"> Vous gardez 100 % de vos revenus.</strong>
              </p>
            </div>
          </Reveal>

          {/* ═══════ 2 PRICING CARDS BLANCHES ═══════ */}
          <div className="grid md:grid-cols-2 gap-5 sm:gap-6 max-w-5xl mx-auto">
            {/* PARTICULIERS */}
            <Reveal delay={100}>
              <div className="group relative h-full bg-white rounded-3xl border border-ink-100 overflow-hidden hover:border-brand-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-20px_rgba(240,122,47,0.4)] transition-all">
                {/* Bandeau header */}
                <div className="px-7 sm:px-8 pt-7 sm:pt-8 pb-6 border-b border-ink-100 bg-gradient-to-br from-brand-50/60 via-white to-white">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[0.7rem] font-bold tracking-[0.18em] uppercase text-brand-500">
                        Particulier
                      </div>
                      <h3 className="mt-1 text-[1.4rem] sm:text-[1.55rem] font-extrabold text-ink-700 tracking-tight leading-tight">
                        Je cherche un professionnel
                      </h3>
                    </div>
                    {/* Icon badge */}
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-[0_8px_20px_-4px_rgba(240,122,47,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] flex-shrink-0">
                      <Search size={20} strokeWidth={2.2} />
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="text-[2.6rem] sm:text-[3rem] font-extrabold text-ink-700 leading-none tracking-tight">0&nbsp;€</span>
                    <span className="text-[0.86rem] text-ink-400 font-semibold">à vie</span>
                  </div>
                  <p className="mt-1 text-[0.82rem] text-ink-500">Trouvez votre professionnel en 2 minutes.</p>
                </div>

                {/* Liste features */}
                <div className="px-7 sm:px-8 py-6 space-y-3">
                  {[
                    "Recherche illimitée par métier et ville",
                    "Contactez les professionnels directement",
                    "Consultez les avis clients vérifiés",
                    "Demandez des devis sans engagement",
                    "Aucune commission sur vos travaux",
                  ].map((text) => (
                    <div key={text} className="flex items-start gap-3 text-[0.88rem] text-ink-600 leading-snug">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-50 text-brand-600 flex-shrink-0 mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {text}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="px-7 sm:px-8 pb-7 sm:pb-8">
                  <CtaButton href="/rechercher" variant="primary" size="lg" className="w-full justify-center">
                    Trouver un professionnel
                  </CtaButton>
                </div>
              </div>
            </Reveal>

            {/* ARTISANS · MISE EN AVANT */}
            <Reveal delay={200}>
              <div className="relative h-full pt-3">
                {/* Badge "Recommandé" — DEHORS de la card pour ne pas être coupé */}
                <div className="absolute top-0 right-7 sm:right-8 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white text-[0.62rem] font-extrabold tracking-[0.14em] uppercase shadow-[0_6px_14px_-3px_rgba(240,122,47,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] whitespace-nowrap">
                  <Sparkles size={10} strokeWidth={3} />
                  Recommandé
                </div>

                <div className="group h-full bg-white rounded-3xl border-2 border-brand-300 overflow-hidden hover:-translate-y-1 hover:shadow-[0_30px_60px_-20px_rgba(240,122,47,0.55)] transition-all shadow-[0_20px_40px_-15px_rgba(240,122,47,0.35)]">

                {/* Bandeau header */}
                <div className="px-7 sm:px-8 pt-7 sm:pt-8 pb-6 border-b border-ink-100 bg-gradient-to-br from-brand-50 via-brand-50/40 to-white">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[0.7rem] font-bold tracking-[0.18em] uppercase text-brand-500">
                        Professionnel
                      </div>
                      <h3 className="mt-1 text-[1.4rem] sm:text-[1.55rem] font-extrabold text-ink-700 tracking-tight leading-tight">
                        Je veux des clients
                      </h3>
                    </div>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-ink-700 to-ink-800 text-white shadow-[0_8px_20px_-4px_rgba(13,30,74,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] flex-shrink-0">
                      <Hammer size={20} strokeWidth={2.2} />
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="text-[2.6rem] sm:text-[3rem] font-extrabold text-ink-700 leading-none tracking-tight">0&nbsp;€</span>
                    <span className="text-[0.86rem] text-ink-400 font-semibold">à vie · 0 % commission</span>
                  </div>
                  <p className="mt-1 text-[0.82rem] text-ink-500">Recevez vos premiers contacts cette semaine.</p>
                </div>

                {/* Liste features */}
                <div className="px-7 sm:px-8 py-6 space-y-3">
                  {[
                    "Profil professionnel complet en ligne",
                    "Galerie de réalisations illimitée",
                    "Badge SIREN vérifié sur votre profil",
                    "Messagerie directe avec les clients",
                    "Statistiques de visites en temps réel",
                  ].map((text) => (
                    <div key={text} className="flex items-start gap-3 text-[0.88rem] text-ink-600 leading-snug">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-500 text-white flex-shrink-0 mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {text}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="px-7 sm:px-8 pb-7 sm:pb-8">
                  <CtaButton href="/inscription" variant="primary" size="lg" className="w-full justify-center">
                    Créer mon profil gratuit
                  </CtaButton>
                </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ═══════ TRUST SIGNALS PRO ═══════ */}
          <Reveal delay={400}>
            <div className="mt-14 sm:mt-16 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: ShieldCheck, title: "SIREN vérifié",     sub: "Contrôle automatique INSEE", color: "from-emerald-500 to-emerald-600" },
                { icon: Banknote,    title: "0 % commission",    sub: "Sur toutes vos prestations", color: "from-brand-500 to-brand-600" },
                { icon: Star,        title: "Avis authentiques", sub: "Vérifiés par notre équipe",  color: "from-amber-500 to-amber-600" },
                { icon: Lock,        title: "RGPD conforme",     sub: "Hébergement français",       color: "from-blue-500 to-blue-600" },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <div key={t.title} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-colors">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} text-white shadow-[0_6px_14px_-3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.25)] flex-shrink-0`}>
                      <Icon size={16} strokeWidth={2.4} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[0.82rem] font-extrabold text-white tracking-tight">{t.title}</div>
                      <div className="text-[0.7rem] text-white/55 mt-0.5 leading-snug">{t.sub}</div>
                    </div>
                  </div>
                );
              })}
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
                    <h2 className="mt-5 text-[32px] lg:text-[38px] leading-[1.25] font-semibold text-white tracking-[-0.025em]">
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
                      <span className="text-white font-semibold"> chaque professionnel mérite d&apos;être visible </span>
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
                      <CtaButton href="/inscription" variant="primary" size="lg" icon={UserPlus}>
                        Créer mon profil
                      </CtaButton>

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
                        alt="Professionnel au travail · Bisecco valorise chaque savoir-faire"
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

      {/* ═══════════ AVIS CLIENTS · Vrais avis depuis la DB ═══════════ */}
      <HomeReviews />

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
          {/* ═══════ HEAD CENTRÉ ═══════ */}
          <Reveal distance={20}>
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-[0.7rem] font-bold tracking-[0.14em] uppercase backdrop-blur-sm">
                <ShieldCheck size={11} strokeWidth={2.8} className="text-brand-400" />
                Partenaires officiels
              </span>
              <h2 className="mt-5 text-[32px] lg:text-[38px] leading-[1.25] font-semibold text-white tracking-[-0.025em]">
                Un écosystème d&apos;experts pour{" "}
                <span className="relative inline-block">
                  <span className="text-brand-500">accompagner nos professionnels</span>
                  <span className="text-brand-500">.</span>
                </span>
              </h2>
              <p className="mt-5 text-[0.96rem] sm:text-[1.05rem] text-white/65 leading-relaxed max-w-xl mx-auto">
                Domiciliation, juridique, comptabilité, assurance · des partenaires soigneusement sélectionnés
                pour vous faire gagner du temps et sécuriser votre activité.
              </p>
            </div>
          </Reveal>

          {/* ═══════ CARTE PARTENAIRE · format premium horizontal ═══════ */}
          <Reveal delay={100} distance={24}>
            <a
              href="https://www.3aspartners.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block max-w-5xl mx-auto bg-white rounded-3xl border border-ink-100 hover:border-brand-300 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_30px_60px_-20px_rgba(240,122,47,0.45)]"
            >
              {/* Glow brand au hover */}
              <div className="absolute -top-40 -right-40 w-[400px] h-[400px] rounded-full bg-brand-500/[0.15] blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Ruban "Partenaire premium" en coin */}
              <div className="absolute top-5 right-5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white text-[0.6rem] font-extrabold tracking-[0.12em] uppercase shadow-[0_6px_14px_-3px_rgba(240,122,47,0.5),inset_0_1px_0_rgba(255,255,255,0.25)]">
                <Sparkles size={9} strokeWidth={3} />
                Partenaire premium
              </div>

              <div className="relative grid md:grid-cols-[180px_1fr] gap-6 sm:gap-8 p-6 sm:p-8 lg:p-10">
                {/* COL LOGO */}
                <div className="flex md:flex-col items-center md:items-start gap-4">
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-ink-50 to-ink-100 border border-ink-100 flex items-center justify-center shadow-[0_8px_20px_-6px_rgba(13,30,74,0.15)] group-hover:shadow-[0_14px_30px_-8px_rgba(240,122,47,0.35)] transition-shadow">
                      <div className="text-center">
                        <div className="font-display font-extrabold text-[1.6rem] sm:text-[1.85rem] leading-none text-ink-800 tracking-wider">3AS</div>
                        <div className="font-display font-bold text-[0.62rem] sm:text-[0.7rem] text-brand-500 tracking-[0.3em] mt-1">PARTNERS</div>
                      </div>
                    </div>
                  </div>

                  {/* Meta vertical (desktop) */}
                  <div className="hidden md:block space-y-2">
                    <div className="inline-flex items-center gap-1.5 text-[0.74rem] text-ink-500 font-semibold">
                      <MapPin size={11} className="text-brand-500" />
                      Cannes (06)
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-[0.74rem] text-ink-500 font-semibold">
                      <ShieldCheck size={11} className="text-emerald-500" />
                      Vérifié par Bisecco
                    </div>
                  </div>
                </div>

                {/* COL CONTENU */}
                <div className="min-w-0">
                  {/* Catégorie */}
                  <div className="text-[0.66rem] font-bold tracking-[0.18em] uppercase text-brand-500 mb-2">
                    Domiciliation · Juridique
                  </div>

                  {/* Nom */}
                  <h3 className="text-ink-700 font-extrabold text-[1.5rem] sm:text-[1.8rem] tracking-tight leading-tight">
                    3AS Partners
                  </h3>

                  {/* Pitch */}
                  <p className="mt-3 text-ink-500 text-[0.95rem] sm:text-[1rem] leading-relaxed max-w-2xl">
                    Domiciliation d&apos;entreprise et accompagnement juridique pour professionnels, auto-entrepreneurs
                    et TPE. Une adresse professionnelle au cœur de Cannes, conseils sur-mesure et gestion
                    administrative simplifiée.
                  </p>

                  {/* Tags services */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {[
                      "Domiciliation",
                      "Conseil juridique",
                      "Gestion administrative",
                      "Boîte postale",
                    ].map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center px-2.5 py-1 rounded-md bg-ink-50 border border-ink-100 text-ink-600 text-[0.72rem] font-semibold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-6 flex items-center justify-between gap-4 pt-5 border-t border-ink-100">
                    <div className="min-w-0 flex items-center gap-2 text-[0.78rem] text-ink-400 font-mono truncate">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      3aspartners.com
                    </div>
                    <span className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-bold text-[0.86rem] shadow-[0_8px_20px_-4px_rgba(240,122,47,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_14px_28px_-4px_rgba(240,122,47,0.6)] transition-shadow whitespace-nowrap flex-shrink-0">
                      Visiter le site
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </Reveal>

          {/* ═══════ EMPLACEMENTS PROCHAINS PARTENAIRES (slots vides) ═══════ */}
          <Reveal delay={300}>
            <div className="mt-5 max-w-5xl mx-auto grid sm:grid-cols-3 gap-3">
              {[
                { label: "Comptabilité", icon: "📊" },
                { label: "Assurance pro", icon: "🛡️" },
                { label: "Financement", icon: "💼" },
              ].map((slot) => (
                <div
                  key={slot.label}
                  className="group relative overflow-hidden rounded-2xl px-4 py-5 text-center bg-white border border-ink-100 hover:border-brand-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-12px_rgba(13,30,74,0.5)] transition-all"
                >
                  {/* Halo brand au hover */}
                  <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-brand-500/[0.20] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative text-2xl mb-2 group-hover:scale-110 transition-transform">
                    {slot.icon}
                  </div>
                  <div className="relative text-[0.85rem] font-extrabold text-ink-700">
                    {slot.label}
                  </div>
                  <div className="relative inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.6rem] font-extrabold tracking-[0.1em] uppercase">
                    <span className="w-1 h-1 rounded-full bg-brand-500 animate-pulse" />
                    Bientôt
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* ═══════ CTA BOTTOM · devenir partenaire ═══════ */}
          <Reveal delay={500} distance={20}>
            <div className="mt-12 sm:mt-14 max-w-5xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-500 p-7 sm:p-9 text-white">
              <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-white/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-ink-900/30 blur-2xl pointer-events-none" />

              <div className="relative grid md:grid-cols-[1fr_auto] items-center gap-5">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-white text-[0.62rem] font-extrabold tracking-[0.14em] uppercase backdrop-blur-sm mb-3">
                    Programme partenaires
                  </span>
                  <h3 className="text-[1.5rem] sm:text-[1.85rem] font-extrabold tracking-tight leading-tight">
                    Vous proposez un service B2B utile aux professionnels&nbsp;?
                  </h3>
                  <p className="mt-2 text-white/85 text-[0.94rem] max-w-xl">
                    Rejoignez notre programme partenaires. Visibilité ciblée, mise en relation directe,
                    candidature étudiée sous 48h.
                  </p>
                </div>
                <CtaButton href="/contact?sujet=partenariat" variant="dark" size="lg">
                  Postuler maintenant
                </CtaButton>
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

      {/* ═══════════ MAILLAGE SEO · liens vers pages métier × ville ═══════════ */}
      <HomeSeoLinks />
    </>
  );
}
