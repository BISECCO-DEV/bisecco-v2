/**
 * Helpers de génération de JSON-LD schema.org pour les rich snippets Google.
 * À utiliser en duo avec <JsonLd> de components/ui/JsonLd.tsx.
 */

const BASE = "https://bisecco.fr";

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
