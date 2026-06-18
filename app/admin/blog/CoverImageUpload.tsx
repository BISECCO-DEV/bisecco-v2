"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, X, AlertCircle, Image as ImageIcon } from "lucide-react";

type Props = {
  /** URL initiale (pour l'édition d'un article existant) */
  initialUrl?: string;
  /** Alt initial */
  initialAlt?: string;
};

/**
 * Upload de l'image de cover d'un article de blog.
 *
 * Réutilise l'endpoint /api/admin/blog/upload-image existant.
 * Émet 2 hidden inputs :
 *   - name="image_url"  → URL Supabase Storage
 *   - name="image_alt"  → texte alternatif SEO
 *
 * À placer à la place du couple URL + Alt dans le form admin.
 */
export function CoverImageUpload({ initialUrl = "", initialAlt = "" }: Props) {
  const [url, setUrl] = useState(initialUrl);
  const [alt, setAlt] = useState(initialAlt);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/blog/upload-image", { method: "POST", body: form });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Erreur upload");
        return;
      }
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur upload");
    } finally {
      setUploading(false);
    }
  };

  const triggerPicker = () => {
    if (uploading) return;
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      {/* Hidden inputs pour le form submission */}
      <input type="hidden" name="image_url" value={url} readOnly />
      <input type="hidden" name="image_alt" value={alt} readOnly />

      <label className="block text-sm font-bold text-ink-600">
        Image de couverture
        <span className="text-ink-400 font-normal ml-1">(affichée en haut de l&apos;article)</span>
      </label>

      {!url ? (
        // ─── Pas d'image : drop zone upload ──────────────────────────
        <>
          <button
            type="button"
            onClick={triggerPicker}
            disabled={uploading}
            className="w-full flex flex-col items-center justify-center gap-2 p-10 rounded-xl border-2 border-dashed border-ink-300 hover:border-brand-400 hover:bg-brand-50/30 text-ink-500 hover:text-brand-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-wait"
          >
            {uploading ? (
              <>
                <Loader2 size={28} className="animate-spin" />
                <span className="text-sm font-bold">Téléversement…</span>
              </>
            ) : (
              <>
                <Upload size={28} />
                <span className="text-sm font-bold">Choisir l&apos;image de couverture</span>
                <span className="text-xs text-ink-400">JPG, PNG ou WebP · 5 MB max</span>
                <span className="text-[0.65rem] text-ink-400 mt-1">
                  Format conseillé : 1280×720 pour un rendu optimal
                </span>
              </>
            )}
          </button>
        </>
      ) : (
        // ─── Image uploadée : preview + actions ──────────────────────
        <div className="space-y-3">
          <div className="relative group rounded-xl overflow-hidden border-2 border-ink-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={alt} className="w-full max-h-72 object-cover" />

            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
              <button
                type="button"
                onClick={triggerPicker}
                disabled={uploading}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-sm border border-ink-200 text-xs font-bold text-ink-700 hover:bg-brand-50 hover:text-brand-700 transition shadow-md"
              >
                {uploading ? <Loader2 size={12} className="animate-spin" /> : <><Upload size={11} /> Changer</>}
              </button>
              <button
                type="button"
                onClick={removeImage}
                className="p-1.5 rounded-lg bg-white/95 backdrop-blur-sm border border-red-200 text-red-600 hover:bg-red-50 transition shadow-md"
                title="Supprimer l'image"
              >
                <X size={12} />
              </button>
            </div>

            {/* Petit badge en haut à gauche */}
            <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/95 backdrop-blur-sm text-white text-[0.65rem] font-bold shadow-md">
              <ImageIcon size={10} /> Cover prêt
            </div>
          </div>

          {/* Alt text pour le SEO */}
          <div>
            <label className="block text-xs font-bold text-ink-500 uppercase tracking-wider mb-1">
              Description SEO (alt text)
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Ex: Plombier en intervention sur une canalisation"
              className="w-full px-4 py-2.5 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm"
            />
            <p className="text-[0.65rem] text-ink-400 mt-1">
              Décris brièvement l&apos;image (lu par Google + lecteurs d&apos;écran).
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      {error && (
        <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle size={12} className="flex-shrink-0 mt-0.5" /> {error}
        </div>
      )}
    </div>
  );
}
