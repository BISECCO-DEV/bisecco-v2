"use client";

import { useEffect, useRef, useState } from "react";

type Direction = "up" | "down" | "left" | "right" | "fade";

type Props = {
  children: React.ReactNode;
  /** Délai d'apparition en ms */
  delay?: number;
  /** Direction de l'animation */
  direction?: Direction;
  /** Distance du déplacement initial (px) */
  distance?: number;
  /** Déclencheur visible (% de l'élément visible) */
  threshold?: number;
  /** Animer une seule fois */
  once?: boolean;
  /** ClassName supplémentaire */
  className?: string;
};

function getInitialTransform(direction: Direction, distance: number): string {
  switch (direction) {
    case "up":    return `translateY(${distance}px)`;
    case "down":  return `translateY(-${distance}px)`;
    case "left":  return `translateX(${distance}px)`;
    case "right": return `translateX(-${distance}px)`;
    case "fade":  return "translateY(0)";
  }
}

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  distance = 28,
  threshold = 0.15,
  once = true,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0,0)" : getInitialTransform(direction, distance),
        transition: "opacity 0.7s cubic-bezier(.22,.68,0,1.2), transform 0.7s cubic-bezier(.22,.68,0,1.2)",
        transitionDelay: `${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
