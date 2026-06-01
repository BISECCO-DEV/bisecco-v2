"use client";

import dynamic from "next/dynamic";

/**
 * Wrapper client qui lazy-load tous les widgets globaux non-critiques pour le LCP.
 * Réduit le JS render-blocking : ces composants sont chargés APRÈS le main content.
 *
 * Effet PageSpeed : -94 Kio JS render-blocking → meilleur FCP/LCP mobile.
 */

const MobileBottomNav = dynamic(
  () => import("./MobileBottomNav").then((m) => m.MobileBottomNav),
  { ssr: false, loading: () => null },
);

const StickyMobileCTA = dynamic(
  () => import("./StickyMobileCTA").then((m) => m.StickyMobileCTA),
  { ssr: false, loading: () => null },
);

const CookieBanner = dynamic(
  () => import("./CookieBanner").then((m) => m.CookieBanner),
  { ssr: false, loading: () => null },
);

const Chatbot = dynamic(
  () => import("./Chatbot").then((m) => m.Chatbot),
  { ssr: false, loading: () => null },
);

const ScrollToTop = dynamic(
  () => import("@/components/ui/ScrollToTop").then((m) => m.ScrollToTop),
  { ssr: false, loading: () => null },
);

const ServiceWorkerRegister = dynamic(
  () => import("@/components/ui/ServiceWorkerRegister").then((m) => m.ServiceWorkerRegister),
  { ssr: false, loading: () => null },
);

export function GlobalClientWidgets() {
  return (
    <>
      <MobileBottomNav />
      <StickyMobileCTA />
      <CookieBanner />
      <Chatbot />
      <ScrollToTop />
      <ServiceWorkerRegister />
    </>
  );
}
