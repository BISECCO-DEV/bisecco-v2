"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  end: number;
  duration?: number;
  delayMs?: number;
  className?: string;
  suffix?: string;
};

/**
 * Compteur animé qui interpole de 0 vers `end` en `duration` ms.
 * Démarre avec un délai optionnel pour s'intégrer dans un stagger.
 */
export function CountUp({ end, duration = 1500, delayMs = 0, className, suffix = "" }: Props) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const startTimer = setTimeout(() => {
      const startTime = performance.now();
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(end * eased));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };
      rafRef.current = requestAnimationFrame(animate);
    }, delayMs);

    return () => {
      clearTimeout(startTimer);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration, delayMs]);

  return (
    <strong className={className}>
      {value.toLocaleString("fr-FR")}{suffix}
    </strong>
  );
}
