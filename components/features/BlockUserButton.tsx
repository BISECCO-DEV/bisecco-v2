"use client";

import { useState, useTransition } from "react";
import { Ban, X, Loader2, AlertCircle } from "lucide-react";
import { blockUserAction } from "@/lib/blocks/actions";

type Props = {
  blockedUserId: number;
  blockedUserName: string;
  className?: string;
};

/**
 * Bouton "Bloquer cet utilisateur" avec dialogue de confirmation.
 * Une fois bloqué, l'utilisateur ne peut plus envoyer de message ni voir le profil.
 */
export function BlockUserButton({ blockedUserId, blockedUserName, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("blocked_id", String(blockedUserId));
    startTransition(async () => {
      const res = await blockUserAction(undefined, fd);
      if (res.error) {
        setError(res.error);
      } else {
        setDone(true);
        setTimeout(() => {
          setOpen(false);
          // Reload pour refléter le blocage côté UI
          window.location.reload();
        }, 1200);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-sand-50 border border-sand-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700 text-[0.82rem] font-medium text-ink-700 transition w-full ${className}`}
      >
        <span className="inline-flex items-center gap-2">
          <Ban size={13} /> Bloquer cet utilisateur
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4" onClick={() => !pending && setOpen(false)}>
          <div
            className="bg-white rounded-2xl border border-ink-100 max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-5 border-b border-ink-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 grid place-items-center flex-shrink-0">
                  <Ban size={18} className="text-red-600" />
                </div>
                <div>
                  <h2 className="font-bold text-ink-700 text-base">
                    Bloquer {blockedUserName} ?
                  </h2>
                  <p className="text-xs text-ink-500 mt-0.5 leading-relaxed">
                    Cette personne ne pourra plus te contacter. Tu peux annuler ce blocage à tout moment depuis tes paramètres.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !pending && setOpen(false)}
                className="text-ink-400 hover:text-ink-700 flex-shrink-0"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            {done ? (
              <div className="p-5 text-center">
                <div className="text-emerald-600 font-bold">✓ Utilisateur bloqué</div>
                <p className="text-xs text-ink-500 mt-1">Rechargement…</p>
              </div>
            ) : (
              <form onSubmit={submit} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-1.5">
                    Motif <span className="text-ink-400 font-normal lowercase tracking-normal">(facultatif, privé)</span>
                  </label>
                  <textarea
                    name="reason"
                    rows={2}
                    maxLength={500}
                    placeholder="Ex : spam de prospection, faux contact, harcèlement…"
                    className="w-full px-3 py-2 rounded-lg bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm resize-y"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} /> {error}
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-ink-100">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    disabled={pending}
                    className="px-4 py-2 rounded-xl bg-white border-2 border-ink-200 text-ink-600 font-bold text-sm hover:border-ink-300 disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={pending}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition disabled:opacity-50"
                  >
                    {pending ? (
                      <><Loader2 size={14} className="animate-spin" /> Blocage…</>
                    ) : (
                      <><Ban size={14} /> Bloquer définitivement</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
