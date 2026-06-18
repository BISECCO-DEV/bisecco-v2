"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import type { PublicReview } from "@/lib/reviews/fetch";

type Props = {
  reviews: PublicReview[];
};

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function formatMonthYear(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;
}

// Palette d'avatars cohérente avec la DA Bisecco (orange brand + accent)
const AVATAR_PALETTES = [
  "bg-gradient-to-br from-brand-400 to-brand-600",        // orange brand
  "bg-gradient-to-br from-cyan-400 to-cyan-600",          // cyan
  "bg-gradient-to-br from-violet-400 to-violet-600",      // violet
  "bg-gradient-to-br from-emerald-400 to-emerald-600",    // emerald
  "bg-gradient-to-br from-amber-400 to-amber-600",        // ambre
  "bg-gradient-to-br from-rose-400 to-rose-600",          // rose
];

function avatarColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length]!;
}

const PREVIEW_CHAR_LIMIT = 220;

export function ReviewsCarousel({ reviews }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-review-card]");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="relative">
      {/* Flèche gauche */}
      <button
        type="button"
        onClick={() => scrollBy(-1)}
        disabled={!canScrollLeft}
        aria-label="Avis précédents"
        className="hidden md:flex absolute left-[-22px] top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white text-ink-700 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.4)] items-center justify-center hover:bg-brand-50 hover:text-brand-600 transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-ink-700"
      >
        <ChevronLeft size={20} strokeWidth={2.4} />
      </button>

      {/* Flèche droite */}
      <button
        type="button"
        onClick={() => scrollBy(1)}
        disabled={!canScrollRight}
        aria-label="Avis suivants"
        className="hidden md:flex absolute right-[-22px] top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white text-ink-700 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.4)] items-center justify-center hover:bg-brand-50 hover:text-brand-600 transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-ink-700"
      >
        <ChevronRight size={20} strokeWidth={2.4} />
      </button>

      {/* Scroller horizontal */}
      <div
        ref={scrollerRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-px-4 pb-3 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {reviews.map((r) => {
          const isExpanded = expanded.has(r.id);
          const needsTruncate = (r.comment?.length ?? 0) > PREVIEW_CHAR_LIMIT;
          const display = needsTruncate && !isExpanded
            ? `${r.comment!.slice(0, PREVIEW_CHAR_LIMIT).trimEnd()}…`
            : r.comment;
          const profileHref = r.artisan_client_number ? `/profil/${r.artisan_client_number}` : null;
          const avatarColor = avatarColorFromName(r.author_name);

          return (
            <article
              key={r.id}
              data-review-card
              className="snap-start flex-shrink-0 w-[300px] sm:w-[340px] rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm p-6 hover:bg-white/[0.07] hover:border-white/20 transition flex flex-col"
            >
              {/* Header : avatar + nom + date */}
              <header className="flex items-center gap-3 mb-4">
                <div className={`w-11 h-11 rounded-full grid place-items-center text-white font-extrabold text-[0.78rem] flex-shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] ${avatarColor}`}>
                  {r.author_initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-white text-[0.95rem] tracking-tight truncate leading-tight">
                    {r.author_name}
                  </div>
                  <div className="text-[0.72rem] text-white/55 mt-0.5">
                    {formatMonthYear(r.created_at)}
                  </div>
                </div>
              </header>

              {/* Étoiles */}
              <div className="mb-3 flex gap-0.5" aria-label={`${r.rating} étoiles sur 5`}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    size={15}
                    strokeWidth={0}
                    style={{ color: i < r.rating ? "#FFB800" : undefined }}
                    className={i < r.rating ? "fill-current" : "fill-white/15 text-white/15"}
                  />
                ))}
              </div>

              {/* Commentaire */}
              <p className="text-[0.88rem] text-white/85 leading-[1.55] flex-1">
                {display}
              </p>

              {/* "Lire la suite" si tronqué */}
              {needsTruncate && (
                <button
                  type="button"
                  onClick={() => toggleExpand(r.id)}
                  className="mt-2 inline-flex items-center gap-1 text-[0.8rem] font-bold text-brand-400 hover:text-brand-300 transition self-start"
                >
                  {isExpanded ? "Réduire ←" : "Lire la suite →"}
                </button>
              )}

              {/* Footer : qui a été noté */}
              <footer className="mt-4 pt-4 border-t border-white/10 text-[0.72rem] text-white/55 truncate">
                <span>a noté </span>
                {profileHref ? (
                  <Link
                    href={profileHref}
                    className="text-brand-400 font-bold hover:text-brand-300 hover:underline"
                  >
                    {r.artisan_name}
                  </Link>
                ) : (
                  <strong className="text-white/75 font-bold">{r.artisan_name}</strong>
                )}
                {r.artisan_metier && <span className="text-white/45"> · {r.artisan_metier}</span>}
                {r.artisan_city && <span className="text-white/45"> · {r.artisan_city}</span>}
              </footer>
            </article>
          );
        })}
      </div>

      {/* Indicateurs scroll mobile */}
      <div className="md:hidden mt-4 text-center text-xs text-white/45">
        Glisser pour voir plus →
      </div>
    </div>
  );
}
