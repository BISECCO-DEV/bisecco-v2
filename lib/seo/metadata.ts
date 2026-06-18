import type { Metadata } from "next";

/**
 * Construit un objet `metadata` cohérent pour une page.
 *
 * - `title` : titre de la page SANS suffixe « | Bisecco ». Le `title.template`
 *   du layout racine (`%s | Bisecco`) ajoute la marque UNE seule fois.
 *   → ne jamais remettre « Bisecco » ici (sinon double « | Bisecco | Bisecco »).
 * - `openGraph.title` / `twitter.title` sont renseignés avec le titre de la page
 *   (au lieu du générique hérité du layout racine).
 * - `alternates.canonical` est posé à partir de `path` (chemin relatif, résolu
 *   contre `metadataBase`).
 *
 * Pour un titre exact qui ne doit PAS recevoir le template (« Bisecco Pro »…),
 * passer `absoluteTitle: true` → utilise `title: { absolute }`.
 */
export type BuildMetadataInput = {
  /** Titre de la page, sans « | Bisecco ». */
  title: string;
  description?: string;
  /** Chemin relatif pour canonical + og:url (ex. "/fil"). */
  path?: string;
  /** Images OG/Twitter (défaut : og-image global). */
  images?: string[];
  /** Titre exact sans template (utilise title.absolute). */
  absoluteTitle?: boolean;
  noindex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  images,
  absoluteTitle,
  noindex,
}: BuildMetadataInput): Metadata {
  const ogImages = (images ?? ["/og-image.jpg?v=3"]).map((url) => ({ url }));

  return {
    title: absoluteTitle ? { absolute: title } : title,
    ...(description ? { description } : {}),
    ...(path ? { alternates: { canonical: path } } : {}),
    openGraph: {
      title,
      ...(description ? { description } : {}),
      ...(path ? { url: path } : {}),
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      ...(description ? { description } : {}),
      images: ogImages.map((i) => i.url),
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
