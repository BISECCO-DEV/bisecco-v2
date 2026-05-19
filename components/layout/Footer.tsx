"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Mail, MapPin, ShieldCheck, ArrowRight, Users, Hammer,
  Briefcase, Building2, Sparkles, Heart, Globe2,
} from "lucide-react";

const FOOTER_HIDDEN_ROUTES = ["/admin", "/coming-soon", "/maintenance"];

const SOCIAL_ICONS: Record<string, string> = {
  Facebook:  "M22 12a10 10 0 1 0-11.56 9.88V14.9h-2.54V12h2.54V9.8c0-2.5 1.5-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.9h-2.33v6.98A10 10 0 0 0 22 12z",
  Instagram: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.06 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.06 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.06-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.43-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.06-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 5.84a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.2-.6a1 1 0 1 0-2 0 1 1 0 0 0 2 0zM12 14.6a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2z",
  LinkedIn:  "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43A2.07 2.07 0 1 1 5.34 3.3a2.07 2.07 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z",
  YouTube:   "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z",
};

const NAV_PARTICULIERS = [
  { href: "/rechercher",  label: "Trouver un artisan" },
  { href: "/metiers",     label: "Tous les métiers" },
  { href: "/avis",        label: "Avis clients" },
  { href: "/devis",       label: "Demander un devis" },
  { href: "/aide",        label: "Centre d'aide" },
  { href: "/blog",        label: "Blog & conseils" },
];

const NAV_ARTISANS = [
  { href: "/inscription",      label: "Créer mon profil",   highlight: true },
  { href: "/partenaires-pro",  label: "Espace pros" },
  { href: "/emploi/poster",    label: "Poster une offre" },
  { href: "/parrainage",       label: "Parrainage" },
  { href: "/aide",             label: "Aide artisans" },
];

const TOP_METIERS = [
  { name: "Plombier",     slug: "plombier" },
  { name: "Électricien",  slug: "electricien" },
  { name: "Maçon",        slug: "macon" },
  { name: "Menuisier",    slug: "menuisier" },
  { name: "Peintre",      slug: "peintre" },
  { name: "Couvreur",     slug: "couvreur" },
  { name: "Carreleur",    slug: "carreleur" },
  { name: "Chauffagiste", slug: "chauffagiste" },
];

const TOP_VILLES = [
  "Meaux", "Chelles", "Melun", "Lagny-sur-Marne",
  "Paris", "Versailles", "Argenteuil", "Cergy",
];

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function Footer() {
  const pathname = usePathname();
  if (pathname && FOOTER_HIDDEN_ROUTES.some((r) => pathname.startsWith(r))) {
    return null;
  }
  return (
    <footer className="relative bg-[#070f24] text-white overflow-hidden">
      {/* Pattern hexagones */}
      <div
        className="absolute inset-0 opacity-[0.045] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='84' height='96' viewBox='0 0 84 96'><path d='M42 0L84 24v48L42 96 0 72V24z' fill='none' stroke='%23ffffff' stroke-width='1.2'/></svg>")`,
          backgroundSize: "84px 96px",
        }}
      />
      {/* Halos */}
      <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-brand-500/[0.10] blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/[0.06] blur-[140px] pointer-events-none" />

      {/* ═══════════ TOP CTA BANNER ═══════════ */}
      <div className="relative border-b border-white/[0.06]">
        <div className="container-default py-10 lg:py-14">
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-[0.66rem] font-extrabold tracking-[0.14em] uppercase backdrop-blur-sm">
                <Sparkles size={10} strokeWidth={3} />
                Prêt à démarrer ?
              </span>
              <h2 className="mt-4 text-[26px] sm:text-[32px] lg:text-[40px] font-extrabold leading-[1.1] tracking-[-0.025em]">
                Rejoignez la plateforme <br className="hidden sm:block" />
                d&apos;artisanat <span className="text-brand-500">de référence</span>.
              </h2>
              <p className="mt-3 text-white/65 text-[0.94rem] max-w-xl leading-relaxed">
                Particulier en quête d&apos;un pro fiable ou artisan cherchant à développer votre activité · Bisecco est gratuit pour tout le monde.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Link
                href="/rechercher"
                className="group relative flex flex-col items-start gap-1 p-5 rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/15 hover:border-brand-400/50 hover:bg-white/[0.10] transition-all hover:-translate-y-0.5"
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-400 mb-1">
                  <Users size={16} strokeWidth={2.4} />
                </span>
                <span className="text-[0.66rem] font-extrabold tracking-[0.12em] uppercase text-brand-400">Particulier</span>
                <span className="font-extrabold text-[1rem] tracking-tight">Trouver un artisan</span>
                <span className="inline-flex items-center gap-1 mt-1.5 text-[0.78rem] font-bold text-white/75 group-hover:text-white">
                  Démarrer
                  <ArrowRight size={12} strokeWidth={2.6} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>

              <Link
                href="/inscription"
                className="group relative flex flex-col items-start gap-1 p-5 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-[0_10px_28px_-6px_rgba(240,122,47,0.55),inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-6px_rgba(240,122,47,0.7)] transition-all overflow-hidden"
              >
                <span className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-white/20 blur-2xl pointer-events-none" />
                <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 border border-white/30 mb-1">
                  <Hammer size={16} strokeWidth={2.4} />
                </span>
                <span className="relative text-[0.66rem] font-extrabold tracking-[0.12em] uppercase text-white/85">Artisan</span>
                <span className="relative font-extrabold text-[1rem] tracking-tight">Créer mon profil</span>
                <span className="relative inline-flex items-center gap-1 mt-1.5 text-[0.78rem] font-extrabold">
                  100 % gratuit
                  <ArrowRight size={12} strokeWidth={2.6} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ COLONNES NAV ═══════════ */}
      <div className="container-default py-14 lg:py-16 relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-6">

          {/* Brand · 4 cols */}
          <div className="col-span-2 md:col-span-3 lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/15 shadow-[0_4px_14px_rgba(0,0,0,0.4)] bg-white">
                <Image
                  src="/logo.jpg"
                  alt=""
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-display font-extrabold text-2xl tracking-wide group-hover:text-brand-400 transition-colors">
                BISECCO
              </span>
            </Link>
            <p className="mt-5 text-white/60 text-[0.94rem] leading-relaxed max-w-sm">
              Le 1<sup>er</sup> annuaire d&apos;artisans français vérifiés SIREN.
              Trouvez un pro de confiance près de chez vous, <strong className="text-white">sans commission</strong>,
              en contact direct.
            </p>

            {/* Mini trust badges */}
            <div className="mt-5 flex flex-wrap gap-1.5">
              {[
                { icon: ShieldCheck, label: "SIREN vérifié", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" },
                { icon: Globe2,      label: "Made in France", color: "text-blue-400 bg-blue-500/10 border-blue-500/25" },
                { icon: Heart,       label: "0 % commission", color: "text-brand-400 bg-brand-500/10 border-brand-500/25" },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <span key={t.label} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${t.color} border text-[0.66rem] font-bold`}>
                    <Icon size={10} strokeWidth={2.6} />
                    {t.label}
                  </span>
                );
              })}
            </div>

            {/* Coordonnées */}
            <ul className="mt-6 space-y-2.5 text-[0.86rem]">
              <li className="flex items-start gap-2.5 text-white/65">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-white/[0.05] text-brand-400 flex-shrink-0 mt-0.5">
                  <MapPin size={12} strokeWidth={2.2} />
                </span>
                <span>45 Bd de la Croisette<br />06400 Cannes, France</span>
              </li>
              <li className="flex items-center gap-2.5 text-white/65">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-white/[0.05] text-brand-400 flex-shrink-0">
                  <Mail size={12} strokeWidth={2.2} />
                </span>
                <a href="mailto:contact@bisecco.fr" className="hover:text-white transition">contact@bisecco.fr</a>
              </li>
            </ul>

            {/* Socials */}
            <div className="mt-6">
              <div className="text-[0.66rem] font-extrabold tracking-[0.14em] uppercase text-white/35 mb-2.5">
                Suivez-nous
              </div>
              <div className="flex gap-2">
                {[
                  { key: "Facebook",  href: "https://www.facebook.com/bisecco" },
                  { key: "Instagram", href: "https://www.instagram.com/bisecco.fr" },
                  { key: "LinkedIn",  href: "https://www.linkedin.com/company/bisecco" },
                  { key: "YouTube",   href: "#" },
                ].map(({ key, href }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="group relative w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-gradient-to-br hover:from-brand-500 hover:to-brand-600 hover:border-brand-500 hover:-translate-y-0.5 transition-all flex items-center justify-center text-white/65 hover:text-white"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d={SOCIAL_ICONS[key]} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Particuliers · 2 cols */}
          <FooterCol
            icon={Users}
            iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
            title="Particuliers"
            links={NAV_PARTICULIERS}
          />

          {/* Artisans · 2 cols */}
          <div className="lg:col-span-2">
            <h4 className="inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-brand-400 mb-4">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-brand-500/10 border border-brand-500/25 text-brand-400">
                <Hammer size={10} strokeWidth={2.6} />
              </span>
              Artisans
            </h4>
            <ul className="space-y-2.5 text-[0.88rem]">
              {NAV_ARTISANS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`group inline-flex items-center gap-1.5 transition ${
                      l.highlight
                        ? "text-brand-400 font-bold hover:text-brand-300"
                        : "text-white/65 hover:text-white"
                    }`}
                  >
                    {l.highlight && <ArrowRight size={11} strokeWidth={2.6} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />}
                    {l.label}
                    {l.highlight && (
                      <span className="text-[0.62rem] font-extrabold px-1.5 py-0.5 rounded bg-brand-500/15 border border-brand-500/30 text-brand-300 uppercase tracking-wider">
                        Gratuit
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top métiers · 2 cols */}
          <FooterCol
            icon={Briefcase}
            iconColor="text-blue-400 bg-blue-500/10 border-blue-500/20"
            title="Top métiers"
            links={TOP_METIERS.slice(0, 6).map((m) => ({ href: `/metiers/${m.slug}`, label: m.name }))}
            seeAll={{ href: "/metiers", label: "Voir les 80+ métiers" }}
          />

          {/* Top villes · 2 cols */}
          <FooterCol
            icon={Building2}
            iconColor="text-violet-400 bg-violet-500/10 border-violet-500/20"
            title="Top villes"
            links={TOP_VILLES.slice(0, 6).map((v) => ({ href: `/artisans/plombier/${slugify(v)}`, label: v }))}
            seeAll={{ href: "/rechercher", label: "Toutes les villes" }}
          />
        </div>

      </div>

      {/* ═══════════ BOTTOM BAR ═══════════ */}
      <div className="relative border-t border-white/[0.08] bg-black/40 backdrop-blur-sm">
        <div className="container-default py-5 sm:py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Copyright + brand mini + legal (gauche) */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.78rem] text-white/55">
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-white/95 overflow-hidden">
                  <Image src="/logo.jpg" alt="" width={20} height={20} className="w-full h-full object-cover" />
                </span>
                © {new Date().getFullYear()} <strong className="text-white/85">Bisecco</strong>
                <span className="text-white/30">·</span>
                <span className="text-white/45">AGISCO HOLDING SAS</span>
              </span>
              <span className="text-white/20">·</span>
              <Link href="/mentions-legales"          className="hover:text-white transition">Mentions</Link>
              <Link href="/politique-confidentialite" className="hover:text-white transition">Confidentialité</Link>
              <Link href="/cgv"                       className="hover:text-white transition">CGV</Link>
              <Link href="/politique-remboursement"   className="hover:text-white transition">Remboursement</Link>
              <Link href="/plan-du-site"              className="hover:text-white transition">Plan du site</Link>
            </div>

            {/* Credit (droite) */}
            <div className="text-[0.74rem] text-white/40 leading-relaxed text-left lg:text-right">
              Fait avec <Heart size={10} strokeWidth={2.6} className="inline text-brand-400 mx-0.5 -mt-0.5" fill="currentColor" /> à <strong className="text-white/65">Cannes</strong> pour les artisans de France entière.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Sub-component : FooterCol ─── */
type FooterColProps = {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  iconColor: string;
  title: string;
  links: { href: string; label: string }[];
  seeAll?: { href: string; label: string };
};

function FooterCol({ icon: Icon, iconColor, title, links, seeAll }: FooterColProps) {
  return (
    <div className="lg:col-span-2">
      <h4 className="inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-brand-400 mb-4">
        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md border ${iconColor}`}>
          <Icon size={10} strokeWidth={2.6} />
        </span>
        {title}
      </h4>
      <ul className="space-y-2.5 text-[0.88rem]">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="group inline-flex items-center text-white/65 hover:text-white transition">
              <span className="w-0 h-px bg-brand-400 group-hover:w-2 mr-0 group-hover:mr-2 transition-all duration-200" aria-hidden />
              {l.label}
            </Link>
          </li>
        ))}
        {seeAll && (
          <li>
            <Link
              href={seeAll.href}
              className="group inline-flex items-center gap-1 text-brand-400 font-bold hover:text-brand-300 transition"
            >
              {seeAll.label}
              <ArrowRight size={11} strokeWidth={2.6} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
