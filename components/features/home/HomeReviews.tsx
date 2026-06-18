import { Star, ShieldCheck, PenLine } from "lucide-react";
import { fetchPublicReviews, fetchReviewsStats } from "@/lib/reviews/fetch";
import { CtaButton } from "@/components/ui/CtaButton";
import { ReviewsCarousel } from "./ReviewsCarousel";

function StarRow({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="inline-flex gap-0.5" aria-label={`${rating} étoiles sur 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={0}
          style={{ color: i < rating ? "#FFB800" : undefined }}
          className={i < rating ? "fill-current" : "fill-white/15 text-white/15"}
        />
      ))}
    </div>
  );
}

export async function HomeReviews() {
  const [reviews, stats] = await Promise.all([
    fetchPublicReviews(10),
    fetchReviewsStats(),
  ]);

  const ctaHref = "/rechercher";
  const ctaLabel = "Noter un professionnel";

  return (
    <section className="relative py-20 sm:py-28 bg-[#05122e] overflow-hidden">
      {/* Décors : halos brand + navy comme les autres sections sombres */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='92' viewBox='0 0 80 92'><path d='M20 0 L60 0 L80 34.6 L60 69.3 L20 69.3 L0 34.6 Z' fill='none' stroke='%231e4fa3' stroke-width='1'/></svg>")`,
        }}
      />
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-brand-500/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 -right-32 w-[460px] h-[460px] rounded-full bg-blue-500/10 blur-[140px] pointer-events-none" />

      <div className="container-default relative max-w-6xl">
        {/* ═══════ HEAD ═══════ */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-white text-[0.7rem] font-bold tracking-[0.14em] uppercase backdrop-blur-sm">
            <Star size={11} strokeWidth={0} className="fill-[#FFB800] text-[#FFB800]" />
            Ils nous recommandent
          </span>
          <h2 className="mt-5 text-[32px] lg:text-[40px] leading-[1.18] font-semibold text-white tracking-[-0.025em]">
            Ce que les clients disent{" "}
            <span className="text-brand-400">vraiment</span>.
          </h2>
          <p className="mt-5 text-[0.96rem] sm:text-[1.06rem] text-white/65 leading-relaxed">
            Chaque avis est vérifié par notre équipe.{" "}
            <strong className="text-white">Pas de faux avis, pas d&apos;achat de réputation.</strong>
          </p>
        </div>

        {/* ═══════ STATS BAR ═══════ */}
        {stats.count > 0 && (
          <div className="flex justify-center mb-12 sm:mb-14">
            <div className="inline-flex items-stretch divide-x divide-white/10 bg-white/[0.04] border border-white/10 rounded-2xl shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-sm">
              <div className="px-7 py-5 text-center min-w-[120px]">
                <div className="text-[2rem] sm:text-[2.4rem] font-extrabold text-white leading-none tabular-nums">
                  {stats.avg.toFixed(1)}
                </div>
                <div className="mt-2 flex justify-center">
                  <StarRow rating={Math.round(stats.avg)} size={14} />
                </div>
                <div className="text-[0.62rem] text-white/50 mt-1.5 uppercase tracking-[0.14em] font-bold">
                  sur 5
                </div>
              </div>
              <div className="px-7 py-5 text-center min-w-[120px]">
                <div className="text-[1.6rem] sm:text-[2rem] font-extrabold text-white leading-none tabular-nums">
                  {stats.count}
                </div>
                <div className="text-[0.7rem] text-white/50 mt-2 uppercase tracking-[0.14em] font-bold">
                  {stats.count > 1 ? "avis vérifiés" : "avis vérifié"}
                </div>
              </div>
              <div className="px-7 py-5 text-center min-w-[120px] flex flex-col items-center justify-center">
                <ShieldCheck size={22} strokeWidth={2.2} className="text-emerald-400" />
                <div className="text-[0.7rem] text-white/50 mt-2 uppercase tracking-[0.14em] font-bold">
                  100 % modérés
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ CAROUSEL ou EMPTY ═══════ */}
        {reviews.length === 0 ? (
          <EmptyState ctaHref={ctaHref} ctaLabel={ctaLabel} />
        ) : (
          <>
            <ReviewsCarousel reviews={reviews} />

            {/* CTA bas */}
            <div className="mt-14 flex flex-col items-center gap-4 text-center">
              <p className="text-white/65 max-w-md text-[0.95rem]">
                Un professionnel Bisecco vous a aidé&nbsp;?
                <br />
                <strong className="text-white">Notez-le en 30 secondes.</strong>
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <CtaButton href={ctaHref} variant="primary" size="md" icon={PenLine}>
                  {ctaLabel}
                </CtaButton>
                <CtaButton href="/avis" variant="white" size="md">
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

// =====================================================================
// EmptyState · sur fond sombre, trust signals
// =====================================================================
function EmptyState({
  ctaHref,
  ctaLabel,
}: {
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid sm:grid-cols-3 gap-3 mb-10">
        {[
          { num: "189", label: "Métiers référencés", icon: "🛠️" },
          { num: "SIREN", label: "Vérification officielle", icon: "🛡️" },
          { num: "0 %", label: "Commission · gratuit", icon: "💰" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white/[0.04] rounded-2xl border border-white/10 px-5 py-5 text-center backdrop-blur-sm"
          >
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-xl font-extrabold text-white tabular-nums">{s.num}</div>
            <div className="text-[0.7rem] uppercase tracking-wider text-white/55 font-bold mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <div className="inline-flex gap-1 mb-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={22} strokeWidth={0} className="fill-[#FFB800] text-[#FFB800]" />
          ))}
        </div>
        <h3 className="text-[1.4rem] sm:text-[1.6rem] font-semibold text-white tracking-tight">
          Pas encore d&apos;avis publiés.
        </h3>
        <p className="mt-3 text-white/65 leading-relaxed max-w-md mx-auto">
          Tu as fait appel à un professionnel via Bisecco&nbsp;? Sois le premier à partager ton expérience.
        </p>
        <div className="mt-6 flex justify-center">
          <CtaButton href={ctaHref} variant="primary" size="md" icon={PenLine}>
            {ctaLabel}
          </CtaButton>
        </div>
      </div>
    </div>
  );
}
