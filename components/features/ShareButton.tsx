"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

type Props = {
  title: string;
  text?: string;
  url?: string;
  className?: string;
};

export function ShareButton({ title, text, url, className = "" }: Props) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
    const shareData = { title, text: text ?? title, url: shareUrl };

    // Mobile : API native (iOS Safari, Chrome Android, Edge, etc.)
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // L'utilisateur a annulé OU navigator.share a échoué → on retombe sur le menu desktop
        if ((err as Error).name === "AbortError") return;
      }
    }

    // Desktop : ouvre le menu de partage custom
    setOpen(true);
  };

  const copyLink = async () => {
    const shareUrl = url || window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => { setCopied(false); setOpen(false); }, 1500);
    } catch {
      // Fallback ultra-ancien : prompt
      window.prompt("Copiez le lien :", shareUrl);
    }
  };

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const encUrl = encodeURIComponent(shareUrl);
  const encTitle = encodeURIComponent(title);

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        className={className || "w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-ink-700 hover:bg-white shadow-card transition"}
        aria-label="Partager"
        title="Partager"
      >
        <Share2 size={16} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[90]"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-12 z-[91] bg-white rounded-2xl shadow-2xl border border-ink-100 p-2 w-[240px]">
            <p className="px-3 py-2 text-[0.7rem] font-bold text-ink-400 uppercase tracking-wider">Partager via</p>

            <button
              onClick={copyLink}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-ink-50 text-sm font-semibold text-ink-700 transition"
            >
              {copied ? (
                <>
                  <Check size={15} className="text-emerald-500" />
                  <span className="text-emerald-600">Lien copié !</span>
                </>
              ) : (
                <>
                  <Copy size={15} className="text-ink-500" />
                  <span>Copier le lien</span>
                </>
              )}
            </button>

            <a
              href={`https://wa.me/?text=${encTitle}%20${encUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-ink-50 text-sm font-semibold text-ink-700 transition"
            >
              <span className="w-[15px] h-[15px] inline-flex items-center justify-center text-[15px] text-emerald-500">💬</span>
              WhatsApp
            </a>

            <a
              href={`mailto:?subject=${encTitle}&body=${encUrl}`}
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-ink-50 text-sm font-semibold text-ink-700 transition"
            >
              <span className="w-[15px] h-[15px] inline-flex items-center justify-center text-[15px]">✉</span>
              Email
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-ink-50 text-sm font-semibold text-ink-700 transition"
            >
              <span className="w-[15px] h-[15px] inline-flex items-center justify-center text-[15px] text-blue-600">f</span>
              Facebook
            </a>

            <a
              href={`https://twitter.com/intent/tweet?text=${encTitle}&url=${encUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-ink-50 text-sm font-semibold text-ink-700 transition"
            >
              <span className="w-[15px] h-[15px] inline-flex items-center justify-center text-[15px]">𝕏</span>
              Twitter / X
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-ink-50 text-sm font-semibold text-ink-700 transition"
            >
              <span className="w-[15px] h-[15px] inline-flex items-center justify-center text-[15px] text-blue-700">in</span>
              LinkedIn
            </a>
          </div>
        </>
      )}
    </div>
  );
}
