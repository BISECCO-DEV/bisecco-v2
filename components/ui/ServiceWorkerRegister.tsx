"use client";

import { useEffect } from "react";

/**
 * Enregistre le Service Worker généré par Serwist (à /sw.js).
 * Ne fait rien en dev pour ne pas interférer avec HMR / hot reload.
 *
 * Note : `app/sw.ts` est compilé automatiquement par @serwist/next vers
 * `public/sw.js` au build. Voir next.config.ts.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((err) => console.warn("[Serwist] SW register failed", err));
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}
