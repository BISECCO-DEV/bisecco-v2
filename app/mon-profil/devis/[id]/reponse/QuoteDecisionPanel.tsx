"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, X, Loader2, AlertCircle } from "lucide-react";
import { decideQuoteResponseAction } from "@/lib/quotes/response-actions";

export function QuoteDecisionPanel({ quoteRequestId }: { quoteRequestId: number }) {
  const [showRefuseForm, setShowRefuseForm] = useState(false);
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const decide = (decision: "accepted" | "refused") => {
    setError(null);
    const fd = new FormData();
    fd.set("quote_request_id", String(quoteRequestId));
    fd.set("decision", decision);
    if (decision === "refused" && note) fd.set("note", note);

    startTransition(async () => {
      const res = await decideQuoteResponseAction(undefined, fd);
      if (res.error) {
        setError(res.error);
      } else {
        window.location.reload();
      }
    });
  };

  if (showRefuseForm) {
    return (
      <div className="rounded-2xl border-2 border-red-200 bg-red-50/40 p-5">
        <h3 className="font-bold text-ink-700 mb-2">Refuser ce devis</h3>
        <p className="text-sm text-ink-500 mb-3">
          Optionnel : indique au pro pourquoi tu refuses. Il sera notifié.
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="Ex : Trop cher / Délai trop long / J'ai trouvé moins cher ailleurs…"
          className="w-full px-3 py-2 rounded-lg bg-white border-2 border-ink-200 focus:border-red-400 outline-none text-sm resize-y"
        />
        {error && (
          <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
            <AlertCircle size={12} /> {error}
          </p>
        )}
        <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-red-200">
          <button
            type="button"
            onClick={() => setShowRefuseForm(false)}
            className="px-4 py-2 rounded-xl bg-white border-2 border-ink-200 text-ink-600 font-bold text-sm"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => decide("refused")}
            disabled={pending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition disabled:opacity-50"
          >
            {pending ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
            Confirmer le refus
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-ink-100 p-5">
      <h3 className="font-bold text-ink-700 mb-3">Ta décision</h3>
      <p className="text-sm text-ink-500 mb-4">
        Une fois accepté, le pro est notifié et peut commencer à organiser le chantier. Tu peux toujours échanger via la messagerie pour finaliser.
      </p>
      {error && (
        <p className="text-xs text-red-600 mb-3 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
      <div className="grid sm:grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => decide("accepted")}
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition shadow-[0_8px_20px_-4px_rgba(16,185,129,0.4)] disabled:opacity-50"
        >
          {pending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
          Accepter ce devis
        </button>
        <button
          type="button"
          onClick={() => setShowRefuseForm(true)}
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border-2 border-ink-200 text-ink-700 font-bold text-sm hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition"
        >
          <X size={14} /> Refuser
        </button>
      </div>
    </div>
  );
}
