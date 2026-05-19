"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Plus, Check, Briefcase, Sparkles } from "lucide-react";
import { METIER_OPTIONS, type MetierOption } from "@/lib/metiers";

export type MetierPick = {
  name: string;
  slug: string | null; // null = métier custom (pas dans la liste)
  isCustom?: boolean;
};

type Props = {
  /** Métiers déjà sélectionnés (controlled) */
  value: MetierPick[];
  /** Callback à chaque changement */
  onChange: (v: MetierPick[]) => void;
  /** Nombre max de métiers sélectionnables (défaut: 3) */
  max?: number;
  /** Variante d'apparence */
  variant?: "light" | "dark";
};

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function slugifyCustom(name: string): string {
  return normalize(name)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export function MultiMetierPicker({ value, onChange, max = 3, variant = "light" }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reachedMax = value.length >= max;

  // Liste filtrée + dédupliquée (tous les métiers visibles, pas de limite)
  const filtered = useMemo(() => {
    const selectedSlugs = new Set(value.map((v) => v.slug).filter(Boolean));
    const notSelected = METIER_OPTIONS.filter(
      (m) => !selectedSlugs.has(slugifyCustom(m.name)),
    );
    if (!query.trim()) return notSelected;
    const q = normalize(query);
    return notSelected.filter(
      (m) => normalize(m.name).includes(q) || normalize(m.category).includes(q),
    );
  }, [query, value]);

  // Détection du métier custom (saisie libre)
  const trimmedQuery = query.trim();
  const isExactMatch = filtered.some((m) => normalize(m.name) === normalize(trimmedQuery));
  const showCustomOption =
    trimmedQuery.length >= 3 &&
    !isExactMatch &&
    !value.some((v) => normalize(v.name) === normalize(trimmedQuery));

  // Click outside → ferme
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const addExisting = (m: MetierOption) => {
    if (reachedMax) return;
    onChange([...value, { name: m.name, slug: slugifyCustom(m.name) }]);
    setQuery("");
    inputRef.current?.focus();
  };

  const addCustom = () => {
    if (reachedMax || !trimmedQuery) return;
    onChange([...value, { name: trimmedQuery, slug: null, isCustom: true }]);
    setQuery("");
    inputRef.current?.focus();
  };

  const remove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const inputClass =
    variant === "light"
      ? "w-full pl-9 pr-3 py-2.5 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm"
      : "w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/10 border-2 border-white/15 focus:border-brand-400 outline-none transition text-sm text-white placeholder-white/40";

  return (
    <div ref={containerRef} className="relative">
      {/* Tags sélectionnés */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {value.map((m, i) => (
            <span
              key={`${m.slug ?? m.name}-${i}`}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border-2 ${
                m.isCustom
                  ? "bg-amber-50 border-amber-300 text-amber-800"
                  : "bg-brand-50 border-brand-300 text-brand-700"
              }`}
            >
              {m.isCustom ? <Sparkles size={11} /> : <Briefcase size={11} />}
              {m.name}
              {m.isCustom && (
                <span className="text-[0.6rem] font-extrabold uppercase tracking-wider opacity-70">
                  custom
                </span>
              )}
              <button
                type="button"
                onClick={() => remove(i)}
                className="hover:text-red-600 transition"
                aria-label="Retirer"
              >
                <X size={11} strokeWidth={3} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input recherche */}
      {!reachedMax && (
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (filtered.length > 0 && filtered[0]) {
                  addExisting(filtered[0]);
                } else if (showCustomOption) {
                  addCustom();
                }
              }
            }}
            placeholder={value.length === 0 ? "Plombier, Boulanger, ..." : `Ajouter (${value.length}/${max})`}
            className={inputClass}
          />
        </div>
      )}

      {reachedMax && (
        <p className="text-xs text-ink-500 mt-1 italic">
          Maximum {max} métiers atteint. Retire un tag pour en ajouter un autre.
        </p>
      )}

      {/* Dropdown résultats */}
      {open && !reachedMax && (query.length > 0 || filtered.length > 0) && (
        <div className="absolute z-50 mt-2 w-full max-h-[60vh] overflow-y-auto bg-white rounded-xl border-2 border-ink-100 shadow-2xl">
          {/* Option : créer un métier custom */}
          {showCustomOption && (
            <button
              type="button"
              onClick={addCustom}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-amber-50 border-b border-ink-100 group"
            >
              <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Plus size={15} strokeWidth={2.5} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-ink-700 text-sm">
                  Ajouter « <span className="text-amber-700">{trimmedQuery}</span> »
                </div>
                <div className="text-[0.7rem] text-ink-500">
                  Métier personnalisé · validation admin sous 24h
                </div>
              </div>
            </button>
          )}

          {/* Liste des métiers existants */}
          {filtered.length === 0 && !showCustomOption && (
            <div className="px-4 py-6 text-center text-ink-400 text-sm">
              Aucun métier trouvé. Tape au moins 3 caractères pour ajouter un métier personnalisé.
            </div>
          )}

          {filtered.map((m, idx) => {
            const prevCat = idx > 0 ? filtered[idx - 1]?.category : null;
            const showHeader = !query.trim() && m.category !== prevCat;
            return (
              <div key={m.name}>
                {showHeader && (
                  <div className="px-3 py-1.5 bg-ink-50 sticky top-0 text-[0.66rem] font-extrabold tracking-wider uppercase text-ink-500 border-b border-ink-100">
                    {m.category}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => addExisting(m)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-ink-50 group transition"
                >
                  <span className="text-xl flex-shrink-0">{m.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-ink-700 text-sm group-hover:text-brand-600">
                      {m.name}
                    </div>
                    {query.trim() && (
                      <div className="text-[0.7rem] text-ink-400">{m.category}</div>
                    )}
                  </div>
                  <Check size={13} className="text-ink-300 group-hover:text-brand-500" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
