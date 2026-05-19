"use client";

import { useActionState, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { submitReportAction, REASON_LABELS, type ReportState } from "@/lib/reports/actions";

type Props = {
  reportedUserId: number;
  /** Si true, l'utilisateur n'est pas auth → on demande son email */
  isGuest: boolean;
};

export function ReportProfileForm({ reportedUserId, isGuest }: Props) {
  const [state, formAction, pending] = useActionState<ReportState, FormData>(submitReportAction, undefined);
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs text-ink-400 hover:text-red-500 transition"
        >
          <AlertTriangle size={12} /> Signaler ce profil
        </button>
      ) : (
        <section className="bg-white rounded-2xl border border-red-200 p-5 max-w-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-red-700 flex items-center gap-2 text-sm">
              <AlertTriangle size={16} /> Signaler ce profil
            </h3>
            <button type="button" onClick={() => setOpen(false)} className="text-ink-400 hover:text-ink-700 text-sm">
              Annuler
            </button>
          </div>

          {state?.success && (
            <div className="mb-3 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
              ✓ {state.success}
            </div>
          )}
          {state?.error && (
            <div className="mb-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              ⚠ {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-3">
            <input type="hidden" name="reported_user_id" value={reportedUserId} />

            <div>
              <label className="block text-xs font-bold text-ink-600 mb-1">Raison du signalement *</label>
              <select
                name="reason"
                required
                className="w-full px-3 py-2 rounded-lg bg-ink-50 border-2 border-ink-200 focus:border-red-500 focus:bg-white outline-none text-sm"
              >
                <option value="">— Choisir —</option>
                {Object.entries(REASON_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-600 mb-1">
                Détails <span className="text-ink-300 font-normal">(optionnel, max 2000 car.)</span>
              </label>
              <textarea
                name="detail"
                rows={3}
                maxLength={2000}
                placeholder="Expliquez ce qui pose problème…"
                className="w-full px-3 py-2 rounded-lg bg-ink-50 border-2 border-ink-200 focus:border-red-500 focus:bg-white outline-none text-sm resize-y"
              />
            </div>

            {isGuest && (
              <div>
                <label className="block text-xs font-bold text-ink-600 mb-1">Votre email *</label>
                <input
                  type="email"
                  name="reporter_email"
                  required
                  maxLength={191}
                  placeholder="pour qu'on puisse vous tenir au courant"
                  className="w-full px-3 py-2 rounded-lg bg-ink-50 border-2 border-ink-200 focus:border-red-500 focus:bg-white outline-none text-sm"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition disabled:opacity-50"
            >
              {pending ? "Envoi…" : "Envoyer le signalement"}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
