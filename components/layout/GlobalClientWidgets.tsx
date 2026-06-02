"use client";

import dynamic from "next/dynamic";

/**
 * Wrapper client qui lazy-load tous les widgets globaux non-critiques pour le LCP.
 * Réduit le JS render-blocking : ces composants sont chargés APRÈS le main content.
 *
 * Effet PageSpeed : -94 Kio JS render-blocking → meilleur FCP/LCP mobile.
 */

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

const PwaInstallPrompt = dynamic(
  () => import("./PwaInstallPrompt").then((m) => m.PwaInstallPrompt),
  { ssr: false, loading: () => null },
);

const InAppLinkViewer = dynamic(
  () => import("./InAppLinkViewer").then((m) => m.InAppLinkViewer),
  { ssr: false, loading: () => null },
);

const MessageriedDock = dynamic(
  () => import("./MessageriedDock").then((m) => m.MessageriedDock),
  { ssr: false, loading: () => null },
);

const InviteFab = dynamic(
  () => import("./InviteFab").then((m) => m.InviteFab),
  { ssr: false, loading: () => null },
);

export function GlobalClientWidgets({
  currentUserId,
  referralUrl,
}: {
  currentUserId: number | null;
  referralUrl: string | null;
}) {
  return (
    <>
      <CookieBanner />
      <Chatbot currentUserId={currentUserId} />
      <ScrollToTop />
      <ServiceWorkerRegister />
      <PwaInstallPrompt />
      <InAppLinkViewer />
      <MessageriedDock currentUserId={currentUserId} />
      <InviteFab referralUrl={referralUrl} />
    </>
  );
}
