"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const SHOW_THRESHOLD = 500;

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Remonter en haut de la page"
      className={`fixed bottom-[148px] lg:bottom-[88px] right-5 z-[88] w-12 h-12 rounded-full bg-ink-700 text-white border border-white/15 shadow-[0_8px_24px_-6px_rgba(13,30,74,0.45)] flex items-center justify-center hover:bg-ink-800 hover:-translate-y-0.5 transition-all ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <ArrowUp size={20} strokeWidth={2.6} />
    </button>
  );
}
