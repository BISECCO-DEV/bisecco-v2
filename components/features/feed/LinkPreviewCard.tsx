"use client";

import { ExternalLink, Globe, X } from "lucide-react";

export type LinkPreview = {
  url: string;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  siteName?: string | null;
  favicon?: string;
};

/**
 * Carte d'aperçu d'un lien externe (Open Graph) — style Twitter / LinkedIn.
 * Utilisée à 2 endroits :
 *   - Pendant la rédaction d'un post (FeedComposerLinkDetector) → onRemove visible
 *   - Affichage dans le fil (FeedPostCard) → cliquable, ouvre le viewer in-app
 */
export function LinkPreviewCard({
  preview,
  onRemove,
  onClick,
  compact = false,
}: {
  preview: LinkPreview;
  onRemove?: () => void;
  onClick?: () => void;
  compact?: boolean;
}) {
  const host = extractHost(preview.url);
  const favicon =
    preview.favicon ||
    `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(host)}`;

  const wrapperClass = `block w-full text-left rounded-2xl border border-ink-100 overflow-hidden bg-white ${
    onClick ? "hover:border-brand-200 hover:shadow-md transition cursor-pointer" : ""
  }`;

  const innerContent = (
      <>
        {preview.image && !compact && (
          <div className="relative w-full aspect-[1.91/1] bg-ink-50 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview.image}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        <div className={`p-3.5 flex gap-3 ${compact ? "items-center" : "flex-col"}`}>
          {compact && preview.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview.image}
              alt=""
              className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-ink-50"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={favicon}
                alt=""
                className="w-3.5 h-3.5 rounded-sm flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).outerHTML = "";
                }}
              />
              <span className="text-[0.65rem] font-bold text-ink-500 uppercase tracking-wider truncate">
                {preview.siteName || host}
              </span>
            </div>
            {preview.title && (
              <div className="font-extrabold text-ink-700 text-[0.92rem] leading-snug line-clamp-2">
                {preview.title}
              </div>
            )}
            {preview.description && !compact && (
              <p className="mt-1 text-[0.82rem] text-ink-500 leading-snug line-clamp-2">
                {preview.description}
              </p>
            )}
            {onClick && (
              <div className="mt-2 inline-flex items-center gap-1 text-[0.7rem] font-bold text-brand-600">
                <ExternalLink size={11} />
                Voir le lien
              </div>
            )}
          </div>
        </div>
    </>
  );

  return (
    <div className="relative group">
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-ink-900/85 hover:bg-red-500 text-white inline-flex items-center justify-center transition shadow-md"
          aria-label="Retirer l'aperçu"
        >
          <X size={13} />
        </button>
      )}

      {onClick ? (
        <button type="button" onClick={onClick} className={wrapperClass}>
          {innerContent}
        </button>
      ) : (
        <div className={wrapperClass}>{innerContent}</div>
      )}
    </div>
  );
}

export function LinkPreviewSkeleton() {
  return (
    <div className="rounded-2xl border border-ink-100 overflow-hidden bg-white p-3.5 flex gap-3 items-center">
      <div className="w-14 h-14 rounded-lg bg-ink-100 animate-pulse flex-shrink-0 inline-flex items-center justify-center">
        <Globe size={20} className="text-ink-300" />
      </div>
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="h-2.5 bg-ink-100 rounded w-1/3 animate-pulse" />
        <div className="h-3.5 bg-ink-100 rounded w-3/4 animate-pulse" />
        <div className="h-2.5 bg-ink-100 rounded w-5/6 animate-pulse" />
      </div>
    </div>
  );
}

function extractHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
