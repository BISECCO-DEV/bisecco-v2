"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2, Check } from "lucide-react";

export type AddressSelection = {
  /** Adresse normalisée affichée à l'utilisateur ("15 Rue d'Antibes 06400 Cannes") */
  label: string;
  /** Numéro + rue sans ville ni CP ("15 Rue d'Antibes") */
  street?: string;
  /** Code postal */
  postcode: string;
  /** Ville normalisée */
  city: string;
  /** Latitude exacte */
  latitude: number;
  /** Longitude exacte */
  longitude: number;
};

type Suggestion = AddressSelection & {
  type: "housenumber" | "street" | "locality" | "municipality" | string;
};

type ApiFeature = {
  geometry: { coordinates: [number, number] };
  properties: {
    label: string;
    type: string;
    postcode?: string;
    city?: string;
    name?: string;
    street?: string;
    housenumber?: string;
  };
};

type Props = {
  /** Valeur initiale (label complet) */
  initialValue?: string;
  /** Coords actuelles pour afficher le ✅ même sans recherche */
  initialCoords?: { latitude: number | null; longitude: number | null };
  /** Callback appelé quand l'utilisateur choisit une adresse */
  onSelect: (selection: AddressSelection) => void;
  /** Label du champ */
  label?: string;
  /** Placeholder */
  placeholder?: string;
  /** Permet de saisir juste une ville (sans numéro de rue) */
  allowCityOnly?: boolean;
  /** Nom du champ (utile pour les forms server actions) */
  name?: string;
  /** Marquer comme requis */
  required?: boolean;
};

export function AddressAutocomplete({
  initialValue = "",
  initialCoords,
  onSelect,
  label = "Adresse",
  placeholder = "15 Rue d'Antibes, Cannes",
  allowCityOnly = false,
  name,
  required,
}: Props) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(
    initialCoords?.latitude != null && initialCoords.longitude != null ? initialValue : null,
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Fetch debounced
  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    if (query === selectedLabel) {
      // L'utilisateur n'a pas modifié sa sélection
      setSuggestions([]);
      return;
    }

    const handler = setTimeout(() => {
      // Annule la requête précédente si encore en vol
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=8&autocomplete=1`,
        { signal: controller.signal, headers: { Accept: "application/json" } },
      )
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error("API Adresse erreur"))))
        .then((data: { features: ApiFeature[] }) => {
          const results: Suggestion[] = (data.features ?? [])
            .map((f) => {
              if (!allowCityOnly && (f.properties.type === "municipality" || f.properties.type === "locality")) {
                // Si on demande une adresse précise, on filtre les villes seules
                return null;
              }
              const street = [f.properties.housenumber, f.properties.street ?? f.properties.name]
                .filter(Boolean)
                .join(" ");
              return {
                label: f.properties.label,
                street: street || undefined,
                postcode: f.properties.postcode ?? "",
                city: f.properties.city ?? f.properties.name ?? "",
                latitude: f.geometry.coordinates[1],
                longitude: f.geometry.coordinates[0],
                type: f.properties.type,
              } as Suggestion;
            })
            .filter((r): r is Suggestion => r !== null);
          setSuggestions(results);
          setOpen(true);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error("[AddressAutocomplete]", err);
          }
        })
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(handler);
  }, [query, selectedLabel, allowCityOnly]);

  // Ferme le dropdown si clic en dehors
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handlePick = (s: Suggestion) => {
    setQuery(s.label);
    setSelectedLabel(s.label);
    setOpen(false);
    onSelect({
      label: s.label,
      street: s.street,
      postcode: s.postcode,
      city: s.city,
      latitude: s.latitude,
      longitude: s.longitude,
    });
  };

  const isConfirmed = selectedLabel === query && query.length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full">
      <label className="text-[0.7rem] text-ink-400 font-bold tracking-wider uppercase block mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition ${
          isConfirmed
            ? "border-emerald-400 bg-emerald-50/40"
            : "border-ink-200 bg-white focus-within:border-brand-500"
        }`}
      >
        <MapPin
          size={16}
          className={isConfirmed ? "text-emerald-500" : "text-ink-400"}
          strokeWidth={2.4}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedLabel(null);
          }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          required={required}
          name={name}
          className="flex-1 bg-transparent outline-none text-sm text-ink-700 placeholder:text-ink-300"
          autoComplete="off"
          spellCheck={false}
        />
        {loading ? (
          <Loader2 size={14} className="animate-spin text-ink-400" />
        ) : isConfirmed ? (
          <Check size={16} className="text-emerald-500" strokeWidth={3} />
        ) : null}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-ink-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
          {suggestions.map((s) => (
            <li key={`${s.label}-${s.latitude}-${s.longitude}`}>
              <button
                type="button"
                onClick={() => handlePick(s)}
                className="w-full text-left px-4 py-2.5 hover:bg-brand-50 transition flex items-start gap-3 border-b border-ink-100 last:border-b-0"
              >
                <MapPin
                  size={14}
                  className={
                    s.type === "housenumber" ? "text-emerald-500 mt-0.5" : "text-ink-400 mt-0.5"
                  }
                  strokeWidth={2.4}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-ink-700 truncate">{s.label}</div>
                  <div className="text-[0.7rem] text-ink-400 uppercase tracking-wider">
                    {s.type === "housenumber"
                      ? "Adresse exacte"
                      : s.type === "street"
                        ? "Rue"
                        : s.type === "locality"
                          ? "Lieu-dit"
                          : "Ville"}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-1 text-[0.7rem] text-ink-400">
        Tape ton adresse et choisis dans la liste — c&apos;est l&apos;adresse exacte qui sera
        utilisée pour ta géolocalisation sur la carte.
      </p>
    </div>
  );
}
