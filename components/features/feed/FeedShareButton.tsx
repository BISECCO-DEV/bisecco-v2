"use client";

import { useState } from "react";
import { Share2, Check, Link as LinkIcon } from "lucide-react";

type Props = {
  postId: number;
  excerpt: string;
};

export function FeedShareButton({ postId, excerpt }: Props) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined"
    ? `${window.location.origin}/fil/${postId}`
    : `/fil/${postId}`;

  const share = async () => {
    const shareData = {
      title: "Publication Bisecco",
      text: excerpt.slice(0, 140) + (excerpt.length > 140 ? "…" : ""),
      url,
    };

    // Web Share API (mobile principalement)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Annulation par l'user · on tombe en fallback copy
      }
    }

    // Fallback : copie dans le presse-papier
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Si même le clipboard échoue (vieux navigateurs / contextes non-sécurisés)
      window.prompt("Copiez ce lien :", url);
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-1.5 px-3 py-2.5 text-[0.85rem] font-semibold text-ink-500 hover:bg-ink-50 hover:text-ink-700 rounded-lg transition"
      aria-label="Partager"
      title="Partager cette publication"
    >
      {copied ? (
        <>
          <Check size={16} className="text-emerald-500" />
          <span className="text-emerald-600">Lien copié</span>
        </>
      ) : (
        <>
          <Share2 size={16} />
          Partager
        </>
      )}
    </button>
  );
}
