import { MetadataRoute } from "next";
import { METIER_OPTIONS } from "@/lib/metiers";
import { JOB_OFFERS } from "@/lib/emploi";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://bisecco.fr";

const CITIES = [
  "meaux", "chelles", "lagny-sur-marne", "melun", "pontault-combault",
  "noisy-le-grand", "bussy-saint-georges", "champs-sur-marne", "torcy",
  "coulommiers", "provins", "fontainebleau", "paris", "versailles",
  "argenteuil", "cergy", "pontoise", "saint-germain-en-laye", "rueil-malmaison",
  "lille", "lyon", "marseille", "bordeaux", "toulouse", "nantes",
];

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                                lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/rechercher`,                lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/metiers`,                   lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/blog`,                      lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/avis`,                      lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE}/emploi`,                    lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/emploi/poster`,             lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/qui-sommes-nous`,           lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`,                   lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/mentions-legales`,          lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/politique-confidentialite`, lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/cgv`,                       lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/politique-remboursement`,   lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  const metierPages: MetadataRoute.Sitemap = METIER_OPTIONS.map((m) => ({
    url: `${BASE}/metiers/${slugify(m.name)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

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

  const jobPages: MetadataRoute.Sitemap = JOB_OFFERS.map((j) => ({
    url: `${BASE}/emploi/${j.id}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...metierPages, ...localPages, ...jobPages];
}
