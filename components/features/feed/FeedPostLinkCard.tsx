"use client";

import { LinkPreviewCard } from "./LinkPreviewCard";

type Props = {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
};

/**
 * Carte d'aperçu OG affichée sous le texte d'un post du fil.
 * Clic → ouvre le viewer in-app (InAppLinkViewer) via l'event custom.
 */
export function FeedPostLinkCard({ url, title, description, image, siteName }: Props) {
  const handleOpen = () => {
    window.dispatchEvent(new CustomEvent("bisecco:open-link", { detail: { url } }));
  };

  return (
    <LinkPreviewCard
      preview={{
        url,
        title: title || undefined,
        description: description || undefined,
        image: image || undefined,
        siteName: siteName || undefined,
      }}
      onClick={handleOpen}
    />
  );
}
