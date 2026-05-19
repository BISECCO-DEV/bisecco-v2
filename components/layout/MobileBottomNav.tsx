"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Briefcase, User, FileText } from "lucide-react";

type NavItem = {
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  match?: (path: string) => boolean;
};

const ITEMS: NavItem[] = [
  { href: "/",            icon: Home,      label: "Accueil",    match: (p) => p === "/" },
  { href: "/rechercher",  icon: Search,    label: "Rechercher", match: (p) => p.startsWith("/rechercher") || p.startsWith("/artisans") },
  { href: "/metiers",     icon: Briefcase, label: "Métiers",    match: (p) => p.startsWith("/metiers") },
  { href: "/mon-profil",  icon: User,      label: "Profil",     match: (p) => p.startsWith("/mon-profil") },
];

// Routes où la bottom nav doit être masquée (auth, admin, full-screen flows)
const HIDDEN_ROUTES = [
  "/connexion",
  "/inscription",
  "/recuperation",
  "/admin",
  "/maintenance",
  "/coming-soon",
];

export function MobileBottomNav() {
  const pathname = usePathname() || "/";

  // Cacher sur certaines routes
  if (HIDDEN_ROUTES.some((r) => pathname.startsWith(r))) return null;

  return (
    <>
      {/* Spacer pour éviter que le contenu soit caché sous la nav */}
      <div className="lg:hidden h-[76px]" aria-hidden />

      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-ink-100 shadow-[0_-8px_32px_-12px_rgba(13,30,74,0.15)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="Navigation principale mobile"
      >
        <ul className="relative grid grid-cols-5 items-end h-[64px] px-2">
          {/* Items à gauche */}
          {ITEMS.slice(0, 2).map((item) => (
            <BottomNavItem key={item.href} item={item} active={!!item.match?.(pathname)} />
          ))}

          {/* CTA central — Demander un devis (raised, brand color) */}
          <li className="flex items-center justify-center">
            <Link
              href="/devis"
              className="group relative flex flex-col items-center justify-center -mt-7 w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-[0_8px_20px_-4px_rgba(240,122,47,0.55),inset_0_1px_0_rgba(255,255,255,0.25)] active:scale-95 transition-transform"
              aria-label="Demander un devis"
            >
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" aria-hidden />
              <FileText size={22} strokeWidth={2.4} className="relative" />
              <span className="sr-only">Demander un devis</span>
            </Link>
          </li>

          {/* Items à droite */}
          {ITEMS.slice(2).map((item) => (
            <BottomNavItem key={item.href} item={item} active={!!item.match?.(pathname)} />
          ))}
        </ul>

        {/* Label du CTA central — visible sous la bulle */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-1 text-[0.55rem] font-bold tracking-[0.08em] uppercase text-brand-500 pointer-events-none">
          Devis
        </div>
      </nav>
    </>
  );
}

function BottomNavItem({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <li>
      <Link
        href={item.href}
        className={`relative flex flex-col items-center justify-center gap-0.5 h-[56px] px-1 transition-colors ${
          active ? "text-brand-500" : "text-ink-400 hover:text-ink-700"
        }`}
        aria-current={active ? "page" : undefined}
      >
        {active && (
          <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b-full bg-gradient-to-r from-brand-400 via-brand-500 to-brand-400" aria-hidden />
        )}
        <Icon
          size={20}
          strokeWidth={active ? 2.4 : 2}
          className={`transition-transform ${active ? "scale-110" : "group-hover:scale-105"}`}
        />
        <span className={`text-[0.62rem] font-bold tracking-[0.02em] transition-all ${active ? "opacity-100" : "opacity-75"}`}>
          {item.label}
        </span>
      </Link>
    </li>
  );
}
