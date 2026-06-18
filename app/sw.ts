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

// ─── Push notifications ──────────────────────────────────────────────
// Payload attendu : { title: string, body: string, url?: string, icon?: string }
self.addEventListener("push", (event: PushEvent) => {
  if (!event.data) return;
  let payload: { title: string; body?: string; url?: string; icon?: string };
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Bisecco", body: event.data.text() };
  }

  const title = payload.title || "Bisecco";
  const options: NotificationOptions = {
    body: payload.body ?? "",
    icon: payload.icon ?? "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: { url: payload.url ?? "/mon-profil/notifications" },
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();
  const url = (event.notification.data?.url as string | undefined) ?? "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      // Si une fenêtre Bisecco est déjà ouverte → la focus + navigate
      for (const c of clients) {
        if ("focus" in c && c.url.includes(self.location.origin)) {
          (c as WindowClient).navigate(url);
          return (c as WindowClient).focus();
        }
      }
      // Sinon ouvrir une nouvelle fenêtre
      return self.clients.openWindow(url);
    }),
  );
});
