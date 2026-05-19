"use client";

import dynamic from "next/dynamic";

/** Wrapper pour charger Leaflet uniquement côté client (pas de SSR) */
export const ArtisansMap = dynamic(
  () => import("./ArtisansMap").then((m) => m.ArtisansMap),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-ink-100 shadow-card h-[500px] bg-ink-50 flex items-center justify-center">
        <span className="text-ink-400">Chargement de la carte…</span>
      </div>
    ),
  }
);
