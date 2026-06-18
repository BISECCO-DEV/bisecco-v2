"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import {
  Plus, X, Loader2, AlertCircle, Upload, ArrowRight,
  Sparkles, Camera,
} from "lucide-react";
import {
  createPortfolioPairAction,
  deletePortfolioPairAction,
  type PortfolioPair,
} from "@/lib/profile/portfolio";
import { BeforeAfterSlider } from "@/components/features/BeforeAfterSlider";

const MAX = 6;

export function PortfolioManager({ initial }: { initial: PortfolioPair[] }) {
  const [items, setItems] = useState<PortfolioPair[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onCreate = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await createPortfolioPairAction(undefined, formData);
      if (result.error) {
        setError(result.error);
      } else {
        window.location.reload();
      }
    });
  };

  const onRemove = (id: number) => {
    if (!confirm("Supprimer cette réalisation ?")) return;
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append("id", String(id));
      const result = await deletePortfolioPairAction(undefined, fd);
      if (result.ok) {
        setItems((prev) => prev.filter((p) => p.id !== id));
      } else if (result.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-ink-400">
            {items.length} / {MAX} réalisations
          </p>
          <p className="text-[0.7rem] text-ink-400">
            Une réalisation = 2 photos (avant + après) avec slider interactif sur ton profil.
          </p>
        </div>
        {pending && (
          <span className="inline-flex items-center gap-1.5 text-xs text-brand-500 font-bold">
            <Loader2 size={12} className="animate-spin" /> En cours…
          </span>
        )}
      </div>

      {/* Liste existante */}
      {items.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((p) => (
            <div
              key={p.id}
              className="relative rounded-2xl overflow-hidden border-2 border-ink-100 bg-white group"
            >
              <BeforeAfterSlider
                beforeUrl={p.before_url}
                afterUrl={p.after_url}
                alt={p.title ?? "Réalisation"}
                heightClass="h-56"
              />
              <div className="p-3">
                <h4 className="font-bold text-sm text-ink-700 truncate">
                  {p.title ?? "Réalisation sans titre"}
                </h4>
                {p.description && (
                  <p className="text-xs text-ink-500 mt-1 line-clamp-2">{p.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onRemove(p.id)}
                disabled={pending}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg opacity-90 hover:opacity-100 hover:scale-105 transition disabled:opacity-50"
                aria-label="Supprimer"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CTA / Form de création */}
      {items.length < MAX && !showForm && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          disabled={pending}
          className="w-full flex items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed border-ink-200 hover:border-brand-500 hover:bg-brand-50/30 text-ink-500 hover:text-brand-600 font-bold transition cursor-pointer disabled:opacity-50"
        >
          <Plus size={18} /> Ajouter une réalisation avant/après
        </button>
      )}

      {showForm && (
        <PortfolioCreateForm
          onSubmit={onCreate}
          onCancel={() => setShowForm(false)}
          pending={pending}
        />
      )}

      {error && (
        <p className="text-xs font-bold text-red-600 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}

      {items.length === 0 && !showForm && (
        <div className="rounded-2xl bg-gradient-to-br from-brand-50/60 to-amber-50/60 border border-brand-100 p-5 text-sm text-ink-600 flex gap-3">
          <Sparkles size={18} className="text-brand-500 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-ink-700">Astuce :</strong> les réalisations avant/après
            <strong> multiplient par 3 le taux de contact</strong> sur ton profil. Mets en avant
            tes plus beaux chantiers : rénovation cuisine, ravalement façade, pose carrelage…
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================================
// Formulaire de création d'une nouvelle paire
// =====================================================================
function PortfolioCreateForm({
  onSubmit,
  onCancel,
  pending,
}: {
  onSubmit: (fd: FormData) => void;
  onCancel: () => void;
  pending: boolean;
}) {
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);

  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  const handleFile = (which: "before" | "after", file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (which === "before") {
      setBeforeFile(file);
      setBeforePreview(url);
    } else {
      setAfterFile(file);
      setAfterPreview(url);
    }
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!beforeFile || !afterFile) return;
    const fd = new FormData(e.currentTarget);
    fd.set("before", beforeFile);
    fd.set("after", afterFile);
    onSubmit(fd);
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border-2 border-brand-200 bg-brand-50/30 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-ink-700 flex items-center gap-2">
          <Camera size={16} className="text-brand-500" />
          Nouvelle réalisation avant/après
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-ink-400 hover:text-ink-700"
          aria-label="Annuler"
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* AVANT */}
        <div>
          <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
            📷 Avant
          </label>
          {!beforePreview ? (
            <button
              type="button"
              onClick={() => beforeRef.current?.click()}
              className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-ink-300 hover:border-brand-500 bg-white flex flex-col items-center justify-center gap-2 text-ink-400 hover:text-brand-600 transition"
            >
              <Upload size={22} />
              <span className="text-xs font-bold">Choisir « avant »</span>
            </button>
          ) : (
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-ink-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={beforePreview} alt="Avant" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => beforeRef.current?.click()}
                className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-white/95 text-xs font-bold text-ink-700 hover:bg-white shadow"
              >
                Changer
              </button>
            </div>
          )}
          <input
            ref={beforeRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => handleFile("before", e.target.files?.[0] ?? null)}
          />
        </div>

        {/* APRÈS */}
        <div>
          <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
            ✨ Après
          </label>
          {!afterPreview ? (
            <button
              type="button"
              onClick={() => afterRef.current?.click()}
              className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-ink-300 hover:border-brand-500 bg-white flex flex-col items-center justify-center gap-2 text-ink-400 hover:text-brand-600 transition"
            >
              <Upload size={22} />
              <span className="text-xs font-bold">Choisir « après »</span>
            </button>
          ) : (
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-ink-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={afterPreview} alt="Après" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => afterRef.current?.click()}
                className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-white/95 text-xs font-bold text-ink-700 hover:bg-white shadow"
              >
                Changer
              </button>
            </div>
          )}
          <input
            ref={afterRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => handleFile("after", e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      {/* Aperçu live du slider */}
      {beforePreview && afterPreview && (
        <div>
          <p className="text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
            Aperçu (glisse le curseur)
          </p>
          <div className="rounded-xl overflow-hidden border-2 border-ink-200">
            <BeforeAfterSlider
              beforeUrl={beforePreview}
              afterUrl={afterPreview}
              alt="Aperçu"
              heightClass="h-64"
            />
          </div>
        </div>
      )}

      {/* Métadonnées */}
      <div>
        <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-1.5">
          Titre <span className="text-ink-400">(facultatif, 120 car. max)</span>
        </label>
        <input
          type="text"
          name="title"
          maxLength={120}
          placeholder="Ex : Rénovation cuisine — Cannes"
          className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-ink-200 focus:border-brand-500 outline-none transition text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-1.5">
          Description courte <span className="text-ink-400">(facultatif, 1000 car. max)</span>
        </label>
        <textarea
          name="description"
          maxLength={1000}
          rows={2}
          placeholder="Ex : Remplacement complet des meubles, pose carrelage grand format, peinture."
          className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-ink-200 focus:border-brand-500 outline-none transition text-sm resize-y"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-brand-200/60">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl bg-white border-2 border-ink-200 text-ink-600 font-bold text-sm hover:border-ink-300"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={!beforeFile || !afterFile || pending}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? (
            <><Loader2 size={14} className="animate-spin" /> Téléversement…</>
          ) : (
            <><ArrowRight size={14} /> Publier la réalisation</>
          )}
        </button>
      </div>
    </form>
  );
}

// Forçage import inutilisé pour TS strict
void Image;
