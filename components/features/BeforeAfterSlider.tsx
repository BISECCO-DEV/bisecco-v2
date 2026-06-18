"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Move } from "lucide-react";

type Props = {
  beforeUrl: string;
  afterUrl: string;
  alt?: string;
  /** Classe Tailwind pour la hauteur (ex: "h-64", "h-80"). Default "h-72". */
  heightClass?: string;
  /** Position initiale du curseur en % (0-100). Default 50. */
  initialPosition?: number;
};

/**
 * Slider interactif avant/après.
 *
 * UX :
 * - L'image "après" est en arrière-plan (full).
 * - L'image "avant" est devant, masquée à droite par un clip-path qui suit le curseur.
 * - Curseur draggable (souris + touch).
 * - Auto-démo : au premier rendu, le curseur fait un petit aller-retour pour
 *   indiquer qu'il est interactif (déclenché à l'apparition dans le viewport).
 */
export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  alt = "",
  heightClass = "h-72",
  initialPosition = 50,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(initialPosition);
  const [dragging, setDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // ─── Drag handlers ──────────────────────────────────────────────────
  const updateFromEvent = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPos(pct);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    setHasInteracted(true);
    updateFromEvent(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    updateFromEvent(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setDragging(false);
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* noop */ }
  };

  // ─── Auto-démo au premier affichage (intersection observer) ─────────
  useEffect(() => {
    if (hasInteracted) return;
    const el = containerRef.current;
    if (!el) return;

    const obs = new IntersectionObserver((entries) => {
      const visible = entries.some((e) => e.isIntersecting);
      if (!visible) return;
      obs.disconnect();

      // Petite anim de teasing : 50 → 70 → 30 → 50
      const steps = [70, 30, 50];
      let i = 0;
      const tick = () => {
        if (hasInteracted || i >= steps.length) return;
        setPos(steps[i]!);
        i += 1;
        setTimeout(tick, 600);
      };
      setTimeout(tick, 400);
    }, { threshold: 0.4 });

    obs.observe(el);
    return () => obs.disconnect();
  }, [hasInteracted]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${heightClass} overflow-hidden bg-ink-100 select-none touch-none cursor-ew-resize`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* APRÈS — image de fond, toujours pleine */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={afterUrl}
        alt={alt ? `${alt} (après)` : "Après"}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
        loading="lazy"
      />

      {/* AVANT — masquée à droite du curseur */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: `polygon(0 0, ${pos}% 0, ${pos}% 100%, 0 100%)`,
          transition: dragging ? "none" : "clip-path 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeUrl}
          alt={alt ? `${alt} (avant)` : "Avant"}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
          loading="lazy"
        />
      </div>

      {/* Étiquettes Avant / Après */}
      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/65 backdrop-blur-sm text-white text-[0.65rem] font-bold tracking-wider uppercase pointer-events-none">
        Avant
      </span>
      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-brand-500/95 text-white text-[0.65rem] font-bold tracking-wider uppercase pointer-events-none">
        Après
      </span>

      {/* Ligne verticale + handle */}
      <div
        className="absolute top-0 bottom-0 w-[3px] bg-white pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{
          left: `${pos}%`,
          transform: "translateX(-50%)",
          transition: dragging ? "none" : "left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.35)] grid place-items-center text-ink-700 ring-2 ring-brand-500/40"
          aria-hidden
        >
          <Move size={16} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}
