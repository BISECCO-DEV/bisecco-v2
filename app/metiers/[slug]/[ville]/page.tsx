import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin, Star, ShieldCheck, ArrowRight, Briefcase, Users, Clock, CheckCircle2,
  Phone, Euro,
} from "lucide-react";
import { fetchMetierBySlug } from "@/lib/db/metiers";
import { fetchArtisansForMetier } from "@/lib/db/artisans";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { schemaTypeForMetier } from "@/lib/seo/metier-schema-type";
import {
  getMetierPrioritaire,
  getAllMetierPrioritaireSlugs,
  type MetierPrioritaire,
} from "@/lib/seo/metiers-prioritaires";
import {
  getVillePrioritaire,
  getAllVilleSlugs,
  VILLES_PRIORITAIRES,
  type VillePrioritaire,
} from "@/lib/seo/villes-prioritaires";

type Props = { params: Promise<{ slug: string; ville: string }> };

/**
 * Génère statiquement les 300 pages prioritaires au build (10 métiers × 30 villes).
 * Les autres combinaisons restent dynamiques (404 si métier ou ville inconnus).
 */
export async function generateStaticParams() {
  const metiers = getAllMetierPrioritaireSlugs();
  const villes = getAllVilleSlugs();
  const params: { slug: string; ville: string }[] = [];
  for (const slug of metiers) {
    for (const ville of villes) {
      params.push({ slug, ville });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, ville } = await params;
  const metierP = getMetierPrioritaire(slug);
  const villeP = getVillePrioritaire(ville);

  if (!metierP || !villeP) {
    return { title: "Page introuvable", robots: { index: false, follow: false } };
  }

  const metierLower = metierP.name.toLowerCase();
  const title = `${metierP.name} à ${villeP.name} (${villeP.postalCode}) · Professionnel vérifié SIREN`;
  const description =
    `Trouvez un ${metierLower} qualifié à ${villeP.name}. Tarifs ${metierP.tarifMin}-${metierP.tarifMax}€/h. ` +
    `Professionnels vérifiés SIREN, avis clients authentiques, devis gratuit en 2 min. ` +
    `Sans intermédiaire, 0% commission. Réseau Bisecco.`;

  return {
    title,
    description,
    keywords: [
      `${metierLower} ${villeP.name.toLowerCase()}`,
      `${metierLower} ${villeP.postalCode}`,
      `${metierLower} ${villeP.name.toLowerCase()} pas cher`,
      `devis ${metierLower} ${villeP.name.toLowerCase()}`,
      `${metierLower} vérifié SIREN`,
      `trouver un ${metierLower} ${villeP.name.toLowerCase()}`,
      metierP.urgence ? `${metierLower} urgence ${villeP.name.toLowerCase()}` : "",
      `${metierLower} pas cher`,
      `professionnel ${villeP.name.toLowerCase()}`,
      `annuaire ${metierLower}`,
    ]
      .filter(Boolean)
      .join(", "),
    alternates: { canonical: `/metiers/${slug}/${ville}` },
    openGraph: {
      title,
      description,
      url: `/metiers/${slug}/${ville}`,
      siteName: "Bisecco",
      locale: "fr_FR",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function MetierVillePage({ params }: Props) {
  const { slug, ville } = await params;
  const metierP = getMetierPrioritaire(slug);
  const villeP = getVillePrioritaire(ville);

  if (!metierP || !villeP) notFound();

  const metierDb = await fetchMetierBySlug(slug);
  if (!metierDb) notFound();

  // Récupère les artisans de ce métier (toutes villes pour le moment, on filtre côté JS)
  const allArtisans = await fetchArtisansForMetier(slug);
  const villeLower = villeP.name.toLowerCase();
  const artisansInVille = allArtisans.filter((a) => {
    const c = a.city?.toLowerCase() ?? "";
    return c.includes(villeLower) || villeLower.includes(c);
  });
  const otherArtisans = allArtisans.filter((a) => !artisansInVille.includes(a));

  const metierLower = metierP.name.toLowerCase();
  const profileUrl = `https://bisecco.fr/metiers/${slug}/${ville}`;

  // ─── Schemas ───────────────────────────────────────────────────────
  const breadcrumbs = breadcrumbSchema([
    { name: "Accueil", url: "https://bisecco.fr" },
    { name: "Métiers", url: "https://bisecco.fr/metiers" },
    { name: metierP.name, url: `https://bisecco.fr/metiers/${slug}` },
    { name: villeP.name, url: profileUrl },
  ]);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": profileUrl,
    serviceType: metierP.name,
    name: `${metierP.name} à ${villeP.name}`,
    description:
      `Service de ${metierLower} à ${villeP.name} (${villeP.postalCode}). ` +
      `Professionnels vérifiés SIREN sur Bisecco.`,
    areaServed: {
      "@type": "City",
      name: villeP.name,
      addressCountry: "FR",
      address: {
        "@type": "PostalAddress",
        addressLocality: villeP.name,
        postalCode: villeP.postalCode,
        addressCountry: "FR",
      },
    },
    provider: {
      "@type": "Organization",
      name: "Bisecco",
      url: "https://bisecco.fr",
      logo: "https://bisecco.fr/logo.png",
    },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: metierP.tarifMin,
      highPrice: metierP.tarifMax,
      priceCurrency: "EUR",
      offerCount: artisansInVille.length,
      availability: "https://schema.org/InStock",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: metierP.faq.map((qa) => ({
      "@type": "Question",
      name: qa.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: qa.answer,
      },
    })),
  };

  // ─── Villes proches du même département (maillage interne SEO) ─────
  const nearbyVilles = villeP.nearbyVilles
    .map((s) => VILLES_PRIORITAIRES.find((v) => v.slug === s))
    .filter((v): v is VillePrioritaire => v !== undefined);

  // ─── Autres métiers prioritaires (maillage horizontal) ─────────────
  const otherMetiers = [
    "plombier",
    "electricien",
    "macon",
    "peintre-en-batiment",
    "menuisier",
    "couvreur",
    "carreleur",
    "serrurier",
    "chauffagiste",
    "jardinier-artisanal",
  ]
    .filter((m) => m !== slug)
    .slice(0, 6)
    .map((s) => getMetierPrioritaire(s))
    .filter((m): m is MetierPrioritaire => m !== null);

  return (
    <div className="bg-ink-50 min-h-screen pb-20">
      <JsonLd data={[breadcrumbs, serviceSchema, faqSchema]} />

      {/* ═════════ HERO ═════════ */}
      <section className="relative bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 text-white overflow-hidden">
        {metierDb.cover_url && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={metierDb.cover_url}
              alt={metierDb.cover_alt ?? metierP.name}
              className="absolute inset-0 w-full h-full object-cover opacity-25"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-ink-900/85 via-ink-800/80 to-ink-900/90" />
          </>
        )}
        <div className="absolute top-0 right-0 w-[500px] h-[300px] rounded-full bg-brand-500/15 blur-[120px] pointer-events-none" />

        <div className="container-default py-14 relative">
          <nav className="flex items-center gap-2 text-xs text-white/55 mb-4">
            <Link href="/metiers" className="hover:text-white">Métiers</Link>
            <span>/</span>
            <Link href={`/metiers/${slug}`} className="hover:text-white">{metierP.name}</Link>
            <span>/</span>
            <span className="text-white">{villeP.name}</span>
          </nav>

          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-[0.65rem] font-bold tracking-[0.14em] uppercase">
            <MapPin size={11} /> {villeP.name} · {villeP.postalCode}
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mt-4 tracking-[-0.02em]">
            <span className="text-brand-500">{metierP.name}</span> à {villeP.name}
            <br />
            <span className="text-white/55 font-medium text-3xl md:text-4xl">
              Professionnel vérifié SIREN, devis gratuit
            </span>
          </h1>

          <p className="mt-4 text-white/65 max-w-2xl leading-relaxed">
            {metierP.pitch} À {villeP.name}, {villeP.localContext.geographie} —{" "}
            {villeP.localContext.specificites.toLowerCase()}.
          </p>

          {/* Stats hero */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
            <div>
              <ShieldCheck size={16} className="text-brand-400 mb-2" />
              <div className="text-2xl font-bold">{artisansInVille.length}</div>
              <div className="text-xs text-white/55 mt-0.5">{metierP.name}s à {villeP.name}</div>
            </div>
            <div>
              <Euro size={16} className="text-brand-400 mb-2" />
              <div className="text-2xl font-bold">{metierP.tarifMin}-{metierP.tarifMax}€</div>
              <div className="text-xs text-white/55 mt-0.5">Tarif horaire moyen</div>
            </div>
            <div>
              <Clock size={16} className="text-brand-400 mb-2" />
              <div className="text-2xl font-bold">{metierP.urgence ? "24/7" : "Sous 24h"}</div>
              <div className="text-xs text-white/55 mt-0.5">
                {metierP.urgence ? "Urgences" : "Devis"}
              </div>
            </div>
            <div>
              <Users size={16} className="text-brand-400 mb-2" />
              <div className="text-2xl font-bold">100%</div>
              <div className="text-xs text-white/55 mt-0.5">Vérifiés SIREN</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href={`/devis?metier=${slug}&ville=${ville}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 text-white font-bold shadow-[0_8px_24px_rgba(240,122,47,0.4)] hover:bg-brand-600 transition"
            >
              Demander un devis gratuit <ArrowRight size={16} />
            </Link>
            <Link
              href={`/rechercher?metier=${slug}&ville=${villeLower}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/15 transition"
            >
              Voir tous les {metierP.name.toLowerCase()}s
            </Link>
          </div>
        </div>
      </section>

      {/* ═════════ CONTENU PRINCIPAL ═════════ */}
      <div className="container-default py-12 space-y-12">

        {/* ── Spécialités du métier ── */}
        <section>
          <h2 className="text-2xl font-bold text-ink-700 mb-5">
            Les {metierP.name.toLowerCase()}s de {villeP.name} interviennent pour
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {metierP.specificites.map((spec) => (
              <div
                key={spec}
                className="flex items-start gap-3 bg-white border border-ink-100 rounded-xl p-4"
              >
                <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-ink-700 font-medium">{spec}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Artisans de cette ville ── */}
        <section>
          <h2 className="text-2xl font-bold text-ink-700 mb-5">
            {metierP.name}s vérifiés à {villeP.name}
          </h2>
          {artisansInVille.length === 0 ? (
            <div className="bg-white rounded-2xl border border-ink-100 p-10 text-center">
              <Briefcase size={36} className="text-ink-300 mx-auto mb-3" />
              <h3 className="font-extrabold text-ink-700 text-lg">
                Aucun {metierP.name.toLowerCase()} référencé à {villeP.name} pour l&apos;instant
              </h3>
              <p className="text-ink-500 text-sm mt-2 max-w-lg mx-auto">
                Vous êtes {metierP.name.toLowerCase()} à {villeP.name} ? Inscrivez-vous gratuitement
                et soyez le premier visible dans cette ville.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-5">
                <Link
                  href="/inscription"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition"
                >
                  Inscrire mon entreprise <ArrowRight size={14} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink-100 text-ink-700 font-bold text-sm hover:bg-ink-200 transition"
                >
                  <Phone size={14} /> Nous contacter
                </Link>
              </div>
              {otherArtisans.length > 0 && (
                <p className="text-xs text-ink-400 mt-5">
                  Mais nous avons {otherArtisans.length} {metierP.name.toLowerCase()}
                  {otherArtisans.length > 1 ? "s" : ""} ailleurs en France —{" "}
                  <Link href={`/metiers/${slug}`} className="text-brand-500 font-bold underline">
                    voir la liste complète
                  </Link>
                </p>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {artisansInVille.slice(0, 9).map((a) => (
                <Link
                  key={a.id}
                  href={`/profil/${a.client_number ?? a.id}`}
                  className="bg-white border border-ink-100 rounded-2xl p-4 hover:border-brand-300 hover:-translate-y-0.5 transition shadow-card"
                >
                  <div className="flex items-start gap-3">
                    {a.profile_photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.profile_photo.startsWith("http") ? a.profile_photo : `https://bisecco.fr/storage/${a.profile_photo}`}
                        alt={a.name}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white font-bold flex items-center justify-center text-lg flex-shrink-0">
                        {a.name[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-ink-700 text-sm truncate">
                        {a.company_name || a.name}
                      </div>
                      <div className="text-[0.7rem] text-ink-400 mt-0.5 inline-flex items-center gap-1">
                        <MapPin size={9} /> {a.city ?? villeP.name}
                      </div>
                      {(a.review_count ?? 0) > 0 ? (
                        <div className="flex items-center gap-1 mt-1.5 text-xs">
                          <Star size={11} fill="#f07a2f" className="text-brand-500" />
                          <span className="font-bold text-ink-700">{a.avg_rating?.toFixed(1)}</span>
                          <span className="text-ink-400">({a.review_count})</span>
                        </div>
                      ) : (
                        <div className="text-[0.7rem] text-ink-400 mt-1.5">Nouveau profil</div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── Tarifs locaux ── */}
        <section className="bg-white rounded-3xl border border-ink-100 p-8">
          <h2 className="text-2xl font-bold text-ink-700 mb-3">
            Tarifs d&apos;un {metierLower} à {villeP.name}
          </h2>
          <p className="text-ink-600 text-sm leading-relaxed mb-6">
            À {villeP.name}, un {metierLower} facture en moyenne entre{" "}
            <strong>{metierP.tarifMin}€ et {metierP.tarifMax}€ de l&apos;heure</strong>. Les prix
            varient selon le type d&apos;intervention, l&apos;urgence et le standing du quartier.
            Sur Bisecco, vous comparez les devis en 2 minutes, sans intermédiaire ni commission.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-ink-50 rounded-xl p-4">
              <Euro size={16} className="text-brand-500 mb-2" />
              <div className="text-lg font-bold text-ink-700">{metierP.tarifMin}€/h</div>
              <div className="text-xs text-ink-500 mt-1">Tarif standard</div>
            </div>
            <div className="bg-ink-50 rounded-xl p-4">
              <Euro size={16} className="text-brand-500 mb-2" />
              <div className="text-lg font-bold text-ink-700">
                {Math.round((metierP.tarifMin + metierP.tarifMax) / 2)}€/h
              </div>
              <div className="text-xs text-ink-500 mt-1">Tarif moyen</div>
            </div>
            <div className="bg-ink-50 rounded-xl p-4">
              <Euro size={16} className="text-brand-500 mb-2" />
              <div className="text-lg font-bold text-ink-700">{metierP.tarifMax}€/h</div>
              <div className="text-xs text-ink-500 mt-1">Tarif premium / urgence</div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section>
          <h2 className="text-2xl font-bold text-ink-700 mb-5">
            Questions fréquentes sur un {metierLower} à {villeP.name}
          </h2>
          <div className="space-y-3">
            {metierP.faq.map((qa) => (
              <details
                key={qa.question}
                className="bg-white border border-ink-100 rounded-2xl p-5 group"
              >
                <summary className="cursor-pointer font-bold text-ink-700 list-none flex items-center justify-between gap-3">
                  <span>{qa.question}</span>
                  <span className="text-brand-500 text-xl group-open:rotate-45 transition">+</span>
                </summary>
                <p className="text-sm text-ink-600 mt-3 leading-relaxed">{qa.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Maillage : villes proches ── */}
        {nearbyVilles.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-ink-700 mb-3">
              {metierP.name} dans les villes voisines de {villeP.name}
            </h2>
            <p className="text-sm text-ink-500 mb-5">
              Vous cherchez aussi un {metierLower} ailleurs en {villeP.department === "06" ? "Alpes-Maritimes" : villeP.department === "83" ? "Var" : "Provence"} ? Voici les villes les plus proches :
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {nearbyVilles.map((v) => (
                <Link
                  key={v.slug}
                  href={`/metiers/${slug}/${v.slug}`}
                  className="bg-white border border-ink-100 rounded-xl p-3 hover:border-brand-300 hover:-translate-y-0.5 transition text-center"
                >
                  <div className="font-bold text-ink-700 text-sm">{v.name}</div>
                  <div className="text-[0.66rem] text-ink-400 mt-0.5">{v.postalCode}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Maillage : autres métiers à cette ville ── */}
        <section>
          <h2 className="text-2xl font-bold text-ink-700 mb-3">
            Autres professionnels à {villeP.name}
          </h2>
          <p className="text-sm text-ink-500 mb-5">
            Besoin d&apos;un autre métier à {villeP.name} ? Voici les plus demandés :
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {otherMetiers.map((m) => (
              <Link
                key={m.slug}
                href={`/metiers/${m.slug}/${ville}`}
                className="bg-white border border-ink-100 rounded-xl p-3 hover:border-brand-300 hover:-translate-y-0.5 transition text-center"
              >
                <div className="font-bold text-ink-700 text-sm">{m.name}</div>
                <div className="text-[0.66rem] text-ink-400 mt-0.5">à {villeP.name}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── CTA final ── */}
        <section className="bg-gradient-to-br from-brand-50 to-amber-50/30 rounded-3xl p-10 text-center border border-brand-200/60">
          <h2 className="text-2xl font-bold text-ink-700">
            Besoin d&apos;un {metierLower} à {villeP.name} maintenant ?
          </h2>
          <p className="text-ink-600 mt-3 max-w-xl mx-auto">
            Demandez un devis gratuit en 2 minutes. Sans engagement, sans intermédiaire, sans
            commission. Vos données restent privées, jamais revendues.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link
              href={`/devis?metier=${slug}&ville=${ville}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 text-white font-bold shadow-[0_8px_24px_rgba(240,122,47,0.4)] hover:bg-brand-600 transition"
            >
              Demander un devis gratuit <ArrowRight size={16} />
            </Link>
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-ink-200 text-ink-700 font-bold hover:bg-ink-50 transition"
            >
              <Briefcase size={16} /> Je suis {metierLower}, m&apos;inscrire
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
