export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; author?: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: "Guide" | "Sécurité" | "Tendances" | "Conseils" | "Métiers" | "Législation";
  author: { name: string; avatar: string; role: string };
  date: string;
  dateIso: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  content: ContentBlock[];
};

/**
 * Pool d'articles legacy (vidé le 2026-06-05).
 * Les articles sont désormais stockés en DB (table public.blog_posts) et
 * publiés via le panneau admin. Cette liste reste un fallback vide pour les
 * helpers historiques (findPost, relatedPosts, sitemap).
 */
export const BLOG_POSTS: BlogPost[] = [];

export const CATEGORIES = [
  "Tous", "Guide", "Sécurité", "Tendances", "Conseils", "Métiers", "Législation",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function findPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function relatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = findPost(slug);
  if (!current) return BLOG_POSTS.slice(0, limit);
  const sameCategory = BLOG_POSTS.filter((p) => p.slug !== slug && p.category === current.category);
  const others = BLOG_POSTS.filter((p) => p.slug !== slug && p.category !== current.category);
  return [...sameCategory, ...others].slice(0, limit);
}
