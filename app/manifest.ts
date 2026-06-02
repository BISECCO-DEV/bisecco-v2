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
    name: "Bisecco · Le réseau social des artisans français",
    short_name: "Bisecco",
    description:
      "Trouvez un artisan qualifié et vérifié près de chez vous. SIREN contrôlé, avis authentiques, devis gratuit. 100% gratuit, 0% commission.",
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
    screenshots: [
      { src: "/screenshots/mobile-home.png", sizes: "1080x1920", type: "image/png", form_factor: "narrow", label: "Accueil Bisecco sur mobile" },
      { src: "/screenshots/mobile-rechercher.png", sizes: "1080x1920", type: "image/png", form_factor: "narrow", label: "Recherche d'artisans" },
      { src: "/screenshots/mobile-actu.png", sizes: "1080x1920", type: "image/png", form_factor: "narrow", label: "Fil d'actualité" },
      { src: "/screenshots/desktop-home.png", sizes: "1920x1080", type: "image/png", form_factor: "wide", label: "Accueil sur ordinateur" },
      { src: "/screenshots/desktop-rechercher.png", sizes: "1920x1080", type: "image/png", form_factor: "wide", label: "Recherche d'artisans sur ordinateur" },
    ],
    shortcuts: [
      { name: "Trouver un artisan", short_name: "Rechercher", url: "/rechercher", description: "Recherche carte interactive d'artisans vérifiés" },
      { name: "Demander un devis", short_name: "Devis", url: "/devis", description: "Devis gratuit en 2 minutes" },
      { name: "Fil d'actualité", short_name: "Actu", url: "/fil", description: "Communauté Bisecco en direct" },
      { name: "Mes messages", short_name: "Messages", url: "/messagerie", description: "Discussion avec mes artisans" },
    ],
  };
}
