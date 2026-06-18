import type { MetadataRoute } from "next";

/**
 * Web App Manifest — typé via Next.js (App Router).
 * Servi automatiquement à /manifest.webmanifest.
 *
 * Remplace l'ancien public/manifest.json (supprimé).
 * Couleurs : navy #0d1e4a (fond) + orange #f07a2f (thème).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bisecco · Le réseau social des professionnels français",
    short_name: "Bisecco",
    description:
      "Trouvez un professionnel qualifié et vérifié près de chez vous. SIREN contrôlé, avis authentiques, devis gratuit. 100% gratuit, 0% commission.",
    start_url: "/",
    scope: "/",
    id: "/?source=pwa",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
    orientation: "any",
    background_color: "#0d1e4a",
    theme_color: "#f07a2f",
    lang: "fr-FR",
    dir: "ltr",
    categories: ["business", "lifestyle", "social"],
    prefer_related_applications: false,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-192-maskable.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
    // Screenshots PWA · à ajouter quand on aura les vraies captures
    // (sinon Chrome affiche des 404 dans la console).
    // screenshots: [...],
    shortcuts: [
      { name: "Trouver un professionnel", short_name: "Rechercher", url: "/rechercher", description: "Recherche carte interactive de professionnels vérifiés" },
      { name: "Demander un devis", short_name: "Devis", url: "/devis", description: "Devis gratuit en 2 minutes" },
      { name: "Fil d'actualité", short_name: "Actu", url: "/fil", description: "Communauté Bisecco en direct" },
      { name: "Mes messages", short_name: "Messages", url: "/messagerie", description: "Discussion avec mes professionnels" },
    ],
  };
}
