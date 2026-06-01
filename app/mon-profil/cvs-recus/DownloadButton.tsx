"use client";

import { useState } from "react";
import { Download, Loader2, Eye } from "lucide-react";
import { getCvSubmissionDownloadUrl } from "@/lib/cv/submit-actions";

type Mode = "preview" | "download";

export function DownloadButton({ submissionId, fileName }: { submissionId: number; fileName: string }) {
  const [loading, setLoading] = useState<Mode | null>(null);

  const handle = async (mode: Mode) => {
    setLoading(mode);
    try {
      const url = await getCvSubmissionDownloadUrl(submissionId);
      if (!url) {
        alert("Impossible d'ouvrir ce fichier.");
        return;
      }
      if (mode === "preview") {
        // Ouvre le PDF en nouvel onglet pour visualisation
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        // Force download
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.target = "_blank";
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="inline-flex gap-2">
      <button
        type="button"
        onClick={() => handle("preview")}
        disabled={loading !== null}
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border-2 border-brand-300 text-brand-700 text-sm font-bold hover:bg-brand-50 transition disabled:opacity-50"
        title="Ouvrir le CV dans un nouvel onglet"
      >
        {loading === "preview" ? <Loader2 size={13} className="animate-spin" /> : <Eye size={13} />}
        Voir
      </button>
      <button
        type="button"
        onClick={() => handle("download")}
        disabled={loading !== null}
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white text-sm font-bold shadow-[0_4px_12px_-2px_rgba(240,122,47,0.4)] hover:-translate-y-0.5 transition disabled:opacity-50 disabled:translate-y-0"
        title="Télécharger le CV en PDF"
      >
        {loading === "download" ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
        Télécharger
      </button>
    </div>
  );
}
