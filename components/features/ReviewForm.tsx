"use client";

import { useActionState, useState } from "react";
import { Star, Send } from "lucide-react";
import { submitReviewAction, type ReviewState } from "@/lib/reviews/actions";

type Props = {
  artisanId: number;
  artisanName: string;
  /** Si fourni, l'avis sera lié au devis (badge "vérifié") */
  quoteRequestId?: number | null;
};

export function ReviewForm({ artisanId, artisanName, quoteRequestId }: Props) {
  const [state, formAction, pending] = useActionState<ReviewState, FormData>(submitReviewAction, undefined);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <section className="bg-white rounded-2xl border border-ink-100 p-6">
      <h3 className="text-lg font-bold text-ink-700 mb-1 flex items-center gap-2">
        <Star size={18} className="text-amber-500" /> Laisser un avis sur {artisanName}
      </h3>
      <p className="text-sm text-ink-400 mb-4">
        Votre avis sera publié après modération (sous 24h).
        {quoteRequestId && (
          <span className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[0.7rem] font-bold">
            ✓ Avis vérifié (devis #{quoteRequestId})
          </span>
        )}
      </p>

      {state?.error && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          ⚠ {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-3">
        <input type="hidden" name="artisan_id" value={artisanId} />
        {quoteRequestId && <input type="hidden" name="quote_request_id" value={quoteRequestId} />}
        <input type="hidden" name="rating" value={rating} />

        <div>
          <label className="block text-sm font-bold text-ink-600 mb-2">Votre note *</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(n)}
                className="transition-transform hover:scale-110"
                aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
              >
                <Star
                  size={32}
                  fill={(hover || rating) >= n ? "#f7b500" : "transparent"}
                  className={(hover || rating) >= n ? "text-amber-400" : "text-ink-200"}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-ink-600 mb-1.5">
            Votre commentaire <span className="font-normal text-ink-300">(min. 30 caractères)</span>
          </label>
          <textarea
            name="comment"
            required
            minLength={30}
            maxLength={2000}
            rows={4}
            placeholder="Qualité du travail, ponctualité, communication, rapport qualité-prix…"
            className="w-full px-3 py-2.5 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={pending || rating === 0}
          className="btn-primary disabled:opacity-50"
        >
          <Send size={14} /> {pending ? "Envoi…" : "Publier mon avis"}
        </button>
      </form>
    </section>
  );
}
