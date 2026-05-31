"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, X, Loader2 } from "lucide-react";
import { removeFeedPostAction } from "@/lib/feed/actions";

export function AdminFeedRemoveButton({ postId }: { postId: number }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const onConfirm = () => {
    startTransition(async () => {
      await removeFeedPostAction(postId);
      router.refresh();
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        disabled={pending}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-sm font-bold transition disabled:opacity-50"
      >
        <Trash2 size={13} /> Retirer du fil
      </button>

      {confirmOpen && (
        <div className="fixed inset-0 z-[100] bg-ink-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              disabled={pending}
              className="absolute top-3 right-3 w-8 h-8 rounded-lg hover:bg-ink-100 text-ink-500 inline-flex items-center justify-center"
              aria-label="Fermer"
            >
              <X size={16} />
            </button>

            <h3 className="font-bold text-ink-700 text-lg">Retirer ce post ?</h3>
            <p className="text-sm text-ink-500 mt-2 leading-relaxed">
              Le post ne sera plus visible dans le fil public. Cette action peut être annulée manuellement en base.
              L&apos;auteur ne recevra pas d&apos;email automatique — vous pouvez le contacter via la messagerie si nécessaire.
            </p>

            <div className="mt-5 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={pending}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-ink-600 hover:bg-ink-100"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={pending}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-bold inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                {pending && <Loader2 size={14} className="animate-spin" />}
                <Trash2 size={13} /> Retirer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
