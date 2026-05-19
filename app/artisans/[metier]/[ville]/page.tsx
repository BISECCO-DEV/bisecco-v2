import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, Star, MapPin, ArrowRight, MessageCircle, Search } from "lucide-react";
import { fetchMetierBySlug } from "@/lib/db/metiers";
import { fetchArtisansForMetierAndCity } from "@/lib/db/artisans";
import { JsonLd } from "@/components/ui/JsonLd";

type Props = { params: Promise<{ metier: string; ville: string }> };

function unslug(s: string) {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("-");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { metier, ville } = await params;
  const m = await fetchMetierBySlug(metier);
  if (!m) return { title: "Page introuvable" };
  const villeLabel = unslug(ville);
  return {
    title: `${m.name} à ${villeLabel} · Devis gratuit, profils vérifiés`,
    description: `Trouvez un ${m.name.toLowerCase()} à ${villeLabel} parmi notre sélection d'artisans vérifiés. SIREN contrôlé, avis clients, devis gratuit en 2 minutes.`,
    alternates: { canonical: `/artisans/${metier}/${ville}` },
    openGraph: {
      title: `${m.name} à ${villeLabel} | Bisecco`,
      description: `Artisans ${m.name.toLowerCase()} vérifiés à ${villeLabel}.`,
    },
  };
}

export default async function SeoLocalePage({ params }: Props) {
  const { metier, ville } = await params;
  const m = await fetchMetierBySlug(metier);
  if (!m) notFound();

  const villeLabel = unslug(ville);
  const artisans = await fetchArtisansForMetierAndCity(metier, ville);

  // Schema.org JSON-LD pour SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${m.name} à ${villeLabel}`,
    description: `Liste des artisans ${m.name.toLowerCase()} vérifiés à ${villeLabel}`,
    numberOfItems: artisans.length,
    itemListElement: artisans.map((a, i) => ({
      "@type": "LocalBusiness",
      position: i + 1,
      name: a.company_name ?? a.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: villeLabel,
        addressCountry: "FR",
      },
      aggregateRating: a.avg_rating
        ? {
            "@type": "AggregateRating",
            ratingValue: a.avg_rating.toFixed(1),
            reviewCount: a.review_count,
          }
        : undefined,
      url: a.client_number ? `https://bisecco.fr/profil/${a.client_number}` : undefined,
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="bg-ink-50 min-h-screen pb-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[300px] rounded-full bg-brand-500/15 blur-[120px]" />
          <div className="container-default py-14 relative">
            <nav className="flex items-center gap-1.5 text-xs text-white/55 mb-5">
              <Link href="/" className="hover:text-white">Accueil</Link>
              <span>/</span>
              <Link href="/metiers" className="hover:text-white">Métiers</Link>
              <span>/</span>
              <Link href={`/metiers/${metier}`} className="hover:text-white">{m.name}</Link>
              <span>/</span>
              <span className="text-white font-semibold">{villeLabel}</span>
            </nav>

            <h1 className="text-3xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.1]">
              <span className="text-brand-500">{m.name}</span> à {villeLabel}
              <br />
              <span className="text-white/55 font-medium text-2xl md:text-3xl">
                {artisans.length > 0
                  ? `${artisans.length} artisan${artisans.length > 1 ? "s" : ""} vérifié${artisans.length > 1 ? "s" : ""}`
                  : "Aucun artisan pour l'instant"}
              </span>
            </h1>
            <p className="mt-4 text-white/65 max-w-2xl leading-relaxed">
              {m.description ??
                `Trouvez un ${m.name.toLowerCase()} à ${villeLabel} parmi notre sélection d'artisans avec SIREN vérifié, avis clients réels et devis gratuit sous 24h.`}
            </p>
          </div>
        </section>

        <div className="container-default max-w-6xl py-10">
          {artisans.length === 0 ? (
            <section className="bg-white rounded-3xl border border-ink-100 p-10 text-center">
              <Search size={36} className="mx-auto text-ink-300 mb-3" strokeWidth={1.6} />
              <h2 className="font-extrabold text-ink-700 text-xl">
                Aucun {m.name.toLowerCase()} référencé à {villeLabel} pour l&apos;instant
              </h2>
              <p className="mt-2 text-ink-500 max-w-md mx-auto text-sm leading-relaxed">
                Bisecco est en pleine croissance. Vous êtes {m.name.toLowerCase()} dans la région ?
                Inscrivez-vous gratuitement et soyez le premier référencé sur cette ville.
              </p>
              <div className="mt-6 flex justify-center gap-3 flex-wrap">
                <Link
                  href={`/devis?metier=${metier}&ville=${ville}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition shadow-[0_4px_14px_rgba(240,122,47,0.35)]"
                >
                  Demander un devis quand même <ArrowRight size={15} />
                </Link>
                <Link
                  href="/inscription"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border-2 border-ink-100 text-ink-700 font-bold hover:border-brand-300 transition"
                >
                  Je suis artisan, m&apos;inscrire
                </Link>
              </div>
            </section>
          ) : (
            <section className="space-y-3">
              {artisans.map((a, i) => (
                <article
                  key={a.id}
                  className="bg-white rounded-2xl p-5 border border-ink-100 hover:border-brand-200 hover:-translate-y-0.5 transition group"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl font-bold text-ink-200 w-10 text-center pt-3">
                      #{i + 1}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a.profile_photo ?? `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(a.name)}`}
                      alt=""
                      className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 bg-ink-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-ink-700 truncate">
                          {a.company_name ?? a.name}
                        </h3>
                        {a.siren && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.65rem] font-bold">
                            <ShieldCheck size={9} /> SIREN vérifié
                          </span>
                        )}
                      </div>
                      {a.company_name && (
                        <div className="text-sm text-ink-500 mt-0.5 truncate">{a.name}</div>
                      )}
                      <div className="flex items-center gap-3 text-xs text-ink-400 mt-2 flex-wrap">
                        {a.avg_rating !== null ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-brand-500">
                            <Star size={12} fill="#f07a2f" className="text-brand-500" />
                            {a.avg_rating.toFixed(1)}
                            <span className="text-ink-400">({a.review_count})</span>
                          </span>
                        ) : (
                          <span className="text-ink-400 italic">Nouveau profil</span>
                        )}
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={11} />
                          {a.city ?? villeLabel}
                        </span>
                        {a.availability && (
                          <>
                            <span>·</span>
                            <span>{a.availability}</span>
                          </>
                        )}
                      </div>
                      {a.description && (
                        <p className="mt-2 text-xs text-ink-500 line-clamp-2 max-w-2xl">
                          {a.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                      {a.client_number && (
                        <Link
                          href={`/profil/${a.client_number}`}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-bold hover:bg-brand-600 transition"
                        >
                          Voir le profil
                        </Link>
                      )}
                      <Link
                        href={`/devis?artisan=${a.client_number ?? a.id}`}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-ink-200 text-ink-700 text-sm font-bold hover:border-brand-500 transition"
                      >
                        <MessageCircle size={13} /> Contacter
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}

          {/* Contenu SEO bas */}
          <section className="mt-12 prose prose-ink max-w-3xl">
            <h2 className="text-2xl font-bold text-ink-700 tracking-tight">
              Pourquoi choisir un {m.name.toLowerCase()} à {villeLabel} via Bisecco ?
            </h2>
            <p className="text-ink-500 mt-3 leading-relaxed">
              Trouver un {m.name.toLowerCase()} de confiance à {villeLabel} peut être un défi.
              Avec Bisecco, vous accédez à une sélection d&apos;artisans dont l&apos;identité a été
              vérifiée via leur numéro SIREN officiel. Aucun faux profil, aucune publicité
              trompeuse.
            </p>
            <p className="text-ink-500 mt-3 leading-relaxed">
              Chaque {m.name.toLowerCase()} référencé à {villeLabel} est noté par ses vrais
              clients après chaque mission terminée. Les avis sont 100% authentiques · il est
              impossible d&apos;acheter une note ou de poster un faux commentaire.
            </p>

            <h3 className="text-xl font-bold text-ink-700 mt-6 tracking-tight">Comment ça marche ?</h3>
            <ol className="text-ink-500 mt-3 space-y-2 list-decimal pl-5">
              <li>Décrivez votre projet en 2 minutes via notre formulaire de devis.</li>
              <li>Plusieurs {m.name.toLowerCase()}s à {villeLabel} étudient votre demande.</li>
              <li>Vous recevez 2 à 5 devis gratuits sous 24h.</li>
              <li>Vous comparez, vous discutez en direct avec les artisans.</li>
              <li>Vous choisissez librement. Aucune commission prélevée.</li>
            </ol>
          </section>

          <section className="mt-12 bg-gradient-to-br from-brand-50 to-amber-50/30 rounded-3xl p-10 text-center border border-brand-200/60">
            <h2 className="text-2xl md:text-3xl font-bold text-ink-700 tracking-tight">
              Besoin d&apos;un {m.name.toLowerCase()} à {villeLabel} ?
            </h2>
            <p className="text-ink-500 mt-2">Recevez plusieurs devis gratuits en 24h.</p>
            <Link
              href={`/devis?metier=${metier}&ville=${ville}`}
              className="btn-primary mt-6 inline-flex"
            >
              Demander un devis gratuit <ArrowRight size={16} />
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
