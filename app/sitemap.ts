import type { MetadataRoute } from "next";
import { METIER_OPTIONS } from "@/lib/metiers";
import { JOB_OFFERS } from "@/lib/emploi";
import { BLOG_POSTS } from "@/lib/blog";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { artisanProfilePath } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // 1h

const BASE = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://bisecco.fr";

const CITIES = [
  "meaux", "chelles", "lagny-sur-marne", "melun", "pontault-combault",
  "noisy-le-grand", "bussy-saint-georges", "champs-sur-marne", "torcy",
  "coulommiers", "provins", "fontainebleau", "paris", "versailles",
  "argenteuil", "cergy", "pontoise", "saint-germain-en-laye", "rueil-malmaison",
  "lille", "lyon", "marseille", "bordeaux", "toulouse", "nantes",
  "cannes", "nice", "antibes", "grasse", "menton", "monaco",
  "strasbourg", "metz", "nancy", "reims", "dijon", "rennes",
  "saint-malo", "le-mans", "tours", "orleans", "clermont-ferrand",
  "limoges", "poitiers", "la-rochelle", "angouleme",
];

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function fetchApprovedArtisans(): Promise<{ name: string; client_number: string; updated_at: string }[]> {
  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("users")
      .select("name, client_number, updated_at, artisan_profiles(company_name)")
      .eq("role", "artisan")
      .eq("validation_status", "approved")
      .not("client_number", "is", null)
      .is("deleted_at", null)
      .limit(5000);
    type Row = {
      name: string;
      client_number: string;
      updated_at: string;
      artisan_profiles?: { company_name: string | null } | { company_name: string | null }[] | null;
    };
    return ((data ?? []) as Row[]).map((r) => {
      const profile = Array.isArray(r.artisan_profiles) ? r.artisan_profiles[0] : r.artisan_profiles;
      const companyName = profile?.company_name?.trim();
      return {
        name: companyName || r.name, // priorité au nom de société pour le slug
        client_number: r.client_number,
        updated_at: r.updated_at,
      };
    });
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ─── Pages statiques ────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                                lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/rechercher`,                lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/metiers`,                   lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/blog`,                      lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/avis`,                      lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE}/emploi`,                    lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/emploi/poster`,             lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/comparateur`,               lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/partenaires`,               lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/qui-sommes-nous`,           lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`,                   lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/aide`,                      lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/mentions-legales`,          lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/politique-confidentialite`, lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/cgv`,                       lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/politique-remboursement`,   lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  // ─── Pages métier (~80 métiers) ─────────────────────────────────────────
  const metierPages: MetadataRoute.Sitemap = METIER_OPTIONS.map((m) => ({
    url: `${BASE}/metiers/${slugify(m.name)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // ─── Pages locales métier × ville (~80 × 50 = 4000 pages) ──────────────
  const localPages: MetadataRoute.Sitemap = [];
  for (const m of METIER_OPTIONS) {
    const metierSlug = slugify(m.name);
    for (const city of CITIES) {
      localPages.push({
        url: `${BASE}/artisans/${metierSlug}/${city}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      });
    }
  }

  // ─── Offres d'emploi ────────────────────────────────────────────────────
  const jobPages: MetadataRoute.Sitemap = JOB_OFFERS.map((j) => ({
    url: `${BASE}/emploi/${j.id}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // ─── Articles blog ──────────────────────────────────────────────────────
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  // ─── Profils artisans approuvés (live Supabase) ─────────────────────────
  const artisans = await fetchApprovedArtisans();
  const artisanPages: MetadataRoute.Sitemap = artisans.map((a) => ({
    url: `${BASE}${artisanProfilePath(a.name, a.client_number)}`,
    lastModified: a.updated_at ? new Date(a.updated_at) : now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...metierPages,
    ...localPages,
    ...jobPages,
    ...blogPages,
    ...artisanPages,
  ];
}
