"use client";

import { useEffect, useRef, useState } from "react";
import { LinkPreviewCard, LinkPreviewSkeleton, type LinkPreview } from "./LinkPreviewCard";

type Props = {
  content: string;
  onChange: (preview: LinkPreview | null) => void;
};

const URL_REGEX = /https?:\/\/[^\s<>"']+/i;
const DEBOUNCE_MS = 700;

// Domaines internes (bisecco.eu / bisecco.fr) → on n'affiche pas d'aperçu OG,
// les liens internes sont déjà rendus cliquables côté serveur via LinkifiedText
const INTERNAL_HOSTS = new Set([
  "bisecco.eu",
  "www.bisecco.eu",
  "bisecco.fr",
  "www.bisecco.fr",
]);

/**
 * Détecte la 1ʳᵉ URL dans le contenu d'un post pendant la rédaction et fetch
 * son aperçu Open Graph via /api/link-preview.
 *
 * - Debounce 700 ms : ne bombarde pas l'API à chaque touche
 * - L'utilisateur peut retirer l'aperçu via le X → l'URL reste dans le texte,
 *   on note l'URL "dismissed" pour ne pas la re-fetcher tant que l'user n'en
 *   colle pas une autre
 *
 * Communique le résultat au parent (FeedComposer) via onChange.
 */
export function FeedComposerLinkDetector({ content, onChange }: Props) {
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const dismissedRef = useRef<Set<string>>(new Set());
  const lastFetchedRef = useRef<string | null>(null);

  useEffect(() => {
    const match = content.match(URL_REGEX);
    const url = match?.[0] ?? null;

    // Plus d'URL → reset
    if (!url) {
      setPreview(null);
      setLoading(false);
      lastFetchedRef.current = null;
      onChange(null);
      return;
    }

    // URL retirée volontairement par l'user (clic sur X)
    if (dismissedRef.current.has(url)) return;

    // Filtre liens internes
    try {
      const host = new URL(url).hostname.toLowerCase();
      if (INTERNAL_HOSTS.has(host)) {
        setPreview(null);
        setLoading(false);
        lastFetchedRef.current = null;
        onChange(null);
        return;
      }
    } catch {
      return;
    }

    // Déjà fetchée → ne pas refaire
    if (lastFetchedRef.current === url) return;

    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      lastFetchedRef.current = url;
      fetch(`/api/link-preview?url=${encodeURIComponent(url)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((data) => {
          if (!data || data.error) {
            setPreview(null);
            onChange(null);
            return;
          }
          const p: LinkPreview = {
            url,
            title: data.title || null,
            description: data.description || null,
            image: data.image || null,
            siteName: data.siteName || null,
            favicon: data.favicon,
          };
          setPreview(p);
          onChange(p);
        })
        .catch(() => {
          setPreview(null);
          onChange(null);
        })
        .finally(() => setLoading(false));
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [content, onChange]);

  const handleDismiss = () => {
    if (preview) dismissedRef.current.add(preview.url);
    setPreview(null);
    onChange(null);
  };

  if (loading && !preview) return <LinkPreviewSkeleton />;
  if (!preview) return null;

  return <LinkPreviewCard preview={preview} onRemove={handleDismiss} />;
}
