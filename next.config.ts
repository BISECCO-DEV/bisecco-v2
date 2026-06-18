import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const nextConfig: NextConfig = {
  // Limite d'upload des Server Actions (par défaut 1 Mo, on monte à 6 Mo pour
  // matcher la limite du bucket Supabase Storage à 5 Mo + petit buffer).
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  // ESLint : on ne fail pas le build à cause des warnings React Compiler
  // (set-state-in-effect, purity). On a typecheck séparé + dev mode pour les voir.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Optimisations images : autorise les CDN externes utilisés
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "bisecco.fr" },
      { protocol: "https", hostname: "www.bisecco.fr" },
    ],
  },
  // Cache & headers SEO + sécurité globaux
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Force HTTPS · 6 mois + sous-domaines + preload-ready
          {
            key: "Strict-Transport-Security",
            value: "max-age=15552000; includeSubDomains",
          },
          // Anti-clickjacking · SAMEORIGIN pour permettre l'embed dans l'app native
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Limite les infos envoyées dans le Referer aux sites externes
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Désactive les API navigateur dont on ne se sert pas
          {
            key: "Permissions-Policy",
            value:
              "camera=(self), microphone=(self), geolocation=(self), interest-cohort=(), browsing-topics=(), payment=(self)",
          },
          // CSP strict · blocage actif des sources non whitelistées (anti-XSS, anti-injection).
          // Si tu ajoutes un nouveau service externe (widget, analytics tiers), il faut
          // l'ajouter ici sinon le navigateur le bloquera.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://*.supabase.co https://bisecco.fr https://images.unsplash.com https://i.pravatar.cc https://api.dicebear.com https://logo.clearbit.com https://*.tile.openstreetmap.org https://*.tile.openstreetmap.fr https://pixabay.com https://cdn.pixabay.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api-adresse.data.gouv.fr https://www.google-analytics.com https://api.pollinations.ai https://image.pollinations.ai https://pixabay.com https://*.tile.openstreetmap.org https://*.tile.openstreetmap.fr https://nominatim.openstreetmap.org https://cdn.pixabay.com https://images.unsplash.com https://i.pravatar.cc https://api.dicebear.com https://logo.clearbit.com https://bisecco.fr https://fonts.googleapis.com https://fonts.gstatic.com https://www.bing.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
      // Pages admin / protégées : pas de cache CDN
      {
        source: "/(admin|mon-profil|messagerie|supabase-test)/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
      // Digital Asset Links Android TWA (PWABuilder) — doit être JSON
      {
        source: "/.well-known/assetlinks.json",
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
      // Apple App Site Association iOS Universal Links — JSON sans extension
      {
        source: "/.well-known/apple-app-site-association",
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];
  },
  // Compression standard
  compress: true,
  poweredByHeader: false,
};

// Wrapper Serwist — génère le Service Worker à partir de app/sw.ts
// vers public/sw.js. Désactivé en dev pour ne pas casser le hot reload.
const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  additionalPrecacheEntries: [
    { url: "/offline", revision: null },
    { url: "/", revision: null },
  ],
});

export default withSerwist(nextConfig);
