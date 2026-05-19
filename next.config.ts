import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Limite d'upload des Server Actions (par défaut 1 Mo, on monte à 6 Mo pour
  // matcher la limite du bucket Supabase Storage à 5 Mo + petit buffer).
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  // Optimisations images : autorise les CDN externes utilisés
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "bisecco.fr" },
      { protocol: "https", hostname: "www.bisecco.fr" },
    ],
  },
  // Cache & headers SEO globaux
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      // Pages admin / protégées : pas de cache CDN
      {
        source: "/(admin|mon-profil|messagerie|supabase-test)/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },
  // Compression standard
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
