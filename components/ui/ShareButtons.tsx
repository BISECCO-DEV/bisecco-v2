"use client";

import { useState } from "react";
import { Share2, Copy, Check, Mail } from "lucide-react";

type Props = {
  url: string;
  title: string;
  description?: string;
  compact?: boolean;
};

export function ShareButtons({ url, title, description = "", compact = false }: Props) {
  const [copied, setCopied] = useState(false);
  const fullUrl = typeof window !== "undefined" ? new URL(url, window.location.origin).toString() : url;

  const copy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title, text: description, url: fullUrl }); } catch {}
    } else copy();
  };

  const links = [
    {
      name: "Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
      color: "bg-[#1da1f2] hover:bg-[#1a91da]",
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>,
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      color: "bg-[#1877f2] hover:bg-[#166fe5]",
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88V14.9h-2.54V12h2.54V9.8c0-2.5 1.5-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.9h-2.33v6.98A10 10 0 0 0 22 12z"/></svg>,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
      color: "bg-[#0a66c2] hover:bg-[#0958a8]",
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43A2.07 2.07 0 1 1 5.34 3.3a2.07 2.07 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>,
    },
    {
      name: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + fullUrl)}`,
      color: "bg-[#25d366] hover:bg-[#22c35e]",
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26L4.5 19.5l3.154-.693z"/></svg>,
    },
  ];

  if (compact) {
    return (
      <button
        onClick={nativeShare}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-ink-200 text-ink-600 hover:border-brand-500 hover:text-brand-500 text-xs font-bold transition"
      >
        <Share2 size={13} /> Partager
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-ink-100 p-4">
      <h3 className="text-xs font-bold tracking-[0.14em] uppercase text-ink-400 mb-3">Partager</h3>
      <div className="flex flex-wrap gap-2">
        {links.map((l) => (
          <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer"
             className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg ${l.color} text-white text-xs font-bold transition`}>
            {l.icon} {l.name}
          </a>
        ))}
        <a
          href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + "\n\n" + fullUrl)}`}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-ink-700 text-white text-xs font-bold hover:bg-ink-800 transition"
        >
          <Mail size={13} /> Email
        </a>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-ink-50 border border-ink-200 text-ink-700 text-xs font-bold hover:border-brand-500 transition"
        >
          {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
          {copied ? "Copié !" : "Copier le lien"}
        </button>
      </div>
    </div>
  );
}
