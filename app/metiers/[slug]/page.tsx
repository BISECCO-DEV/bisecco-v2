import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, Star, MapPin, ArrowRight, Briefcase, Users, Clock, CheckCircle2 } from "lucide-react";
import { fetchMetierBySlug } from "@/lib/db/metiers";
import { fetchArtisansForMetier } from "@/lib/db/artisans";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { getMetierContent } from "@/lib/seo/metier-content";
import { schemaTypeForMetier } from "@/lib/seo/metier-schema-type";

type Props = { params: Promise<{ slug: string }> };

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Construit une description SEO riche (300+ caractères) à partir du métier.
 * Combine : nom + spécialité DB + bénéfices Bisecco + appel à l'action.
 */
function buildSeoDescription(metier: { name: string; description: string | null }): string {
  const nameLower = metier.name.toLowerCase();
  const specifics = metier.description?.trim() ?? "";

  const parts = [
    `Trouvez le meilleur ${nameLower} près de chez vous sur Bisecco, le réseau d'artisans français vérifiés.`,
    specifics
      ? `Nos ${nameLower}s couvrent : ${specifics.toLowerCase()}.`
      : `Tous les ${nameLower}s inscrits exercent en France avec un numéro SIREN contrôlé.`,
    `Chaque profil est vérifié auprès de l'INSEE en temps réel, avec avis clients authentiques et photos de réalisations.`,
    `Comparez les profils, demandez un devis gratuit en 2 minutes, échangez en direct sans intermédiaire ni commission. 100 % gratuit, sans engagement.`,
  ];

  return parts.join(" ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = await fetchMetierBySlug(slug);
  if (!m) return { title: "Métier introuvable · Bisecco" };

  const description = buildSeoDescription(m);
  const titleTag = `${m.name} · Artisan vérifié SIREN près de chez vous`;
  const nameLower = m.name.toLowerCase();

  return {
    title: titleTag,
    description,
    keywords: [
      nameLower,
      `${nameLower} près de chez moi`,
      `trouver un ${nameLower}`,
      `devis ${nameLower}`,
      `${nameLower} vérifié SIREN`,
      "artisan français",
      "devis gratuit",
      "sans commission",
    ].join(", "),
    alternates: { canonical: `/metiers/${slug}` },
    openGraph: {
      title: titleTag,
      description,
      url: `/metiers/${slug}`,
      siteName: "Bisecco",
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titleTag,
      description,
    },
  };
}

export default async function MetierPage({ params }: Props) {
  const { slug } = await params;
  const metier = await fetchMetierBySlug(slug);
  if (!metier) notFound();

  // Stats réelles depuis la base
  const artisans = await fetchArtisansForMetier(slug);
  const reviewedArtisans = artisans.filter((a) => a.avg_rating !== null);
  const totalReviews = reviewedArtisans.reduce((sum, a) => sum + a.review_count, 0);
  const avgRating =
    reviewedArtisans.length > 0
      ? reviewedArtisans.reduce((sum, a) => sum + (a.avg_rating ?? 0), 0) / reviewedArtisans.length
      : 0;
  // Villes uniques où des artisans sont présents
  const cities = Array.from(
    new Set(artisans.map((a) => a.city).filter((c): c is string => Boolean(c))),
  );

  // Villes affichées : villes réelles d'artisans inscrits + villes SEO par défaut
  const SEED_CITIES = ["Meaux", "Chelles", "Lagny-sur-Marne", "Melun", "Pontault-Combault", "Noisy-le-Grand", "Bussy-Saint-Georges", "Champs-sur-Marne", "Torcy", "Coulommiers", "Paris", "Versailles"];
  const allCities = Array.from(new Set([...cities, ...SEED_CITIES]));

  const breadcrumbs = breadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Métiers", url: "/metiers" },
    { name: metier.name, url: `/metiers/${slug}` },
  ]);

  // Contenu enrichi unique (top 10 métiers) ou null si générique
  const content = getMetierContent(slug);

  // Schema.org Service spécifique au métier (boost AI Overviews)
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://bisecco.fr/metiers/${slug}#service`,
    name: `${metier.name} vérifié SIREN`,
    serviceType: metier.name,
    description: content?.definition ?? `Trouvez un ${metier.name.toLowerCase()} qualifié et vérifié SIREN près de chez vous sur Bisecco.`,
    provider: { "@type": "Organization", "@id": "https://bisecco.fr/#organization" },
    areaServed: { "@type": "Country", name: "France" },
    url: `https://bisecco.fr/metiers/${slug}`,
    offers: {
      "@type": "Offer",
      description: "Mise en relation gratuite avec des artisans vérifiés SIREN",
      price: "0",
      priceCurrency: "EUR",
    },
    additionalType: `https://schema.org/${schemaTypeForMetier(slug)}`,
  };

  // Schema FAQPage si du contenu enrichi est dispo (FAQ générée depuis tips)
  const faqSchema = content
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `Qu'est-ce qu'un ${metier.name.toLowerCase()} ?`,
            acceptedAnswer: { "@type": "Answer", text: content.definition },
          },
          {
            "@type": "Question",
            name: `Combien coûte un ${metier.name.toLowerCase()} en France ?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: content.prices.map((p) => `${p.label} : ${p.range}`).join(". "),
            },
          },
          {
            "@type": "Question",
            name: `Comment choisir un bon ${metier.name.toLowerCase()} ?`,
            acceptedAnswer: { "@type": "Answer", text: content.tips.join(" ") },
          },
        ],
      }
    : null;

  return (
    <div className="bg-ink-50 min-h-screen pb-20">
      <JsonLd data={faqSchema ? [breadcrumbs, serviceSchema, faqSchema] : [breadcrumbs, serviceSchema]} />
      {/* Hero */}
      <section className="bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[300px] rounded-full bg-brand-500/15 blur-[120px] pointer-events-none" />
        <div className="container-default py-16 relative">
          <Link href="/metiers" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white font-semibold">
            ← Tous les métiers
          </Link>
          <div className="grid md:grid-cols-[1fr_auto] items-end gap-6 mt-6">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-[0.65rem] font-bold tracking-[0.14em] uppercase">
                {metier.icon} {metier.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mt-4 tracking-[-0.02em]">
                <span className="text-brand-500">{metier.name}</span> vérifié<br />
                <span className="text-white/55 font-medium text-3xl md:text-4xl">près de chez vous</span>
              </h1>
              <p className="mt-4 text-white/65 max-w-xl leading-relaxed">
                Tous les {metier.name.toLowerCase()}s référencés sur Bisecco ont leur SIREN contrôlé et leurs avis clients vérifiés.
              </p>
            </div>
            <Link href={`/devis?metier=${slug}`} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-500 text-white font-bold shadow-[0_8px_24px_rgba(240,122,47,0.4)] hover:bg-brand-600 transition">
              Demander un devis <ArrowRight size={16} />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
            {[
              { label: `${metier.name}s vérifiés`, value: String(artisans.length), icon: ShieldCheck },
              { label: "Note moyenne",            value: avgRating > 0 ? avgRating.toFixed(1) : "·", icon: Star },
              { label: "Avis publiés",            value: String(totalReviews), icon: Users },
              { label: "Devis sous",              value: "24h", icon: Clock },
            ].map((s) => (
              <div key={s.label}>
                <s.icon size={16} className="text-brand-400 mb-2" />
                <div className="text-2xl font-bold tracking-tight">{s.value}</div>
                <div className="text-xs text-white/55 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container-default py-12">
        {/* Pourquoi un X via Bisecco */}
        <section className="grid md:grid-cols-3 gap-4 mb-12">
          {[
            { icon: ShieldCheck, title: "SIREN vérifié",   text: `Chaque ${metier.name.toLowerCase()} est contrôlé via l'API officielle gouv.fr.`, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" },
            { icon: Star,        title: "Avis authentiques", text: "Seuls les clients réels peuvent laisser un avis après mission.",            color: "text-amber-500",   bg: "bg-amber-50",   border: "border-amber-200" },
            { icon: CheckCircle2, title: "Devis gratuit",   text: "Recevez plusieurs propositions en 24h, sans engagement.",                  color: "text-brand-500",   bg: "bg-brand-50",   border: "border-brand-200" },
          ].map((c) => (
            <div key={c.title} className={`p-6 rounded-2xl bg-white border ${c.border}`}>
              <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.color} flex items-center justify-center mb-3`}>
                <c.icon size={20} />
              </div>
              <h3 className="font-bold text-ink-700">{c.title}</h3>
              <p className="text-sm text-ink-500 mt-1 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </section>

        {/* ─── CONTENU UNIQUE PAR MÉTIER (top 10 SEO) ─── */}
        {content && (
          <section className="bg-white rounded-3xl border border-ink-100 p-8 md:p-10 mb-12 shadow-[0_1px_4px_-2px_rgba(13,30,74,0.06)]">
            {/* Définition */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-ink-700 tracking-tight mb-3">
              Qu&apos;est-ce qu&apos;un {metier.name.toLowerCase()} ?
            </h2>
            <p className="text-[1rem] text-ink-600 leading-relaxed">{content.definition}</p>

            {/* Services */}
            <h3 className="mt-8 text-xl font-extrabold text-ink-700">Principales prestations</h3>
            <ul className="mt-3 grid sm:grid-cols-2 gap-2">
              {content.services.map((s) => (
                <li key={s} className="flex items-start gap-2 text-[0.92rem] text-ink-600 leading-snug">
                  <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>

            {/* Prix moyens */}
            <h3 className="mt-8 text-xl font-extrabold text-ink-700">Prix moyens indicatifs en France</h3>
            <div className="mt-3 overflow-hidden rounded-2xl border border-ink-100">
              <table className="w-full text-[0.92rem]">
                <thead className="bg-ink-50 text-ink-600 text-[0.78rem] uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-bold">Prestation</th>
                    <th className="text-right px-4 py-2.5 font-bold">Fourchette</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {content.prices.map((p) => (
                    <tr key={p.label}>
                      <td className="px-4 py-2.5 text-ink-700">{p.label}</td>
                      <td className="px-4 py-2.5 text-right font-bold text-brand-700 tabular-nums">{p.range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[0.72rem] text-ink-400">
              Ces fourchettes sont indicatives et varient selon la région, la complexité du chantier et les options.
              Demandez plusieurs devis gratuits sur Bisecco pour un prix juste.
            </p>

            {/* Conseils */}
            <h3 className="mt-8 text-xl font-extrabold text-ink-700">Comment bien choisir votre {metier.name.toLowerCase()}</h3>
            <ul className="mt-3 space-y-2.5">
              {content.tips.map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-[0.92rem] text-ink-600 leading-relaxed">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 text-brand-700 inline-flex items-center justify-center font-extrabold text-xs">
                    {i + 1}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            {/* Long content */}
            <h3 className="mt-8 text-xl font-extrabold text-ink-700">Pourquoi passer par un {metier.name.toLowerCase()} vérifié SIREN ?</h3>
            <p className="mt-3 text-[0.95rem] text-ink-600 leading-relaxed">{content.longContent}</p>
          </section>
        )}

        {/* Liste villes · SEO levier */}
        <section>
          <h2 className="text-2xl font-bold text-ink-700 mb-2 tracking-tight">
            {metier.name} par ville
          </h2>
          <p className="text-ink-400 mb-6">Trouvez un {metier.name.toLowerCase()} dans votre commune.</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {allCities.map((city: string) => (
              <Link
                key={city}
                href={`/artisans/${slug}/${slugify(city)}`}
                className="group flex items-center gap-3 p-4 rounded-xl bg-white border border-ink-100 hover:border-brand-300 hover:-translate-y-0.5 transition"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition">
                  <MapPin size={15} className="text-brand-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-ink-700 text-sm truncate">{metier.name} {city}</div>
                  <div className="text-[0.72rem] text-ink-400">Voir les artisans →</div>
                </div>
                <ArrowRight size={14} className="text-ink-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition" />
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 bg-gradient-to-br from-brand-50 to-amber-50/30 rounded-3xl p-10 text-center border border-brand-200/60">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-card mb-4">
            <Briefcase size={24} className="text-brand-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-ink-700 tracking-tight">
            Vous êtes <span className="text-brand-500">{metier.name.toLowerCase()}</span> ?
          </h2>
          <p className="text-ink-500 mt-2 max-w-md mx-auto">
            Inscrivez-vous gratuitement et recevez des demandes qualifiées dès cette semaine.
          </p>
          <Link href="/inscription" className="btn-primary mt-6 inline-flex">
            Créer mon profil gratuit <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}
