"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2, X } from "lucide-react";

export type CitySelection = {
  /** Nom de la ville · "Meaux" */
  name: string;
  /** Code postal principal · "77100" */
  postcode: string;
  /** Code département · "77" (ou "2a", "2b" pour Corse, "971-976" DOM-TOM) */
  department: string;
  /** Latitude */
  latitude: number;
  /** Longitude */
  longitude: number;
};

type ApiFeature = {
  geometry: { coordinates: [number, number] };
  properties: {
    label: string;
    name: string;
    postcode?: string;
    citycode?: string;
    context?: string; // "77, Seine-et-Marne, Île-de-France"
    type: string;
    score: number;
  };
};

type Props = {
  /** Valeur initiale (nom de ville) */
  value?: string;
  /** Callback quand l'utilisateur tape ou choisit · met à jour la query ville parente */
  onChange: (cityName: string) => void;
  /** Callback quand l'utilisateur sélectionne une ville dans la liste */
  onSelect?: (city: CitySelection) => void;
  /** Placeholder du champ */
  placeholder?: string;
  /** Label affiché au-dessus (genre "OÙ ?") */
  label?: string;
  /** Theme · "light" (fond blanc) ou "dark" (fond sombre, pour la home) */
  variant?: "light" | "dark";
  /** Si tu veux le bouton géolocalisation à droite */
  rightSlot?: React.ReactNode;
};

/**
 * Combobox de ville avec autocomplétion via API Adresse (data.gouv.fr).
 *
 * - Cherche dans toutes les communes françaises (8 départements IDF inclus)
 * - Filtre type=municipality pour ne montrer que des villes (pas de rues)
 * - Affiche : "Meaux (77100) · Seine-et-Marne"
 * - Tape "77" → tu vois toutes les communes du 77
 * - Tape "Saint" → tu vois Saint-Denis, Saint-Soupplets, Saint-Cloud, etc.
 */
export function CityCombobox({
  value = "",
  onChange,
  onSelect,
  placeholder = "Votre ville",
  label = "OÙ ?",
  variant = "light",
  rightSlot,
}: Props) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<CitySelection[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Sync valeur externe (ex: reset depuis le parent)
  useEffect(() => setQuery(value), [value]);

  // Fetch debounced
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const handler = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=10&type=municipality&autocomplete=1`;
      fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } })
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error("API Adresse erreur"))))
        .then((data: { features: ApiFeature[] }) => {
          const results: CitySelection[] = (data.features ?? []).map((f) => {
            // Extract dept from context "77, Seine-et-Marne, Île-de-France"
            const ctx = f.properties.context ?? "";
            const dept = ctx.split(",")[0]?.trim() ?? "";
            return {
              name: f.properties.name,
              postcode: f.properties.postcode ?? "",
              department: dept,
              latitude: f.geometry.coordinates[1],
              longitude: f.geometry.coordinates[0],
            };
          });
          setSuggestions(results);
          setOpen(results.length > 0);
          setHighlight(-1);
        })
        .catch((err) => {
          if (err.name !== "AbortError") console.error("[CityCombobox]", err);
        })
        .finally(() => setLoading(false));
    }, 200);

    return () => clearTimeout(handler);
  }, [query]);

  // Ferme au clic en dehors
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handlePick = (city: CitySelection) => {
    setQuery(city.name);
    onChange(city.name);
    onSelect?.(city);
    setOpen(false);
    setHighlight(-1);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && highlight >= 0) {
      e.preventDefault();
      handlePick(suggestions[highlight]!);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const clear = () => {
    setQuery("");
    onChange("");
    setSuggestions([]);
    setOpen(false);
  };

  // ─── Styles selon variant ──────────────────────────────────────────
  const isDark = variant === "dark";
  const wrapperCls = isDark
    ? "flex items-center gap-2.5 px-4 py-3 rounded-xl bg-ink-900/50 border border-white/10 focus-within:border-brand-500/50 transition"
    : "flex items-center gap-2 px-4 rounded-xl border-2 border-ink-200 bg-ink-50 focus-within:border-brand-500 focus-within:bg-white transition";
  const labelCls = isDark
    ? "text-[0.65rem] text-white/40 font-bold tracking-wider uppercase block"
    : "text-[0.65rem] text-ink-400 font-bold tracking-wider uppercase block";
  const iconCls = isDark ? "text-white/40 flex-shrink-0" : "text-ink-300 flex-shrink-0";
  const inputCls = isDark
    ? "w-full bg-transparent text-white text-sm outline-none placeholder:text-white/30"
    : "w-full bg-transparent outline-none text-sm text-ink-700 placeholder:text-ink-300";
  const dropdownCls = isDark
    ? "absolute z-50 mt-1 w-full bg-ink-900 border border-white/15 rounded-xl shadow-xl max-h-72 overflow-y-auto"
    : "absolute z-50 mt-1 w-full bg-white border border-ink-200 rounded-xl shadow-xl max-h-72 overflow-y-auto";
  const itemCls = (active: boolean) =>
    isDark
      ? `w-full text-left px-4 py-2.5 transition flex items-center gap-3 border-b border-white/5 last:border-b-0 ${
          active ? "bg-brand-500/15 text-white" : "text-white/85 hover:bg-white/[0.06]"
        }`
      : `w-full text-left px-4 py-2.5 transition flex items-center gap-3 border-b border-ink-100 last:border-b-0 ${
          active ? "bg-brand-50 text-brand-700" : "text-ink-700 hover:bg-ink-50"
        }`;

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className={wrapperCls}>
        <MapPin size={16} className={iconCls} />
        <div className="flex-1 min-w-0 py-1">
          <label className={labelCls}>{label}</label>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onChange(e.target.value);
            }}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            onKeyDown={handleKey}
            placeholder={placeholder}
            className={inputCls}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {loading && <Loader2 size={14} className={isDark ? "animate-spin text-white/40" : "animate-spin text-ink-400"} />}

        {!loading && query.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className={isDark ? "text-white/40 hover:text-white/70" : "text-ink-400 hover:text-ink-600"}
            aria-label="Effacer"
          >
            <X size={14} />
          </button>
        )}

        {rightSlot}
      </div>

      {open && suggestions.length > 0 && (
        <ul className={dropdownCls}>
          {suggestions.map((city, i) => (
            <li key={`${city.name}-${city.postcode}-${city.latitude}-${city.longitude}`}>
              <button
                type="button"
                onClick={() => handlePick(city)}
                onMouseEnter={() => setHighlight(i)}
                className={itemCls(highlight === i)}
              >
                <MapPin
                  size={13}
                  className={
                    highlight === i
                      ? isDark
                        ? "text-brand-400"
                        : "text-brand-500"
                      : isDark
                        ? "text-white/40"
                        : "text-ink-400"
                  }
                  strokeWidth={2.2}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{city.name}</div>
                  <div
                    className={
                      isDark
                        ? "text-[0.65rem] text-white/45 mt-0.5"
                        : "text-[0.65rem] text-ink-400 mt-0.5"
                    }
                  >
                    {city.postcode} · Département {city.department}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
