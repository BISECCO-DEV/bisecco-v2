"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Auto-refresh du fil Actu toutes les `intervalMs` (10 sec par défaut).
 *
 * Appelle router.refresh() — Next.js re-fetch les Server Components et
 * remplace silencieusement le HTML sans flicker (pas de full reload, pas
 * de scroll position perdue, pas d'état client réinitialisé).
 *
 * Optimisations :
 *  - Pause si l'onglet est masqué (économise CPU + bande passante)
 *  - Pause si la fenêtre n'a pas le focus depuis 2 min (utilisateur inactif)
 *  - Refresh immédiat quand l'onglet revient au premier plan
 */
export function FeedAutoRefresh({ intervalMs = 10000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    let lastFocusAt = Date.now();

    const tick = () => {
      if (document.visibilityState !== "visible") return;
      // Inactivité > 2 min → on suspend (l'user reviendra avec visibilitychange)
      if (Date.now() - lastFocusAt > 2 * 60 * 1000) return;
      router.refresh();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        lastFocusAt = Date.now();
        router.refresh(); // refresh immédiat au retour
      }
    };

    const onActivity = () => {
      lastFocusAt = Date.now();
    };

    const id = setInterval(tick, intervalMs);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onActivity);
    window.addEventListener("mousemove", onActivity, { passive: true });
    window.addEventListener("touchstart", onActivity, { passive: true });

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onActivity);
      window.removeEventListener("mousemove", onActivity);
      window.removeEventListener("touchstart", onActivity);
    };
  }, [router, intervalMs]);

  return null;
}
