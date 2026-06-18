"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { GlobalSearch } from "./GlobalSearch";
import type { MetierOption } from "@/lib/metiers";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { MobileMenu } from "./MobileMenu";
import { UserMenu, type UserMenuProps } from "./UserMenu";
import { MAIN_NAV, filterNavForUser, isActive } from "@/lib/nav";

type HeaderProps = {
  user: UserMenuProps["user"];
  unreadNotifications?: number;
  currentUserId?: number | null;
  metierOptions?: MetierOption[];
  unreadCvs?: number;
};

// Pages où le header doit être TRANSPARENT en haut (hero overlay)
// puis devient navy opaque au scroll.
const OVERLAY_HERO_ROUTES = ["/"];

const SCROLL_THRESHOLD = 24;

export function Header({ user, unreadNotifications = 0, currentUserId = null, metierOptions, unreadCvs = 0 }: HeaderProps) {
  const pathname = usePathname();
  const isOverlayPage = OVERLAY_HERO_ROUTES.includes(pathname);
  const isAdminPage = pathname?.startsWith("/admin") ?? false;
  const isComingSoon = pathname?.startsWith("/coming-soon") ?? false;

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Sur les pages non-overlay, l'état "scrolled" est toujours true (header opaque)
    if (!isOverlayPage) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOverlayPage]);

  // Sur les pages /admin et /coming-soon, on n'affiche PAS le Header global
  if (isAdminPage || isComingSoon) return null;

  // En mode "overlay" non-scrollé : tout transparent (header + ticker)
  // Sinon : navy opaque avec backdrop blur
  const isTransparent = isOverlayPage && !scrolled;

  return (
    <>
      {/* Ticker promo · toujours visible, masqué uniquement quand le menu mobile est ouvert */}
      <div className="promo-ticker fixed top-0 left-0 right-0 z-[52] overflow-hidden whitespace-nowrap py-2 bg-gradient-to-r from-brand-500 via-brand-600 to-brand-500 border-b border-brand-600/40 shadow-[0_1px_0_rgba(255,255,255,0.18)_inset]">
        <div className="inline-flex animate-marquee">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="px-20 text-[0.72rem] font-bold tracking-[0.04em] text-white"
            >
              🚀 Nouveau service · Rejoignez les premiers professionnels Bisecco
              <span className="mx-2 text-white/65">·</span>
              Profil vérifié SIREN, 0 % commission, contact direct.
            </span>
          ))}
        </div>
      </div>

      {/* Voile ambiant · donne de la présence au header transparent (mode overlay uniquement) */}
      {isTransparent && (
        <div
          className="fixed top-0 left-0 right-0 z-[49] h-[180px] pointer-events-none transition-opacity duration-300 lg:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,18,46,0.55) 0%, rgba(5,18,46,0.30) 50%, rgba(5,18,46,0.05) 85%, transparent 100%)",
          }}
          aria-hidden
        />
      )}

      {/* Header principal · navy au scroll, transparent sur hero */}
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          isTransparent
            ? "top-[32px] sm:top-[36px] bg-transparent border-b border-transparent shadow-none lg:bg-ink-800/95 lg:backdrop-blur-xl lg:border-white/[0.08] lg:shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_2px_12px_rgba(0,0,0,0.18)]"
            : "top-[32px] sm:top-[36px] bg-ink-800/95 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_2px_12px_rgba(0,0,0,0.18)]"
        }`}
      >
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 flex items-center h-[72px] gap-4 lg:gap-6">

          {/* Logo + tagline */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group" aria-label="Bisecco · accueil">
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/20 shadow-[0_4px_14px_rgba(0,0,0,0.4)] bg-white/95">
              <Image
                src="/logo.jpg"
                alt=""
                width={44}
                height={44}
                priority
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-display font-extrabold text-[1.18rem] tracking-[0.04em] text-white group-hover:text-brand-400 transition-colors">
              BISECCO
            </span>
          </Link>

          {/* Nav desktop · liens auth-only cachés si non connecté */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center" aria-label="Navigation principale">
            {filterNavForUser(MAIN_NAV, Boolean(user)).map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative inline-flex items-center gap-2 h-10 px-3 xl:px-4 rounded-lg text-[0.88rem] font-semibold transition ${
                    active
                      ? "text-white bg-white/[0.10]"
                      : "text-white/70 hover:text-white hover:bg-white/[0.06]"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon size={15} strokeWidth={2.2} className={active ? "text-brand-400" : "opacity-90"} />
                  <span>{item.label}</span>
                  {active && (
                    <span className="absolute left-3 right-3 -bottom-[13px] h-[3px] rounded-t bg-gradient-to-r from-brand-500 via-brand-400 to-brand-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Spacer mobile */}
          <div className="flex-1 lg:hidden" />

          {/* Actions */}
          <div className="flex items-center gap-1.5 lg:gap-2 flex-shrink-0">
            <GlobalSearch metierOptions={metierOptions} />

            <div className="hidden lg:block">
              <NotificationsDropdown unreadCount={unreadNotifications} currentUserId={currentUserId} />
            </div>

            <UserMenu user={user} unreadCvs={unreadCvs} />

            <MobileMenu user={user} />
          </div>
        </div>
      </header>

      {/* Spacer · réserve la hauteur du header pour ne pas que le contenu passe dessous.
          Sur les pages "overlay hero", le hero gère son propre layout (min-h-screen). */}
      {!isOverlayPage && <div className="h-[104px] sm:h-[108px]" aria-hidden />}
    </>
  );
}
