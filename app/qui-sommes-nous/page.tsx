import type { Metadata } from "next";
import {
  Heart, Target, Shield, Users, ShieldCheck, Sparkles, Globe2,
  Briefcase, MapPin, Calendar, MessageCircle, FileText,
} from "lucide-react";
import { JsonLd } from "@/components/ui/JsonLd";
import { CtaButton } from "@/components/ui/CtaButton";
import { breadcrumbSchema } from "@/lib/seo/schemas";

export const metadata: Metadata = {
  title: "Qui sommes-nous · Histoire, mission, équipe Bisecco",
  description: "Découvrez l'histoire de Bisecco, fondé en 2026 par Laurent Nero (AGISCO HOLDING SAS). Notre mission : connecter artisans français vérifiés et particuliers, sans commission, avec transparence totale.",
  alternates: { canonical: "/qui-sommes-nous" },
};

const TIMELINE = [
  {
    date: "Été 2025",
    title: "L'idée",
    text: "Constat de Laurent Nero : la difficulté pour les particuliers de trouver un artisan fiable rapidement, et la rente abusive des plateformes traditionnelles sur les artisans (5-25 % de commission).",
  },
  {
    date: "Hiver 2025",
    title: "Conception",
    text: "Phase de R&D : design produit, choix technologique (Next.js + Supabase), vérification SIREN automatisée via l'API INSEE, première version privée testée auprès d'artisans pilotes.",
  },
  {
    date: "Janvier 2026",
    title: "Création AGISCO HOLDING",
    text: "Création officielle de la SAS éditrice (RCS Cannes 750 463 317) basée à Cannes. Recrutement des premiers artisans certifiés, ouverture des inscriptions.",
  },
  {
    date: "Mai 2026",
    title: "Lancement public",
    text: "Ouverture du réseau social Bisecco au grand public sur bisecco.fr. 100 % gratuit pour particuliers et artisans, 0 commission, contact direct.",
  },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Vérification radicale",
    text: "Chaque artisan est contrôlé via l'API officielle INSEE (recherche-entreprises.api.gouv.fr). Aucun profil sans SIREN actif. Aucune exception.",
  },
  {
    icon: Sparkles,
    title: "Zéro commission",
    text: "Bisecco ne prélève rien sur les transactions entre artisans et clients. Le réseau est gratuit pour tous · les artisans gardent 100 % de leurs revenus.",
  },
  {
    icon: MessageCircle,
    title: "Contact direct",
    text: "Pas de paywall pour récupérer les coordonnées. Particuliers et artisans échangent sans intermédiaire via notre messagerie sécurisée.",
  },
  {
    icon: Globe2,
    title: "Made in France",
    text: "Société française basée à Cannes. Données hébergées en Europe (RGPD strict). Aucun transfert hors UE. Support en français.",
  },
];

const COMMITMENTS = [
  "Aucun faux profil · vérification SIREN systématique",
  "Aucun avis acheté · seuls les vrais clients peuvent noter",
  "Aucune revente de données · nous ne vendons rien à des tiers",
  "Aucune commission · 100 % gratuit, sans carte bancaire à l'inscription",
  "Désinscription en 1 clic · respect du RGPD strict",
  "Support humain · jamais de bot, jamais de hotline payante",
];

const founderSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Qui sommes-nous · Bisecco",
  url: "https://bisecco.fr/qui-sommes-nous",
  mainEntity: {
    "@type": "Organization",
    name: "Bisecco",
    legalName: "AGISCO HOLDING SAS",
    foundingDate: "2026-01",
    founder: {
      "@type": "Person",
      name: "Laurent Nero",
      jobTitle: "Fondateur & Président",
    },
    url: "https://bisecco.fr",
    logo: "https://bisecco.fr/logo.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "45 Boulevard de la Croisette",
      postalCode: "06400",
      addressLocality: "Cannes",
      addressCountry: "FR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@bisecco.fr",
      contactType: "customer service",
      availableLanguage: "French",
    },
  },
};

export default function QuiSommesNousPage() {
  const breadcrumbs = breadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Qui sommes-nous", url: "/qui-sommes-nous" },
  ]);

  return (
    <>
      <JsonLd data={[founderSchema, breadcrumbs]} />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 text-white py-20 lg:py-24 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container-default relative text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 text-[0.7rem] font-bold tracking-[0.16em] uppercase backdrop-blur-sm">
            <Heart size={11} className="text-brand-400" /> Notre histoire
          </span>
          <h1 className="font-display font-semibold text-[42px] sm:text-[58px] lg:text-[68px] leading-[1.05] tracking-[-0.025em] mt-6">
            Construisons la <span className="text-brand-500">confiance</span><br />
            entre artisans et particuliers.
          </h1>
          <p className="mt-7 text-white/70 text-[1.05rem] leading-relaxed max-w-2xl mx-auto">
            Bisecco est née d&apos;un constat simple : trouver un artisan de confiance en France
            ne devrait pas être un parcours du combattant. Et un artisan compétent ne devrait pas
            verser une commission abusive pour accéder à sa propre clientèle.
          </p>
        </div>
      </section>

      {/* ═══════════ MISSION ═══════════ */}
      <section className="bg-sand-50 py-20 lg:py-24">
        <div className="container-default max-w-5xl">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.66rem] font-bold tracking-[0.16em] uppercase">
                <Target size={11} className="text-brand-500" /> Notre mission
              </span>
              <h2 className="font-display font-semibold text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.025em] text-ink-900 mt-5">
                Redonner aux artisans le <span className="text-brand-500">pouvoir</span> sur leur visibilité.
              </h2>
            </div>

            <div className="space-y-5 text-ink-600 text-[1rem] leading-relaxed">
              <p>
                En France, près d&apos;<strong className="text-ink-900">1 million d&apos;artisans</strong> dépendent
                de plateformes traditionnelles qui prélèvent 5 à 25 % de commission sur chaque chantier
                signé, ou font payer l&apos;accès aux coordonnées clients.
              </p>
              <p>
                <strong className="text-ink-900">Bisecco renverse ce modèle.</strong> Le réseau est gratuit
                pour tout le monde · particuliers comme professionnels. Les artisans gardent 100 % de leurs
                revenus. Les particuliers contactent qui ils veulent, sans paywall, sans formulaire intrusif.
              </p>
              <p>
                Notre seule source de revenus : des <strong className="text-ink-900">services premium optionnels</strong>{" "}
                pour les artisans qui souhaitent booster leur visibilité (pack mise en avant, statistiques
                avancées). Aucune commission sur leur activité, jamais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ VALEURS · 4 cards ═══════════ */}
      <section className="bg-white py-20 lg:py-24">
        <div className="container-default max-w-5xl">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.66rem] font-bold tracking-[0.16em] uppercase">
              <Heart size={11} className="text-brand-500" /> Nos valeurs
            </span>
            <h2 className="font-display font-semibold text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.025em] text-ink-900 mt-5">
              Quatre principes <span className="text-brand-500">non négociables</span>.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="bg-sand-50 rounded-3xl p-7 border border-sand-200 hover:border-brand-200 hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-500 grid place-items-center mb-5 text-white shadow-[0_8px_20px_-4px_rgba(240,122,47,0.45)]">
                  <Icon size={20} strokeWidth={2.2} />
                </div>
                <h3 className="font-display font-semibold text-[1.2rem] tracking-tight text-ink-900">{title}</h3>
                <p className="text-ink-600 mt-2.5 leading-relaxed text-[0.92rem]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TIMELINE ═══════════ */}
      <section className="bg-sand-50 py-20 lg:py-24">
        <div className="container-default max-w-4xl">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.66rem] font-bold tracking-[0.16em] uppercase">
              <Calendar size={11} className="text-brand-500" /> Notre histoire
            </span>
            <h2 className="font-display font-semibold text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.025em] text-ink-900 mt-5">
              Le parcours de <span className="text-brand-500">Bisecco</span>.
            </h2>
          </div>

          <div className="relative pl-8 border-l-2 border-dashed border-brand-200">
            {TIMELINE.map((step, i) => (
              <div key={step.date} className="relative mb-10 last:mb-0">
                {/* Dot */}
                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-brand-500 border-4 border-sand-50 shadow-[0_0_0_2px_#f07a2f33]" />
                <div className="text-[0.66rem] font-bold tracking-[0.16em] uppercase text-brand-500">
                  {step.date}
                </div>
                <h3 className="font-display font-semibold text-[1.3rem] tracking-tight text-ink-900 mt-1">
                  {step.title}
                </h3>
                <p className="text-ink-600 mt-2 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FONDATEUR + SOCIÉTÉ ═══════════ */}
      <section className="bg-white py-20 lg:py-24">
        <div className="container-default max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-10 items-stretch">

            {/* Carte fondateur */}
            <div className="relative bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 rounded-3xl p-8 text-white overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-brand-500/25 blur-3xl pointer-events-none" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 text-[0.62rem] font-bold tracking-[0.16em] uppercase">
                  <Users size={10} /> Fondateur
                </span>

                <div className="mt-6 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-orange-300 grid place-items-center font-display font-semibold text-white text-3xl shadow-[0_10px_24px_rgba(240,122,47,0.45)]">
                    LN
                  </div>
                  <div>
                    <div className="font-display font-semibold text-[1.4rem] tracking-tight">Laurent Nero</div>
                    <div className="text-white/65 text-[0.86rem]">Fondateur & Président</div>
                  </div>
                </div>

                <p className="mt-6 text-white/75 leading-relaxed">
                  Entrepreneur français passionné par l&apos;artisanat et la tech. Laurent a fondé
                  Bisecco avec la conviction que la technologie doit servir les professionnels du terrain,
                  pas les ponctionner.
                </p>

                <p className="mt-3 text-white/65 text-[0.92rem] leading-relaxed">
                  Disponible directement par email pour toute question stratégique ou retour sur le produit.
                </p>
              </div>
            </div>

            {/* Carte société */}
            <div className="bg-sand-50 rounded-3xl p-8 border border-sand-200">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.62rem] font-bold tracking-[0.16em] uppercase">
                <Briefcase size={10} className="text-brand-500" /> Société éditrice
              </span>

              <h3 className="font-display font-semibold text-[1.6rem] tracking-tight text-ink-900 mt-5">
                AGISCO HOLDING SAS
              </h3>

              <dl className="mt-5 space-y-3 text-[0.92rem]">
                <div className="flex items-center gap-2.5">
                  <FileText size={14} className="text-ink-400 flex-shrink-0" />
                  <dt className="text-ink-500 min-w-[70px]">RCS</dt>
                  <dd className="text-ink-900 font-medium">Cannes 750 463 317</dd>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar size={14} className="text-ink-400 flex-shrink-0" />
                  <dt className="text-ink-500 min-w-[70px]">Création</dt>
                  <dd className="text-ink-900 font-medium">Janvier 2026</dd>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin size={14} className="text-ink-400 flex-shrink-0 mt-0.5" />
                  <dt className="text-ink-500 min-w-[70px]">Siège</dt>
                  <dd className="text-ink-900 font-medium leading-snug">
                    45 Boulevard de la Croisette<br />
                    06400 Cannes, France
                  </dd>
                </div>
                <div className="flex items-center gap-2.5">
                  <Globe2 size={14} className="text-ink-400 flex-shrink-0" />
                  <dt className="text-ink-500 min-w-[70px]">Web</dt>
                  <dd className="text-brand-500 font-medium">bisecco.fr</dd>
                </div>
              </dl>

              <div className="mt-6 pt-5 border-t border-sand-200 text-[0.82rem] text-ink-500 leading-relaxed">
                Société éditrice de la plateforme bisecco.fr. Aucune sous-traitance, aucune
                délégation de gestion. L&apos;équipe traite directement avec les artisans et particuliers.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ ENGAGEMENTS · liste check ═══════════ */}
      <section className="bg-sand-50 py-20 lg:py-24">
        <div className="container-default max-w-3xl">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.66rem] font-bold tracking-[0.16em] uppercase">
              <Shield size={11} className="text-brand-500" /> Nos engagements
            </span>
            <h2 className="font-display font-semibold text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.025em] text-ink-900 mt-5">
              Six promesses tenues, <span className="text-brand-500">tous les jours</span>.
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-sand-200 p-8">
            <ul className="space-y-4">
              {COMMITMENTS.map((c) => (
                <li key={c} className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 grid place-items-center flex-shrink-0 mt-0.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span className="text-ink-700 text-[0.96rem] leading-relaxed">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="bg-white py-20 lg:py-24">
        <div className="container-default max-w-3xl text-center">
          <h2 className="font-display font-semibold text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.025em] text-ink-900">
            Rejoignez la <span className="text-brand-500">communauté</span> Bisecco.
          </h2>
          <p className="text-ink-500 mt-4 max-w-xl mx-auto leading-relaxed">
            Particulier, artisan ou simple curieux · créez votre compte gratuit et participez
            au mouvement de l&apos;artisanat français.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CtaButton href="/inscription" variant="primary" size="lg">
              Créer mon compte
            </CtaButton>
            <CtaButton href="/contact" variant="white" size="lg">
              Nous contacter
            </CtaButton>
          </div>
        </div>
      </section>
    </>
  );
}
