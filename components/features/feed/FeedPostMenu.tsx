"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { MoreHorizontal, Trash2, Flag, X, AlertTriangle } from "lucide-react";
import { deleteOwnFeedPostAction } from "@/lib/feed/actions";

type Props = {
  postId: number;
  isOwner: boolean;
  isAdmin: boolean;
};

/**
 * Menu contextuel des posts du fil — ouvre un dropdown au clic sur "⋯".
 * - Auteur ou admin → option "Supprimer" (avec confirmation modale)
 * - Sinon → menu vide / pas affiché
 *
 * Note : le bouton "Signaler" reste dans la barre d'actions principale
 * (visible par tous), ne migre pas dans ce menu pour rester découvrable.
 */
export function FeedPostMenu({ postId, isOwner, isAdmin }: Props) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const canDelete = isOwner || isAdmin;
  if (!canDelete) return null;

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const res = await deleteOwnFeedPostAction(postId);
      if (!res.ok) {
        setError(res.error || "Erreur de suppression");
        return;
      }
      setConfirm(false);
      setOpen(false);
    });
  };

  return (
    <>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-ink-50 text-ink-400 inline-flex items-center justify-center transition"
          aria-label="Options du post"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <MoreHorizontal size={16} />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl bg-white shadow-2xl border border-ink-100 overflow-hidden z-20 animate-in fade-in slide-in-from-top-1 duration-150">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setConfirm(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition text-left"
            >
              <Trash2 size={14} />
              {isOwner ? "Supprimer mon post" : "Supprimer (admin)"}
            </button>
            {isAdmin && !isOwner && (
              <div className="px-3 py-1.5 text-[0.65rem] text-ink-400 border-t border-ink-50">
                <Flag size={9} className="inline mr-1" />
                Action de modération
              </div>
            )}
          </div>
        )}
      </div>

      {confirm && (
        <div
          className="fixed inset-0 z-[80] bg-ink-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !pending && setConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => !pending && setConfirm(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-lg hover:bg-ink-100 text-ink-500 inline-flex items-center justify-center"
              aria-label="Annuler"
              disabled={pending}
            >
              <X size={16} />
            </button>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl mx-auto bg-red-50 inline-flex items-center justify-center mb-3">
                <AlertTriangle size={26} className="text-red-500" />
              </div>
              <h3 className="font-extrabold text-ink-700 text-lg">Supprimer ce post ?</h3>
              <p className="text-sm text-ink-500 mt-1 leading-snug">
                Cette action est définitive. Le post, ses likes et ses commentaires seront supprimés.
              </p>
            </div>

            {error && (
              <div className="mt-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                {error}
              </div>
            )}

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => !pending && setConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-ink-100 hover:bg-ink-200 text-ink-700 font-bold text-sm transition disabled:opacity-50"
                disabled={pending}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition disabled:opacity-50"
                disabled={pending}
              >
                {pending ? "Suppression…" : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
