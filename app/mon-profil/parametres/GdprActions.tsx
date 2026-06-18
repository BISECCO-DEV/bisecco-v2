"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Trash2, Loader2, AlertCircle } from "lucide-react";

export function ExportDataButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/account/export-data");
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `Erreur ${res.status}`);
      }
      // Téléchargement du blob
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Récup le nom de fichier depuis Content-Disposition
      const cd = res.headers.get("content-disposition") ?? "";
      const match = cd.match(/filename="([^"]+)"/);
      a.download = match?.[1] ?? "bisecco-export.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleExport}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm font-bold hover:bg-blue-100 disabled:opacity-50 disabled:cursor-wait transition"
      >
        {loading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
        {loading ? "Préparation..." : "Télécharger"}
      </button>
      {error && (
        <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={11} /> {error}
        </div>
      )}
    </>
  );
}

export function DeleteAccountButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (confirmText !== "SUPPRIMER") {
      setError('Tape "SUPPRIMER" en majuscules pour confirmer.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/account/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: confirmText }),
      });
      const data = await res.json();
      if (!data.ok) {
        throw new Error(data.error ?? `Erreur ${res.status}`);
      }
      // Redirection après suppression
      router.push("/?account=deleted");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-bold hover:bg-red-100 transition"
      >
        <Trash2 size={13} /> Supprimer
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-ink-100 bg-red-50">
              <h3 className="font-bold text-ink-700 text-lg flex items-center gap-2">
                <AlertCircle className="text-red-600" size={20} />
                Supprimer mon compte
              </h3>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-ink-600 leading-relaxed">
                Cette action est <strong>irréversible</strong>. Tes données personnelles seront
                anonymisées immédiatement (email, nom, téléphone, photos).
              </p>
              <p className="text-sm text-ink-600 leading-relaxed">
                Conformément au RGPD, tes avis, messages et autres traces publiques sont conservés
                anonymisés pour préserver l&apos;intégrité des conversations des autres utilisateurs.
              </p>
              <div>
                <label className="text-xs text-ink-500 font-bold uppercase tracking-wide block mb-1.5">
                  Pour confirmer, tape SUPPRIMER ci-dessous
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="SUPPRIMER"
                  autoFocus
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-ink-200 focus:border-red-500 outline-none font-mono text-sm"
                />
              </div>
              {error && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex items-start gap-2">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" /> {error}
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-ink-50/40 border-t border-ink-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setError(null);
                  setConfirmText("");
                }}
                disabled={loading}
                className="px-4 py-2 rounded-xl text-sm font-bold text-ink-600 hover:bg-ink-100 transition disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading || confirmText !== "SUPPRIMER"}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading && <Loader2 size={13} className="animate-spin" />}
                {loading ? "Suppression..." : "Supprimer définitivement"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
