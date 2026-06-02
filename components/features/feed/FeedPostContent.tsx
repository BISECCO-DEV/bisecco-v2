"use client";

import { useState } from "react";
import { LinkifiedText } from "./LinkifiedText";

const TRUNCATE_THRESHOLD = 280;

/**
 * Texte d'un post avec troncature style LinkedIn :
 * - Si le contenu fait + de 280 chars OU + de 4 lignes → coupé après ~3 lignes
 *   avec un "… voir plus" inline cliquable
 * - Une fois étendu → "voir moins" à la fin pour replier
 *
 * LinkifiedText est utilisé dans les 2 cas pour les URLs cliquables.
 */
export function FeedPostContent({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);

  const lineCount = content.split("\n").length;
  const needsTruncate = content.length > TRUNCATE_THRESHOLD || lineCount > 4;

  // Pas besoin de tronquer → render simple
  if (!needsTruncate) {
    return (
      <LinkifiedText className="text-[0.96rem] text-ink-700 leading-[1.65] whitespace-pre-wrap break-words">
        {content}
      </LinkifiedText>
    );
  }

  if (expanded) {
    return (
      <>
        <LinkifiedText className="text-[0.96rem] text-ink-700 leading-[1.65] whitespace-pre-wrap break-words">
          {content}
        </LinkifiedText>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mt-2 text-[0.86rem] font-bold text-ink-500 hover:text-brand-600 transition"
        >
          voir moins
        </button>
      </>
    );
  }

  // Coupé : 3 lignes max OU ~280 chars
  // On laisse le CSS gérer avec line-clamp pour fluidité responsive
  return (
    <div className="relative">
      <LinkifiedText className="text-[0.96rem] text-ink-700 leading-[1.65] whitespace-pre-wrap break-words line-clamp-3">
        {content}
      </LinkifiedText>
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="mt-1 text-[0.86rem] font-bold text-ink-500 hover:text-brand-600 transition"
      >
        … <span className="underline">voir plus</span>
      </button>
    </div>
  );
}
