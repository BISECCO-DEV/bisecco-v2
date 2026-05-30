"use client";

import dynamic from "next/dynamic";

/**
 * Wrapper SSR-safe pour la carte Leaflet de la page contact.
 * react-leaflet utilise window/document, on doit donc importer dynamiquement.
 */
const Map = dynamic(() => import("./ContactMapClient").then((m) => m.ContactMapClient), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-sand-100 grid place-items-center text-sand-300 text-sm">
      Chargement de la carte…
    </div>
  ),
});

export function ContactMap() {
  return <Map />;
}
