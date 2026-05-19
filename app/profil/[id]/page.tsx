import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin, Star, ShieldCheck, MessageCircle,
  CheckCircle2, Award, Briefcase, Clock, ArrowLeft, Share2, Heart,
  ThumbsUp, Camera, Send,
} from "lucide-react";
import { fetchArtisanProfileDetail } from "@/lib/db/artisans";
import { getCurrentUser } from "@/lib/db/current-user";
import { SubmitCvButton } from "@/components/features/SubmitCvButton";
import { FavoriteButton } from "@/components/features/FavoriteButton";
import { ReviewForm } from "@/components/features/ReviewForm";
import { ReportProfileForm } from "@/components/features/ReportProfileForm";
import { hasFavorited } from "@/lib/favorites/actions";
import { getCurrentDbUser } from "@/lib/auth/current-user";

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
  const detail = await fetchArtisanProfileDetail(id);
  if (!detail) return { title: "Profil introuvable" };
  const a = detail.artisan;
  const metierLabel = a.metiers[0]?.name ?? "Artisan";
  return {
    title: `${a.company_name ?? a.name} — ${metierLabel} à ${a.city ?? "France"}`,
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
  const artisanIdNum = parseInt(id, 10);
  const [detail, currentUser, dbUser, alreadyFavorited] = await Promise.all([
    fetchArtisanProfileDetail(id),
    getCurrentUser(),
    getCurrentDbUser(),
    isNaN(artisanIdNum) ? Promise.resolve(false) : hasFavorited(artisanIdNum),
  ]);
  if (!detail) notFound();
  const canFavorite = !!dbUser && dbUser.role !== "artisan" && !isNaN(artisanIdNum);
  const canReview = !!dbUser && dbUser.role !== "artisan" && dbUser.id !== artisanIdNum;

  const { artisan: a, services, gallery, reviews } = detail;
  const metierLabel = a.metiers[0]?.name ?? "Artisan";
  const companyName = a.company_name ?? a.name;
  const cityLabel = a.city ?? "France";

  const coverUrl =
    a.cover_photo ??
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&h=400&fit=crop&q=80";
  const avatarUrl =
    a.profile_photo ?? `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(a.name)}`;

  const rating = a.avg_rating ?? 0;
  const reviewCount = a.review_count;
  const ratingDistribution = computeRatingDistribution(reviews);

  return (
    <div className="bg-ink-50 min-h-screen pb-20">
      <div
        className="relative h-[280px] md:h-[340px] bg-cover bg-center bg-ink-200"
        style={{ backgroundImage: `url(${coverUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-ink-50" />
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <Link
            href="/rechercher"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md text-sm font-semibold text-ink-700 hover:bg-white shadow-card transition"
          >
            <ArrowLeft size={16} /> Retour
          </Link>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-ink-700 hover:bg-white shadow-card transition" aria-label="Partager">
              <Share2 size={16} />
            </button>
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

      <div className="container-default max-w-6xl -mt-24 relative z-10">
        <div className="bg-white rounded-3xl shadow-card border border-ink-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-5 -mt-20 md:-mt-24 pb-6 border-b border-ink-100">
            <div className="w-32 h-32 rounded-3xl border-4 border-white overflow-hidden flex-shrink-0 shadow-card bg-ink-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatarUrl} alt={a.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-ink-700">{companyName}</h1>
                {a.siren && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                    <ShieldCheck size={12} /> SIREN vérifié
                  </span>
                )}
              </div>
              {a.company_name && a.name !== a.company_name && (
                <p className="text-ink-500 mt-1 font-medium">{a.name}</p>
              )}
              <div className="flex items-center gap-3 text-sm text-ink-400 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 font-semibold text-brand-500">
                  <Briefcase size={14} /> {metierLabel}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> {cityLabel}</span>
                {reviewCount > 0 && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Star size={14} fill="#f07a2f" className="text-brand-500" />
                      <strong className="text-ink-700">{rating.toFixed(1)}</strong>
                      <span>({reviewCount} avis)</span>
                    </span>
                  </>
                )}
                {a.availability && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {a.availability}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full md:w-auto">
              <Link href={`/devis?artisan=${id}`} className="btn-primary">
                <MessageCircle size={16} /> Demander un devis
              </Link>
              <Link href={`/messagerie/${id}`} className="btn-outline">
                <Send size={16} /> Message
              </Link>
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Note", value: rating > 0 ? rating.toFixed(1) : "—", sub: reviewCount > 0 ? `${reviewCount} avis` : "Nouveau", icon: Star, color: "text-brand-500" },
              { label: "Métiers", value: String(a.metiers.length), sub: "spécialités", icon: Award, color: "text-blue-500" },
              { label: "Réponse", value: a.availability ?? "—", sub: "disponibilité", icon: Clock, color: "text-emerald-500" },
              { label: "Zone", value: cityLabel.split(" ")[0]!, sub: a.siren ? "SIREN OK" : "—", icon: MapPin, color: "text-purple-500" },
            ].map((s) => (
              <div key={s.label} className="bg-ink-50/60 rounded-2xl p-4 border border-ink-100">
                <s.icon size={18} className={`${s.color} mb-2`} />
                <div className="text-xl font-bold text-ink-700 truncate">{s.value}</div>
                <div className="text-xs text-ink-400">{s.label} <span className="text-ink-300">· {s.sub}</span></div>
              </div>
            ))}
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
                  <Link href={`/devis?artisan=${id}`} className="mt-5 inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition">
                    <MessageCircle size={16} /> Demander un devis
                  </Link>
                  <Link href={`/messagerie/${id}`} className="mt-2 inline-flex w-full items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/15 transition">
                    Envoyer un message
                  </Link>
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
                  {" "}Aucune transaction directe — tout passe par la messagerie sécurisée.
                </p>
              </div>
            </aside>
          </div>

          {/* ── Sections actions utilisateur ─────────────── */}
          {canReview && (
            <div className="mt-8 max-w-3xl">
              <ReviewForm artisanId={artisanIdNum} artisanName={a.name ?? "cet artisan"} />
            </div>
          )}

          {!isNaN(artisanIdNum) && dbUser?.id !== artisanIdNum && (
            <div className="mt-4 max-w-3xl">
              <ReportProfileForm reportedUserId={artisanIdNum} isGuest={!dbUser} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
