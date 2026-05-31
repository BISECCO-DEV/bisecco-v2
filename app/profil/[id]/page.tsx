import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin, Star, ShieldCheck, MessageCircle,
  CheckCircle2, Award, Briefcase, Clock, ArrowLeft, Heart,
  ThumbsUp, Camera,
} from "lucide-react";
import { fetchArtisanProfileDetail } from "@/lib/db/artisans";
import { getCurrentUser } from "@/lib/db/current-user";
import { SubmitCvButton } from "@/components/features/SubmitCvButton";
import { FavoriteButton } from "@/components/features/FavoriteButton";
import { ReviewForm } from "@/components/features/ReviewForm";
import { ReportProfileForm } from "@/components/features/ReportProfileForm";
import { hasFavorited } from "@/lib/favorites/actions";
import { getCurrentDbUser } from "@/lib/auth/current-user";
import { ContactButton } from "@/components/features/ContactButton";
import { ShareButton } from "@/components/features/ShareButton";
import { extractClientNumber } from "@/lib/utils";
import { CtaButton } from "@/components/ui/CtaButton";
import { JsonLd } from "@/components/ui/JsonLd";
import { LiveViewersCounter } from "@/components/features/LiveViewersCounter";
import { breadcrumbSchema } from "@/lib/seo/schemas";

type Props = { params: Promise<{ id: string }> };

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 1) return "Aujourd'hui";
  if (days < 7) return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
  if (days < 30) return `Il y a ${Math.floor(days / 7)} semaine${Math.floor(days / 7) > 1 ? "s" : ""}`;
  if (days < 365) return `Il y a ${Math.floor(days / 30)} mois`;
  return `Il y a ${Math.floor(days / 365)} an${Math.floor(days / 365) > 1 ? "s" : ""}`;
}

function computeRatingDistribution(reviews: { rating: number }[]): { stars: number; pct: number }[] {
  if (reviews.length === 0) return [5, 4, 3, 2, 1].map((s) => ({ stars: s, pct: 0 }));
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of reviews) counts[r.rating] = (counts[r.rating] ?? 0) + 1;
  return [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    pct: Math.round((counts[s]! / reviews.length) * 100),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const clientNumber = extractClientNumber(id) ?? id;
  const detail = await fetchArtisanProfileDetail(clientNumber);
  if (!detail) return { title: "Profil introuvable" };
  const a = detail.artisan;
  const metierLabel = a.metiers[0]?.name ?? "Artisan";
  return {
    title: `${a.company_name ?? a.name} · ${metierLabel} à ${a.city ?? "France"}`,
    description: a.description ?? `${metierLabel} vérifié sur Bisecco. Devis gratuit, contact direct.`,
    openGraph: {
      title: `${a.company_name ?? a.name} | Bisecco`,
      description: a.description ?? `${metierLabel} vérifié.`,
      images: a.cover_photo ? [a.cover_photo] : [],
    },
  };
}

export default async function ProfilPage({ params }: Props) {
  const { id } = await params;
  const clientNumber = extractClientNumber(id) ?? id;
  const artisanIdNum = parseInt(id, 10);
  const [detail, currentUser, dbUser, alreadyFavorited] = await Promise.all([
    fetchArtisanProfileDetail(clientNumber),
    getCurrentUser(),
    getCurrentDbUser(),
    isNaN(artisanIdNum) ? Promise.resolve(false) : hasFavorited(artisanIdNum),
  ]);
  if (!detail) notFound();
  const canFavorite = !!dbUser && dbUser.role !== "artisan" && !isNaN(artisanIdNum);
  const canReview = !!dbUser && dbUser.role !== "artisan" && dbUser.id !== artisanIdNum;

  const { artisan: a, services, gallery, reviews } = detail;
  const metierLabel = a.metiers[0]?.name ?? "Artisan";

  // Extraction intelligente : si company_name est rempli, on l'utilise.
  // Sinon, si le name legacy contient " - " (ex: "Pedro DUPONT - Dupont Maçonnerie"),
  // on en déduit société + gérant. Sinon, name = gérant et pas de société séparée.
  const hasLegacyDash = !a.company_name && a.name.includes(" - ");
  const extractedCompany = hasLegacyDash ? a.name.split(" - ").slice(1).join(" - ").trim() : null;
  const extractedGerant = hasLegacyDash ? a.name.split(" - ")[0]?.trim() ?? a.name : a.name;

  const companyName = a.company_name?.trim() || extractedCompany || a.name;
  const gerantName = a.company_name?.trim() ? a.name : extractedGerant;
  const hasSeparateCompany = !!(a.company_name?.trim() || extractedCompany);

  const cityLabel = a.city ?? "France";

  const coverUrl =
    a.cover_photo ??
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&h=400&fit=crop&q=80";
  const avatarUrl =
    a.profile_photo ?? `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(a.name)}`;

  const rating = a.avg_rating ?? 0;
  const reviewCount = a.review_count;
  const ratingDistribution = computeRatingDistribution(reviews);

  // ─── Schema.org LocalBusiness · gros boost SEO local + citations IA ────
  const profileUrl = `https://bisecco.fr/profil/${id}`;
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": profileUrl,
    name: companyName,
    description: a.description ?? `${metierLabel} à ${cityLabel}, vérifié SIREN sur Bisecco.`,
    url: profileUrl,
    image: avatarUrl,
    address: a.city
      ? {
          "@type": "PostalAddress",
          addressLocality: a.city,
          addressCountry: "FR",
        }
      : undefined,
    geo:
      a.latitude && a.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: a.latitude,
            longitude: a.longitude,
          }
        : undefined,
    aggregateRating: reviewCount > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: rating.toFixed(1),
          reviewCount,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    review: reviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
      },
      author: { "@type": "Person", name: r.author_name ?? "Client Bisecco" },
      reviewBody: r.comment,
      datePublished: r.created_at,
    })),
    knowsAbout: a.metiers.map((m) => m.name),
    areaServed: a.city ? { "@type": "City", name: a.city } : "France",
    sameAs: a.client_number ? [`https://bisecco.fr/profil/${a.client_number}`] : undefined,
  };

  const breadcrumbs = breadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Artisans", url: "/rechercher" },
    { name: a.name, url: `/profil/${id}` },
  ]);

  return (
    <>
      <JsonLd data={[localBusinessSchema, breadcrumbs]} />
      <div className="bg-ink-50 min-h-screen pb-20">
      {/* Cover photo · vraie balise <img> pour meilleur contrôle d'affichage */}
      <div className="relative w-full h-[340px] md:h-[420px] lg:h-[460px] bg-ink-200 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverUrl}
          alt={`Couverture de ${companyName}`}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-ink-50" />
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <Link
            href="/rechercher"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md text-sm font-semibold text-ink-700 hover:bg-white shadow-card transition"
          >
            <ArrowLeft size={16} /> Retour
          </Link>
          <div className="flex gap-2">
            <ShareButton
              title={`${companyName} sur Bisecco`}
              text={`Découvrez ${companyName} sur Bisecco · artisan vérifié SIREN`}
            />
            {canFavorite ? (
              <FavoriteButton artisanId={artisanIdNum} initialFavorited={alreadyFavorited} compact />
            ) : (
              <button className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-ink-700 hover:bg-white shadow-card transition opacity-60 cursor-not-allowed" aria-label="Connexion requise pour sauvegarder" title="Connectez-vous pour sauvegarder">
                <Heart size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container-default max-w-6xl -mt-20 relative z-10">
        {/* ═══════ HEADER REFONDU · 2025 ═══════ */}
        <div className="bg-white rounded-3xl shadow-[0_30px_60px_-25px_rgba(13,30,74,0.18)] border border-sand-200">
          {/* Bandeau supérieur : avatar + identité société */}
          <div className="px-6 md:px-10 pt-10 pb-6 md:pt-12 md:pb-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Avatar carré arrondi (logo société) avec halo si vérifié */}
              <div className="relative flex-shrink-0 -mt-16 md:-mt-20">
                {a.siren && (
                  <span className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-brand-500/25 via-emerald-400/15 to-transparent blur-md" aria-hidden />
                )}
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl border-4 border-white shadow-[0_12px_30px_-8px_rgba(13,30,74,0.35)] overflow-hidden bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarUrl}
                    alt={companyName}
                    className="w-full h-full object-contain bg-white"
                  />
                </div>
                {a.siren && (
                  <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-[3px] border-white grid place-items-center shadow-md">
                    <ShieldCheck size={12} className="text-white" strokeWidth={2.6} />
                  </span>
                )}
              </div>

              {/* Identité texte */}
              <div className="flex-1 min-w-0">
                {/* Eyebrow : métier en orange uppercase */}
                <div className="inline-flex items-center gap-1.5 text-[0.7rem] font-bold tracking-[0.16em] uppercase text-brand-500">
                  <Briefcase size={11} strokeWidth={2.6} />
                  {metierLabel}
                </div>

                {/* Titre · société */}
                <h1 className="font-display font-semibold text-[28px] md:text-[40px] leading-[1.05] tracking-[-0.025em] text-ink-900 mt-1.5">
                  {companyName}
                </h1>

                {/* Sous-titre · gérant + ville */}
                <div className="mt-2 text-[0.92rem] text-ink-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                  {hasSeparateCompany && gerantName !== companyName && (
                    <>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="text-ink-400">Gérant&nbsp;·</span>
                        <strong className="font-semibold text-ink-700">{gerantName}</strong>
                      </span>
                      <span className="text-ink-300">·</span>
                    </>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={13} className="text-ink-400" /> {cityLabel}
                  </span>
                  {a.availability && (
                    <>
                      <span className="text-ink-300">·</span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={13} className="text-ink-400" /> {a.availability}
                      </span>
                    </>
                  )}
                </div>

                {/* Badges + note */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {a.siren && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.72rem] font-bold">
                      <ShieldCheck size={11} strokeWidth={2.6} /> SIREN vérifié
                    </span>
                  )}
                  {reviewCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.72rem] font-bold">
                      <Star size={11} fill="#f07a2f" strokeWidth={0} className="text-brand-500" />
                      {rating.toFixed(1)} · {reviewCount} avis
                    </span>
                  )}
                  <LiveViewersCounter profileKey={a.client_number ?? String(a.id)} />
                </div>
              </div>

              {/* CTAs principaux à droite */}
              <div className="flex flex-col gap-2 w-full md:w-auto md:min-w-[210px]">
                <Link
                  href={`/devis?artisan=${id}`}
                  className="group inline-flex items-center justify-between gap-2 pl-5 pr-2.5 py-3 bg-brand-500 text-white font-semibold text-[0.92rem] hover:bg-brand-600 hover:-translate-y-0.5 transition-all shadow-[0_8px_20px_-4px_rgba(240,122,47,0.45)]"
                  style={{ borderRadius: "12px 12px 12px 0" }}
                >
                  <span className="inline-flex items-center gap-2">
                    <MessageCircle size={14} strokeWidth={2.4} /> Demander un devis
                  </span>
                  <span className="inline-flex w-7 h-7 rounded-md bg-white/20 grid place-items-center">→</span>
                </Link>
                {currentUser?.id !== a.id && (
                  <ContactButton
                    recipientId={a.id}
                    recipientName={a.name.split(" - ")[0] ?? a.name}
                    variant="outline"
                    isLoggedIn={!!currentUser}
                    loginRedirect={`/profil/${id}`}
                  />
                )}
                {currentUser?.id !== a.id && (
                  <SubmitCvButton
                    recipientId={a.id}
                    recipientName={a.company_name ?? a.name}
                    backUrl={`/profil/${id}`}
                    defaultName={currentUser?.name ?? ""}
                    defaultEmail={currentUser?.email ?? ""}
                    defaultPhone={currentUser?.phone ?? ""}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Stats banner · 4 cards horizontales */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-sand-200 bg-sand-50/40 rounded-b-3xl overflow-hidden">
            {[
              { label: "Note moyenne", value: rating > 0 ? rating.toFixed(1) : "·", sub: reviewCount > 0 ? `sur ${reviewCount} avis` : "Aucun avis", icon: Star, color: "text-brand-500", bg: "bg-brand-50" },
              { label: "Spécialités",   value: String(a.metiers.length),         sub: a.metiers.length > 1 ? "métiers couverts" : "métier principal", icon: Award, color: "text-info", bg: "bg-info-soft" },
              { label: "Disponibilité", value: a.availability ?? "Sur demande", sub: a.availability ? "à confirmer" : "contacter",                     icon: Clock, color: "text-ok",   bg: "bg-ok-soft" },
              { label: "Zone d'action", value: cityLabel.split(" ")[0]!,          sub: a.siren ? "SIREN actif" : "vérification en cours",            icon: MapPin, color: "text-violet", bg: "bg-violet-soft" },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`p-5 ${i < 3 ? "md:border-r border-sand-200" : ""} ${i < 2 ? "border-b md:border-b-0 border-sand-200" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg ${s.bg} grid place-items-center flex-shrink-0`}>
                    <s.icon size={15} className={s.color} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display font-semibold text-[1.15rem] text-ink-900 leading-tight truncate">
                      {s.value}
                    </div>
                    <div className="text-[0.66rem] font-semibold tracking-[0.08em] uppercase text-ink-400 mt-1">
                      {s.label}
                    </div>
                    <div className="text-[0.78rem] text-ink-500 mt-0.5 truncate">{s.sub}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

          <div className="grid lg:grid-cols-[1fr_360px] gap-8 mt-8">
            <div className="space-y-10">
              <section>
                <h2 className="text-xl font-bold text-ink-700 mb-3">À propos</h2>
                <p className="text-ink-500 leading-relaxed whitespace-pre-line">
                  {a.description ?? `${metierLabel} vérifié sur Bisecco. SIREN contrôlé via API officielle gouv.fr.`}
                </p>
                {a.metiers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {a.metiers.map((m) => (
                      <span key={m.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
                        {m.icon} {m.name}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              {services.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-ink-700 mb-4">Services & tarifs indicatifs</h2>
                  <div className="space-y-2">
                    {services.map((s) => (
                      <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-ink-50/60 border border-ink-100 hover:border-brand-300 hover:bg-white transition">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={18} className="text-brand-500 flex-shrink-0" />
                          <span className="font-semibold text-ink-700">{s.name}</span>
                        </div>
                        {s.price && (
                          <span className="text-sm text-ink-500">
                            <strong className="text-brand-500">{s.price}</strong>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {gallery.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-ink-700 flex items-center gap-2">
                      <Camera size={18} /> Galerie de réalisations
                    </h2>
                    <span className="text-sm text-ink-400">{gallery.length} photos</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {gallery.map((g) => (
                      <div key={g.id} className="aspect-[4/3] rounded-2xl overflow-hidden bg-ink-100 group cursor-pointer relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={g.image_path}
                          alt={g.caption ?? ""}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-ink-700">
                    Avis clients <span className="text-ink-300 font-normal">({reviewCount})</span>
                  </h2>
                </div>

                {reviewCount === 0 ? (
                  <div className="bg-ink-50/60 rounded-2xl p-6 border border-ink-100 text-center">
                    <Star size={28} className="text-ink-200 mx-auto mb-2" />
                    <p className="text-ink-500 text-sm">
                      Aucun avis pour l&apos;instant. Soyez le premier à recommander cet artisan après votre projet.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-br from-brand-50/60 to-white rounded-2xl p-6 border border-brand-100 mb-5">
                      <div className="grid md:grid-cols-[200px_1fr] gap-6 items-center">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-ink-700">{rating.toFixed(1)}</div>
                          <div className="flex justify-center gap-0.5 mt-2">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <Star key={i} size={16}
                                fill={i < Math.floor(rating) ? "#f07a2f" : "#e5e7eb"}
                                className={i < Math.floor(rating) ? "text-brand-500" : "text-ink-200"} />
                            ))}
                          </div>
                          <div className="text-xs text-ink-400 mt-2">{reviewCount} avis vérifiés</div>
                        </div>
                        <div className="space-y-2">
                          {ratingDistribution.map((r) => (
                            <div key={r.stars} className="flex items-center gap-3 text-xs">
                              <span className="text-ink-500 font-semibold w-8">{r.stars}★</span>
                              <div className="flex-1 h-2 bg-ink-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full" style={{ width: `${r.pct}%` }} />
                              </div>
                              <span className="text-ink-400 w-10 text-right">{r.pct}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {reviews.map((r) => (
                        <div key={r.id} className="bg-white rounded-2xl p-5 border border-ink-100 hover:border-brand-200 transition">
                          <div className="flex items-start gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={r.author_photo ?? `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(r.author_name)}`}
                              alt=""
                              className="w-11 h-11 rounded-full border border-ink-100 flex-shrink-0 bg-ink-50"
                              loading="lazy"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div>
                                  <strong className="text-ink-700">{r.author_name}</strong>
                                  <span className="text-xs text-ink-400 ml-2">· {formatDate(r.created_at)}</span>
                                </div>
                                <div className="flex gap-0.5">
                                  {Array.from({ length: r.rating }).map((_, i) => (
                                    <Star key={i} size={13} fill="#f07a2f" className="text-brand-500" />
                                  ))}
                                </div>
                              </div>
                              {r.comment && (
                                <p className="text-sm text-ink-600 leading-relaxed mt-2">{r.comment}</p>
                              )}
                              <button className="inline-flex items-center gap-1 mt-3 text-xs text-ink-400 hover:text-brand-500 font-semibold">
                                <ThumbsUp size={12} /> Utile
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </section>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className="bg-gradient-to-br from-ink-800 to-ink-700 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brand-500/20 blur-2xl" />
                <div className="relative">
                  <h3 className="font-bold">Contacter {a.name.split(" ")[0]}</h3>
                  <p className="text-white/65 text-sm mt-1">Réponse rapide garantie via la messagerie sécurisée Bisecco.</p>
                  <div className="mt-5 flex">
                    <CtaButton href={`/devis?artisan=${id}`} variant="primary" size="md" icon={MessageCircle} className="w-full justify-between">
                      Demander un devis
                    </CtaButton>
                  </div>
                  {currentUser?.id !== a.id && (
                    <div className="mt-2">
                      <ContactButton
                        recipientId={a.id}
                        recipientName={a.name.split(" - ")[0] ?? a.name}
                        variant="button"
                        isLoggedIn={!!currentUser}
                        loginRedirect={`/profil/${id}`}
                        className="!w-full !justify-center !bg-white/10 !border !border-white/20 hover:!bg-white/15"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-ink-100">
                <h3 className="font-bold text-ink-700 text-sm mb-3">Informations vérifiées</h3>
                <ul className="space-y-2.5 text-sm">
                  {a.siren && (
                    <li className="flex items-center gap-2.5 text-ink-600">
                      <ShieldCheck size={16} className="text-emerald-500 flex-shrink-0" />
                      <div><strong>SIREN</strong> · {a.siren}</div>
                    </li>
                  )}
                  <li className="flex items-center gap-2.5 text-ink-600">
                    <MapPin size={16} className="text-brand-500 flex-shrink-0" />
                    <div><strong>Ville</strong> · {cityLabel}</div>
                  </li>
                  {a.availability && (
                    <li className="flex items-center gap-2.5 text-ink-600">
                      <Clock size={16} className="text-blue-500 flex-shrink-0" />
                      <div><strong>Disponibilité</strong> · {a.availability}</div>
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-200/60">
                <h3 className="font-bold text-emerald-800 text-sm flex items-center gap-2 mb-2">
                  <ShieldCheck size={14} /> Profil sécurisé
                </h3>
                <p className="text-xs text-emerald-700/80 leading-relaxed">
                  {a.siren
                    ? "Identité vérifiée par notre équipe via le SIREN officiel."
                    : "Profil en cours de vérification."}
                  {" "}Aucune transaction directe · tout passe par la messagerie sécurisée.
                </p>
              </div>
            </aside>
          </div>

          {/* ── Sections actions utilisateur ─────────────── */}
          {canReview && (
            <div className="mt-8 max-w-3xl">
              <ReviewForm artisanId={artisanIdNum} artisanName={companyName} />
            </div>
          )}

          {!isNaN(artisanIdNum) && dbUser?.id !== artisanIdNum && (
            <div className="mt-4 max-w-3xl">
              <ReportProfileForm reportedUserId={artisanIdNum} isGuest={!dbUser} />
            </div>
          )}
      </div>
    </div>
    </>
  );
}
