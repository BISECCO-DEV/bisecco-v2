"use client";

import { useRef, useState } from "react";
import { Loader2, RefreshCw, CheckCircle2, XCircle, Search, Upload } from "lucide-react";

type Metier = {
  id: number;
  name: string;
  slug: string;
  category: string;
  icon: string | null;
  cover_url: string | null;
};

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; newUrl: string }
  | { kind: "error"; msg: string };

export function CoversGrid({ metiers }: { metiers: Metier[] }) {
  const [states, setStates] = useState<Record<string, State>>({});
  const [filter, setFilter] = useState("");
  const [category, setCategory] = useState<string>("all");
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const categories = Array.from(new Set(metiers.map((m) => m.category))).sort();

  const visible = metiers.filter((m) => {
    if (category !== "all" && m.category !== category) return false;
    if (filter && !m.name.toLowerCase().includes(filter.toLowerCase())) return false;
    return true;
  });

  const regenerate = async (slug: string) => {
    setStates((s) => ({ ...s, [slug]: { kind: "loading" } }));
    try {
      const res = await fetch("/api/admin/metier-cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (!data.ok) {
        setStates((s) => ({ ...s, [slug]: { kind: "error", msg: data.error ?? "Erreur" } }));
        return;
      }
      setStates((s) => ({ ...s, [slug]: { kind: "success", newUrl: data.cover_url } }));
    } catch (err) {
      setStates((s) => ({
        ...s,
        [slug]: { kind: "error", msg: err instanceof Error ? err.message : "Erreur" },
      }));
    }
  };

  const uploadCustom = async (slug: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setStates((s) => ({ ...s, [slug]: { kind: "error", msg: "Fichier > 5 MB" } }));
      return;
    }
    setStates((s) => ({ ...s, [slug]: { kind: "loading" } }));
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("slug", slug);
      const res = await fetch("/api/admin/metier-cover/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!data.ok) {
        setStates((s) => ({ ...s, [slug]: { kind: "error", msg: data.error ?? "Upload échoué" } }));
        return;
      }
      setStates((s) => ({ ...s, [slug]: { kind: "success", newUrl: data.cover_url } }));
    } catch (err) {
      setStates((s) => ({
        ...s,
        [slug]: { kind: "error", msg: err instanceof Error ? err.message : "Erreur" },
      }));
    }
  };

  const triggerFilePicker = (slug: string) => {
    fileInputs.current[slug]?.click();
  };

  return (
    <div className="mt-8">
      {/* Filtres */}
      <div className="bg-white rounded-2xl border border-ink-100 p-4 mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filtrer par nom..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-ink-200 text-sm outline-none focus:border-brand-500"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-xl border border-ink-200 text-sm bg-white outline-none focus:border-brand-500 cursor-pointer"
        >
          <option value="all">Toutes catégories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="text-xs text-ink-500 ml-auto">
          {visible.length} métier{visible.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* Grille */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {visible.map((m) => {
          const state = states[m.slug] ?? { kind: "idle" };
          const displayUrl = state.kind === "success" ? state.newUrl : m.cover_url;
          return (
            <div
              key={m.id}
              className="bg-white rounded-2xl border border-ink-100 overflow-hidden flex flex-col"
            >
              {/* Cover */}
              <div className="relative h-32 bg-ink-100">
                {displayUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayUrl}
                    alt={m.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">
                    {m.icon ?? "🛠️"}
                  </div>
                )}
                {state.kind === "loading" && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-xs gap-2">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Génération...</span>
                  </div>
                )}
                {state.kind === "success" && (
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1">
                    <CheckCircle2 size={14} />
                  </div>
                )}
              </div>

              {/* Info + bouton */}
              <div className="p-3 flex-1 flex flex-col">
                <div className="text-xs text-ink-400 font-bold tracking-wider uppercase">
                  {m.icon} {m.category}
                </div>
                <div className="font-bold text-ink-700 text-sm leading-tight mt-1 truncate">
                  {m.name}
                </div>

                {state.kind === "error" && (
                  <div className="mt-2 text-[0.65rem] text-red-600 flex items-start gap-1">
                    <XCircle size={11} className="flex-shrink-0 mt-0.5" />
                    <span className="break-words">{state.msg}</span>
                  </div>
                )}

                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  {/* Régénérer Pixabay */}
                  <button
                    type="button"
                    onClick={() => regenerate(m.slug)}
                    disabled={state.kind === "loading"}
                    className="inline-flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-ink-50 hover:bg-brand-50 border border-ink-100 hover:border-brand-300 text-[0.65rem] font-bold text-ink-700 hover:text-brand-700 disabled:opacity-50 disabled:cursor-wait transition"
                    title="Régénérer via Pixabay/AI"
                  >
                    {state.kind === "loading" ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      <>
                        <RefreshCw size={11} />
                        Régénérer
                      </>
                    )}
                  </button>

                  {/* Upload custom */}
                  <button
                    type="button"
                    onClick={() => triggerFilePicker(m.slug)}
                    disabled={state.kind === "loading"}
                    className="inline-flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-300 text-[0.65rem] font-bold text-emerald-700 disabled:opacity-50 disabled:cursor-wait transition"
                    title="Uploader ta propre photo"
                  >
                    <Upload size={11} />
                    Uploader
                  </button>

                  {/* File input caché */}
                  <input
                    ref={(el) => {
                      fileInputs.current[m.slug] = el;
                    }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadCustom(m.slug, f);
                      e.target.value = ""; // permet de re-uploader la même image
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
