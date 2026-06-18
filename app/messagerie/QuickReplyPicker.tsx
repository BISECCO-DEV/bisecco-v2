"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Zap, X, Settings } from "lucide-react";
import type { QuickReply } from "@/lib/quick-replies/actions";

type Props = {
  replies: QuickReply[];
  onPick: (body: string) => void;
};

/**
 * Bouton "Réponses rapides" qui ouvre un popover avec la liste des templates.
 * Clic sur un template → insère le body dans la zone de saisie via onPick.
 */
export function QuickReplyPicker({ replies, onPick }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Click outside / Escape pour fermer
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="Réponses rapides"
        className={`w-8 h-8 rounded-md grid place-items-center transition ${
          open ? "bg-brand-50 text-brand-600" : "hover:bg-sand-100 text-ink-400 hover:text-ink-700"
        }`}
        aria-label="Réponses rapides"
      >
        <Zap size={14} />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-[320px] max-w-[90vw] bg-white rounded-xl border border-ink-100 shadow-[0_18px_40px_-15px_rgba(13,30,74,0.25)] overflow-hidden z-30">
          <div className="flex items-center justify-between px-3 py-2 border-b border-ink-100 bg-sand-50/40">
            <div className="flex items-center gap-1.5">
              <Zap size={12} className="text-brand-500" />
              <span className="text-xs font-bold text-ink-700 uppercase tracking-wider">
                Réponses rapides
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-ink-400 hover:text-ink-700"
              aria-label="Fermer"
            >
              <X size={13} />
            </button>
          </div>

          {replies.length === 0 ? (
            <div className="px-3 py-5 text-center">
              <p className="text-xs text-ink-500 leading-relaxed mb-3">
                Aucune réponse pré-enregistrée. Crée tes templates depuis les paramètres pour répondre en 1 clic.
              </p>
              <Link
                href="/mon-profil/parametres"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500 text-white text-xs font-bold hover:bg-brand-600"
              >
                <Settings size={11} /> Créer une réponse
              </Link>
            </div>
          ) : (
            <>
              <ul className="max-h-72 overflow-y-auto">
                {replies.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => { onPick(r.body); setOpen(false); }}
                      className="w-full text-left px-3 py-2.5 hover:bg-brand-50/40 transition group"
                    >
                      <div className="font-bold text-xs text-ink-700 group-hover:text-brand-700">
                        {r.label}
                      </div>
                      <div className="text-xs text-ink-500 truncate mt-0.5">
                        {r.body}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-t border-ink-100 px-3 py-2 bg-sand-50/30">
                <Link
                  href="/mon-profil/parametres"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-500 hover:text-brand-600"
                >
                  <Settings size={11} /> Gérer mes réponses
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
