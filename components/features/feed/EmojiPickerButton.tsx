"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Smile } from "lucide-react";

// Lazy load : emoji-picker-react fait ~80 KB, on ne le charge qu'à l'ouverture
const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div className="w-[320px] h-[400px] flex items-center justify-center text-sm text-ink-500">
      Chargement…
    </div>
  ),
});

type Props = {
  /** Appelé avec l'emoji sélectionné (ex: "😀") */
  onSelect: (emoji: string) => void;
  className?: string;
};

/**
 * Bouton emoji + picker en popover.
 * - Clic sur le bouton → ouvre le picker
 * - Clic sur un emoji → insère + ferme
 * - Clic en dehors → ferme
 */
export function EmojiPickerButton({ onSelect, className }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center justify-center w-9 h-9 rounded-lg transition ${
          open
            ? "bg-brand-50 text-brand-600"
            : "text-ink-400 hover:bg-ink-100 hover:text-brand-500"
        }`}
        aria-label="Insérer un emoji"
        aria-expanded={open}
      >
        <Smile size={18} />
      </button>

      {open && (
        <div className="absolute z-50 bottom-full right-0 mb-2 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-1 duration-150">
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              onSelect(emojiData.emoji);
              setOpen(false);
            }}
            width={320}
            height={400}
            searchPlaceHolder="Rechercher un emoji…"
            previewConfig={{ showPreview: false }}
            skinTonesDisabled
            lazyLoadEmojis
          />
        </div>
      )}
    </div>
  );
}
