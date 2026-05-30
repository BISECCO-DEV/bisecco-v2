import Link from "next/link";
import { Star, ShieldCheck, ArrowRight, PenLine } from "lucide-react";
import { fetchPublicReviews, fetchReviewsStats } from "@/lib/reviews/fetch";
import { CtaButton } from "@/components/ui/CtaButton";

function StarRow({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="inline-flex gap-0.5" aria-label={`${rating} étoiles sur 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={0}
          className={i < rating ? "fill-[#FFB800] text-[#FFB800]" : "fill-ink-100 text-ink-100"}
        />
      ))}
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const day = 86400000;
  const days = Math.floor(diff / day);
  if (days < 1) return "Aujourd'hui";
  if (days < 7) return `Il y a ${days} j`;
  if (days < 30) return `Il y a ${Math.floor(days / 7)} sem`;
  if (days < 365) return `Il y a ${Math.floor(days / 30)} mois`;
  return `Il y a ${Math.floor(days / 365)} an${Math.floor(days / 365) > 1 ? "s" : ""}`;
}

export async function HomeReviews() {
  const [reviews, stats] = await Promise.all([
    fetchPublicReviews(6),
    fetchReviewsStats(),
  ]);

  // CTA générique (les utilisateurs non connectés sont redirigés à l'action)
  const ctaHref = "/rechercher";
  const ctaLabel = "Noter un artisan";

  return (
    <section className="relative py-20 sm:py-28 bg-gradient-to-b from-ink-50 via-white to-ink-50 overflow-hidden">
      {/* Décors */}
      <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] rounded-full bg-brand-500/[0.06] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 -right-32 w-[500px] h-[500px] rounded-full bg-blue-500/[0.05] blur-[140px] pointer-events-none" />

      <div className="container-default relative">
        {/* ═══════ HEAD CENTRÉ ═══════ */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
            <Star size={11} strokeWidth={0} className="fill-[#FFB800]" />
            Ils nous recommandent
          </span>
          <h2 className="mt-5 text-[32px] lg:text-[38px] leading-[1.25] font-semibold text-ink-700 tracking-[-0.025em]">
            Des artisans notés par{" "}
            <span className="relative inline-block">
              <span className="text-brand-500">de vrais clients</span>
              <span className="text-brand-500">.</span>
            </span>
          </h2>
          <p className="mt-5 text-[0.96rem] sm:text-[1.06rem] text-ink-500 leading-relaxed">
            Chaque avis publié provient d&apos;un client vérifié, lié à une demande de devis réelle.
            Modéré par notre équipe sous 24h.
          </p>
        </div>

        {/* ═══════ STATS CENTRÉ ═══════ */}
        {stats.count > 0 && (
          <div className="flex justify-center mb-12 sm:mb-14">
            <div className="inline-flex items-center gap-5 sm:gap-7 bg-white border border-ink-100 rounded-2xl px-6 sm:px-8 py-4 shadow-[0_10px_30px_-15px_rgba(13,30,74,0.18)]">
              <div className="text-center">
                <div className="text-[2rem] sm:text-[2.4rem] font-extrabold text-ink-700 leading-none tabular-nums">
                  {stats.avg.toFixed(1)}
                </div>
                <div className="mt-1.5 flex justify-center">
                  <StarRow rating={Math.round(stats.avg)} size={13} />
                </div>
              </div>
              <div className="h-12 w-px bg-ink-100" />
              <div className="text-center">
                <div className="text-[1.5rem] sm:text-[1.8rem] font-extrabold text-ink-700 leading-none tabular-nums">
                  {stats.count}
                </div>
                <div className="text-[0.7rem] text-ink-400 mt-1 uppercase tracking-wider font-bold">avis</div>
              </div>
              <div className="h-12 w-px bg-ink-100" />
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={16} strokeWidth={2.2} />
                </div>
                <div className="text-[0.7rem] text-ink-400 mt-1 uppercase tracking-wider font-bold">modérés</div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ GRILLE D'AVIS · cartes horizontales ═══════ */}
        {reviews.length === 0 ? (
          <EmptyState ctaHref={ctaHref} ctaLabel={ctaLabel} />
        ) : (
          <>
            <div className="grid lg:grid-cols-2 gap-5 max-w-5xl mx-auto">
              {reviews.map((r) => (
                <article
                  key={r.id}
                  className="group relative bg-white rounded-2xl border border-ink-100 p-5 sm:p-6 hover:border-brand-200 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(13,30,74,0.18)] transition-all flex gap-5"
                >
                  {/* COL GAUCHE · avatar + bouton profil */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white font-extrabold text-[1rem] shadow-[0_8px_20px_-4px_rgba(240,122,47,0.4),inset_0_1px_0_rgba(255,255,255,0.25)]">
                      {r.author_initials}
                    </div>
                    {r.artisan_client_number && (
                      <Link
                        href={`/profil/${r.artisan_client_number}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ink-50 hover:bg-brand-500 hover:text-white text-ink-400 transition"
                        aria-label="Voir le profil de l'artisan"
                      >
                        <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>

                  {/* COL DROITE · contenu */}
                  <div className="flex-1 min-w-0 text-left">
                    {/* Étoiles + date */}
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <StarRow rating={r.rating} size={16} />
                      <span className="text-[0.7rem] text-ink-400 font-medium flex-shrink-0">
                        {timeAgo(r.created_at)}
                      </span>
                    </div>

                    {/* Quote */}
                    <blockquote className="text-[0.92rem] text-ink-700 leading-relaxed line-clamp-4">
                      <span className="text-brand-500 font-bold">« </span>
                      {r.comment}
                      <span className="text-brand-500 font-bold"> »</span>
                    </blockquote>

                    {/* Auteur + artisan noté */}
                    <div className="mt-4 pt-3 border-t border-ink-100">
                      <div className="font-extrabold text-ink-700 text-[0.88rem] tracking-tight truncate">
                        {r.author_name}
                      </div>
                      <div className="text-[0.72rem] text-ink-400 mt-0.5 truncate">
                        a noté <strong className="text-ink-600">{r.artisan_name}</strong>
                        {r.artisan_metier ? ` · ${r.artisan_metier}` : ""}
                        {r.artisan_city ? ` · ${r.artisan_city}` : ""}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* ═══════ CTA CENTRÉ ═══════ */}
            <div className="mt-12 sm:mt-14 flex flex-col items-center gap-4 text-center">
              <p className="text-ink-500 max-w-md text-[0.95rem]">
                Un artisan Bisecco vous a aidé&nbsp;?
                <br />
                <strong className="text-ink-700">Notez-le en 30 secondes.</strong>
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <CtaButton href={ctaHref} variant="primary" size="md" icon={PenLine}>
                  {ctaLabel}
                </CtaButton>
                <CtaButton href="/avis" variant="outline" size="md">
                  Voir tous les avis
                </CtaButton>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────
function EmptyState({
  ctaHref,
  ctaLabel,
}: {
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="text-center max-w-xl mx-auto">
      <div className="inline-flex gap-1 mb-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} size={28} strokeWidth={0} className="fill-[#FFB800]" />
        ))}
      </div>
      <h3 className="text-[1.4rem] sm:text-[1.6rem] font-semibold text-ink-700 tracking-tight">
        Soyez le premier à laisser un avis.
      </h3>
      <p className="mt-3 text-ink-500 leading-relaxed">
        Vous avez fait appel à un artisan&nbsp;? Aidez la communauté en partageant votre expérience.
      </p>
      <div className="mt-7 flex justify-center">
        <CtaButton href={ctaHref} variant="primary" size="md" icon={PenLine}>
          {ctaLabel}
        </CtaButton>
      </div>
    </div>
  );
}
