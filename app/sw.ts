/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "serwist";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";

/**
 * Service Worker source — compilé par @serwist/next à /sw.js.
 *
 * Stratégies par défaut de defaultCache :
 *  - HTML/navigation  → NetworkFirst (fallback cache si offline)
 *  - JS/CSS Next.js   → StaleWhileRevalidate
 *  - Images & fonts   → CacheFirst (1 an)
 *  - API routes       → NetworkOnly (jamais cachées)
 *
 * Désactivé en dev via le flag `disable` de withSerwist dans next.config.ts.
 */

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher: ({ request }) => request.destination === "document",
      },
    ],
  },
});

serwist.addEventListeners();
