"use client";

import { useState } from "react";
import { MapPin, Loader2, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

type Result = {
  ok: boolean;
  total?: number;
  geocoded?: number;
  skipped?: number;
  failed?: number;
  failures?: Array<{ id: number; name: string; city: string | null; reason: string }>;
  error?: string;
};

export function GeocodeAllButton() {
  const [loading, setLoading] = useState<false | "normal" | "force">(false);
  const [result, setResult] = useState<Result | null>(null);

  const run = async (force: boolean) => {
    if (loading) return;
    const confirmMsg = force
      ? "⚠️ RE-GÉOCODER TOUS LES PROFILS (même ceux déjà géocodés) ?\n\nUtilise cette option si tu viens d'améliorer le geocoder et que certains profils sont mal positionnés. Plus lent que le rattrapage normal."
      : "Géocoder uniquement les profils SANS coordonnées précises ?\n\nAppel API Adresse (data.gouv.fr) · ~50ms par profil.";
    if (!confirm(confirmMsg)) return;

    setLoading(force ? "force" : "normal");
    setResult(null);
    try {
      const url = force ? "/api/admin/geocode-all?force=1" : "/api/admin/geocode-all";
      const res = await fetch(url, { method: "POST" });
      const data: Result = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ ok: false, error: err instanceof Error ? err.message : "Erreur inconnue" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => run(false)}
          disabled={loading !== false}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-sm shadow-[0_4px_12px_rgba(240,122,47,0.3)] hover:bg-brand-600 disabled:opacity-50 disabled:cursor-wait transition"
        >
          {loading === "normal" ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Géocodage en cours…
            </>
          ) : (
            <>
              <MapPin size={16} /> Rattrapage (profils sans coords)
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => run(true)}
          disabled={loading !== false}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-sm shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:bg-amber-600 disabled:opacity-50 disabled:cursor-wait transition"
        >
          {loading === "force" ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Re-géocodage en cours…
            </>
          ) : (
            <>
              <RefreshCw size={16} /> Force re-géocoder TOUS
            </>
          )}
        </button>
      </div>

      {result && result.ok && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
          <div className="flex items-center gap-2 font-bold text-emerald-700 mb-2">
            <CheckCircle2 size={16} /> Géocodage terminé
          </div>
          <ul className="space-y-1 text-emerald-800 text-xs">
            <li>Total profils scannés : <strong>{result.total}</strong></li>
            <li>Géocodés (lat/lng mis à jour) : <strong>{result.geocoded}</strong></li>
            <li>Skipped (déjà géocodés) : <strong>{result.skipped}</strong></li>
            <li>Échecs : <strong>{result.failed}</strong></li>
          </ul>
          {result.failures && result.failures.length > 0 && (
            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-semibold text-emerald-700">
                Voir les {result.failures.length} échecs
              </summary>
              <ul className="mt-2 space-y-1 text-[0.7rem] text-emerald-800">
                {result.failures.map((f) => (
                  <li key={f.id}>
                    #{f.id} — {f.name} ({f.city ?? "ville vide"}) → {f.reason}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      {result && !result.ok && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm">
          <div className="flex items-center gap-2 font-bold text-red-700">
            <XCircle size={16} /> Erreur
          </div>
          <p className="mt-1 text-red-800 text-xs">{result.error}</p>
        </div>
      )}
    </div>
  );
}
