"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";

// Routes où la sticky CTA doit apparaître (page d'accueil principalement)
const SHOW_ON_ROUTES = ["/"];

// Routes où elle est masquée même si SHOW_ON inclut le path
const HIDDEN_ROUTES = [
  "/connexion",
  "/inscription",
  "/admin",
  "/maintenance",
  "/messagerie",
  "/coming-soon",
];

const SCROLL_SHOW_THRESHOLD = 400; // pixels — apparaît après avoir scrollé du hero

export function StickyMobileCTA() {
  const pathname = usePathname() || "/";
  const [scrollVisible, setScrollVisible] = useState(false);

  const allowed = SHOW_ON_ROUTES.includes(pathname);
  const hidden = HIDDEN_ROUTES.some((r) => pathname.startsWith(r));
  const active = allowed && !hidden;

  useEffect(() => {
    if (!active) return;
    const onScroll = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollVisible(scrolled > SCROLL_SHOW_THRESHOLD && scrolled < max * 0.92);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [active]);

  if (!active) return null;
  const visible = scrollVisible;

  return (
    <div
      className={`lg:hidden fixed left-0 right-0 z-40 px-3 transition-all duration-400 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6 pointer-events-none"
      }`}
      style={{ bottom: "calc(76px + env(safe-area-inset-bottom, 0px))" }}
      aria-hidden={!visible}
    >
      <Link
        href="/rechercher"
        className="group relative flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-extrabold text-[0.92rem] shadow-[0_12px_28px_-6px_rgba(240,122,47,0.55),inset_0_1px_0_rgba(255,255,255,0.25)] active:scale-[0.98] transition-transform overflow-hidden"
      >
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" aria-hidden />
        <Search size={16} strokeWidth={2.4} className="relative" />
        <span className="relative">Trouver mon artisan</span>
        <ArrowRight size={14} strokeWidth={2.6} className="relative" />
      </Link>
    </div>
  );
}
