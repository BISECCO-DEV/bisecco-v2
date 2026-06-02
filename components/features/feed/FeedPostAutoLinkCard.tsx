"use client";

import { useEffect, useState } from "react";
import { LinkPreviewCard, LinkPreviewSkeleton, type LinkPreview } from "./LinkPreviewCard";

const URL_REGEX = /https?:\/\/[^\s<>"']+/i;
const INTERNAL_HOSTS = new Set([
  "bisecco.eu",
  "www.bisecco.eu",
  "bisecco.fr",
  "www.bisecco.fr",
]);

/**
 * Détecte la 1ʳᵉ URL externe dans le texte d'un post et fetch son aperçu OG
 * côté client. Utilisé pour les posts où l'auteur n'a pas eu la détection
 * live au moment de publier (anciens posts, OG capturé en échec, etc.).
 *
 * Mise en cache navigateur 24h via les headers de /api/link-preview.
 *
 * Si l'URL est interne (bisecco.eu/.fr) → pas de carte (le lien est déjà
 * cliquable in-app via LinkifiedText).
 */
export function FeedPostAutoLinkCard({ content }: { content: string }) {
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const match = content.match(URL_REGEX);
    const rawUrl = match?.[0];
    if (!rawUrl) return;

    // Nettoyage ponctuation trailing
    const trail = rawUrl.match(/[.,;!?)\]]+$/)?.[0] ?? "";
    const url = trail ? rawUrl.slice(0, -trail.length) : rawUrl;

    // Filtre liens internes
    try {
      const host = new URL(url).hostname.toLowerCase();
      if (INTERNAL_HOSTS.has(host)) return;
    } catch {
      return;
    }

    setLoading(true);
    const ctrl = new AbortController();
    fetch(`/api/link-preview?url=${encodeURIComponent(url)}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((data) => {
        if (!data || data.error) return;
        setPreview({
          url,
          title: data.title || null,
          description: data.description || null,
          image: data.image || null,
          siteName: data.siteName || null,
          favicon: data.favicon,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [content]);

  const handleOpen = () => {
    if (!preview) return;
    window.dispatchEvent(new CustomEvent("bisecco:open-link", { detail: { url: preview.url } }));
  };

  if (loading && !preview) return <LinkPreviewSkeleton />;
  if (!preview) return null;

  return <LinkPreviewCard preview={preview} onClick={handleOpen} />;
}
