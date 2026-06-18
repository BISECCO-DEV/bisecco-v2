/**
 * Helpers de génération de JSON-LD schema.org pour les rich snippets Google.
 * À utiliser en duo avec <JsonLd> de components/ui/JsonLd.tsx.
 */

const BASE = "https://bisecco.fr";

/**
 * Schema Organization · à mettre sur la HOMEPAGE uniquement.
 *
 * Effets dans les SERP Google :
 *   - Logo de Bisecco affiché dans le panneau de connaissances (Knowledge Panel)
 *   - Liens vers réseaux sociaux affichés (sameAs)
 *   - Coordonnées de l'entreprise affichées
 *   - Boîte de recherche "site search" dans Google (potentialAction)
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE}#organization`,
    name: "Bisecco",
    alternateName: ["Bisecco.fr", "Bisecco réseau professionnels"],
    url: BASE,
    logo: {
      "@type": "ImageObject",
      url: `${BASE}/logo.png`,
      width: 512,
      height: 512,
    },
    description:
      "1er réseau social des Professionnels français vérifiés SIREN. " +
      "Trouvez un professionnel qualifié près de chez vous, comparez les devis, " +
      "consultez les avis authentiques. 100% gratuit, 0% commission.",
    foundingDate: "2026-01-01",
    founder: {
      "@type": "Person",
      name: "Laurent Nero",
    },
    legalName: "AGISCO HOLDING SAS",
    email: "contact@bisecco.fr",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cannes",
      postalCode: "06400",
      addressCountry: "FR",
    },
    areaServed: { "@type": "Country", name: "France" },
    sameAs: [
      // Décommente / ajoute tes vrais profils ici quand ils existent
      // "https://www.linkedin.com/company/bisecco",
      // "https://www.facebook.com/bisecco",
      // "https://www.instagram.com/bisecco",
      // "https://twitter.com/bisecco",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "contact@bisecco.fr",
        availableLanguage: ["French"],
        areaServed: "FR",
      },
    ],
  };
}

/**
 * Schema WebSite · à mettre sur la HOMEPAGE uniquement.
 *
 * Effets dans les SERP Google :
 *   - Barre de recherche directement intégrée sous le titre Bisecco
 *     (les gens peuvent chercher "plombier" depuis Google sans cliquer)
 *   - Sitelinks (liens vers /metiers, /rechercher, etc.)
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}#website`,
    name: "Bisecco",
    url: BASE,
    description:
      "Réseau social des professionnels français vérifiés SIREN. Annuaire de professionnels, " +
      "devis gratuits, avis clients authentiques.",
    publisher: {
      "@id": `${BASE}#organization`,
    },
    inLanguage: "fr-FR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE}/rechercher?metier={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Schema AggregateRating · agrégat des notes sur l'ensemble du site.
 *
 * Effets dans les SERP Google :
 *   - Étoiles ★★★★★ visibles directement dans les résultats Google
 *   - CTR multiplié par 2-3× (gros impact trafic)
 *
 * À utiliser SEULEMENT si tu as au moins ~5 avis réels sur la plateforme.
 * Google peut pénaliser les fake reviews → utilise vraies stats DB.
 *
 * @param ratingValue Note moyenne (1-5)
 * @param reviewCount Nombre total d'avis
 */
export function aggregateRatingSchema(ratingValue: number, reviewCount: number) {
  // Google n'affiche les étoiles que si bestRating, worstRating et ratingValue sont cohérents
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE}#organization-ratings`,
    name: "Bisecco",
    url: BASE,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: ratingValue.toFixed(1),
      reviewCount: reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export type BreadcrumbItem = {
  name: string;
  url: string;
};

/**
 * Génère un schema BreadcrumbList. Le dernier item ne devrait PAS avoir d'URL
 * (page courante) mais on en met une par cohérence · Google supporte les 2.
 */
export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE}${item.url}`,
    })),
  };
}

export type FaqItem = {
  question: string;
  answer: string;
};

/**
 * Génère un schema FAQPage. Limite Google : 3-10 questions max pour rich snippet.
 */
export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export type ArticleSchemaInput = {
  url: string;
  title: string;
  description: string;
  image?: string;
  authorName: string;
  publishedAt: string;
  modifiedAt?: string;
  category?: string;
};

export function articleSchema(input: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": input.url.startsWith("http") ? input.url : `${BASE}${input.url}`,
    headline: input.title,
    description: input.description,
    image: input.image ? [input.image] : [`${BASE}/og-image.jpg`],
    datePublished: input.publishedAt,
    dateModified: input.modifiedAt ?? input.publishedAt,
    author: {
      "@type": "Person",
      name: input.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Bisecco",
      logo: {
        "@type": "ImageObject",
        url: `${BASE}/logo.jpg`,
      },
    },
    articleSection: input.category,
    inLanguage: "fr-FR",
  };
}

export type JobPostingSchemaInput = {
  url: string;
  title: string;
  description: string;
  metier: string;
  company: string;
  city: string;
  postalCode?: string;
  contractType: "FULL_TIME" | "PART_TIME" | "CONTRACTOR" | "TEMPORARY" | "INTERN" | "VOLUNTEER" | "PER_DIEM" | "OTHER";
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod?: "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";
  postedAt: string;
  validThrough: string;
  applications?: number;
};

export function jobPostingSchema(input: JobPostingSchemaInput) {
  const hasSalary = input.salaryMin || input.salaryMax;
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "@id": input.url.startsWith("http") ? input.url : `${BASE}${input.url}`,
    title: input.title,
    description: input.description,
    datePosted: input.postedAt,
    validThrough: input.validThrough,
    employmentType: input.contractType,
    industry: input.metier,
    occupationalCategory: input.metier,
    hiringOrganization: {
      "@type": "Organization",
      name: input.company,
      sameAs: BASE,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: input.city,
        postalCode: input.postalCode,
        addressCountry: "FR",
      },
    },
    ...(hasSalary && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: "EUR",
        value: {
          "@type": "QuantitativeValue",
          minValue: input.salaryMin,
          maxValue: input.salaryMax,
          unitText: input.salaryPeriod ?? "YEAR",
        },
      },
    }),
    directApply: true,
  };
}
