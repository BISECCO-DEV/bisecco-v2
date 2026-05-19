"use client";

import { useEffect, useState } from "react";

type Props = {
  targetId: string;
  /** Décalage en pixels pour compenser le header fixed (par défaut 100px). */
  offset?: number;
  label?: string;
};

/**
 * Indicateur de scroll premium · mouse-shape avec dot animé + chevron.
 * Disparaît progressivement quand l'utilisateur commence à scroller.
 */
export function ScrollIndicator({ targetId, offset = 100, label = "Voir plus" }: Props) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Fade out après 60px de scroll
      setHidden(window.scrollY > 60);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label} · défiler vers le contenu`}
      className={`group absolute bottom-4 sm:bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 sm:gap-2 px-3 py-1 transition-all duration-500 ${
        hidden ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100"
      }`}
    >
      {/* Label texte */}
      <span className="text-[0.6rem] sm:text-[0.7rem] font-bold tracking-[0.18em] uppercase text-white/70 group-hover:text-white transition-colors">
        {label}
      </span>

      {/* Mouse-shape SVG avec dot animé · fond glass pour mieux ressortir sur mobile */}
      <span className="relative inline-flex items-center justify-center w-7 h-11 rounded-full border-2 border-white/50 group-hover:border-brand-400 bg-ink-900/40 backdrop-blur-sm transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.25)]">
        <span className="absolute top-1.5 w-1 h-2 rounded-full bg-white group-hover:bg-brand-400 animate-scroll-dot transition-colors" />
      </span>

      {/* Chevron animé */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white/70 group-hover:text-brand-400 animate-bounce-slow transition-colors"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}
