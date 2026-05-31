"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Filter, Star, Loader2 } from "lucide-react";
import { MetierCombobox } from "@/components/ui/MetierCombobox";
import type { MetierOption } from "@/lib/metiers";
import { artisanProfilePath } from "@/lib/utils";

// Carte interactive (même que la homepage) · lazy-loaded car Leaflet est lourd
const LocalSearchMap = dynamic(
  () => import("@/components/features/LocalSearchMap").then((m) => m.LocalSearchMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-ink-100/40">
        <Loader2 size={20} className="animate-spin text-ink-400" />
      </div>
    ),
  },
);

export type ArtisanCard = {
  /** client_number ou id (string) · utilisé pour générer le slug URL */
  id: string;
  name: string;
  company: string | null;
  metier: string;
  city: string;
  rating: number;
  reviews: number;
  avatar?: string;
  lat: number;
  lng: number;
};

const QUICK_METIERS = ["Plombier", "Électricien", "Maçon", "Peintre", "Menuisier", "Couvreur"];

type SortBy = "rating" | "recent" | "name";

export function SearchClient({ artisans, metierOptions }: { artisans: ArtisanCard[]; metierOptions?: MetierOption[] }) {
  const [metier, setMetier] = useState("");
  const [city, setCity] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("rating");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusTarget, setFocusTarget] = useState<[number, number] | null>(null);

  const filtered = useMemo(() => {
    const m = metier.trim().toLowerCase();
    const c = city.trim().toLowerCase();
    const list = artisans.filter((a) => {
      const matchMetier = !m || a.metier.toLowerCase().includes(m);
      const matchCity = !c || a.city.toLowerCase().includes(c);
      return matchMetier && matchCity;
    });

    const sorted = [...list];
    if (sortBy === "rating") {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }, [artisans, metier, city, sortBy]);

  return (
    <>
      {/* Barre de recherche */}
      <div className="mt-8 bg-white rounded-2xl shadow-card border border-ink-100 p-2 flex flex-col md:flex-row items-stretch gap-2">
        <div className="flex-1 min-w-0">
          <MetierCombobox
            value={metier}
            onChange={setMetier}
            placeholder="Quel métier ? (plombier, électricien...)"
            variant="light"
            label="MÉTIER"
            options={metierOptions}
          />
        </div>

        <div className="flex-1 flex items-center gap-2 px-4 rounded-xl border-2 border-ink-200 bg-ink-50 focus-within:border-brand-500 focus-within:bg-white transition">
          <MapPin size={18} className="text-ink-300 flex-shrink-0" />
          <div className="flex-1 min-w-0 py-1">
            <label className="text-[0.65rem] text-ink-400 font-bold tracking-wider uppercase block">
              Ville
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Dans quelle ville ?"
              className="w-full bg-transparent outline-none text-sm text-ink-700 placeholder:text-ink-300"
            />
          </div>
        </div>

        <button type="button" className="btn-primary px-7">
          <Search size={18} /> Rechercher
        </button>
      </div>

      {/* Chips rapides */}
      <div className="flex flex-wrap gap-2 mt-6">
        {QUICK_METIERS.map((m) => {
          const active = metier === m;
          return (
            <button
              key={m}
              onClick={() => setMetier(active ? "" : m)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                active
                  ? "bg-brand-500 text-white shadow-[0_4px_12px_rgba(240,122,47,0.35)]"
                  : "bg-white border border-ink-100 text-ink-600 hover:border-brand-500 hover:text-brand-500"
              }`}
            >
              {m}
            </button>
          );
        })}
      </div>

      {/* Map + liste */}
      <div className="mt-10 grid lg:grid-cols-[1fr_400px] gap-6">
        <div className="order-2 lg:order-1 rounded-2xl overflow-hidden border border-ink-100 shadow-card bg-ink-100 h-[500px] lg:h-[700px] lg:sticky lg:top-24">
          <LocalSearchMap
            artisans={filtered.map((a) => ({
              id: a.id,
              name: a.name,
              company: a.company ?? a.name,
              metier: a.metier,
              city: a.city,
              rating: a.rating,
              reviews: a.reviews,
              lat: a.lat,
              lng: a.lng,
              avatar: a.avatar,
            }))}
            hoveredId={hoveredId}
            userPos={null}
            focusTarget={focusTarget}
          />
        </div>

        <aside className="order-1 lg:order-2 space-y-4">
          <div className="bg-white rounded-2xl border border-ink-100 p-4 shadow-card flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-brand-500" />
              <span className="font-bold text-ink-700 text-sm">
                {filtered.length} artisan{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
              </span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="text-xs bg-ink-50 border border-ink-200 rounded-lg px-2 py-1 text-ink-600 outline-none cursor-pointer"
            >
              <option value="rating">Mieux notés</option>
              <option value="name">Nom (A-Z)</option>
              <option value="recent">Récent</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-ink-100 p-10 text-center text-ink-400 text-sm shadow-card">
              {artisans.length === 0
                ? "Aucun artisan validé pour le moment. Soyez le premier à vous inscrire !"
                : "Aucun artisan ne correspond à votre recherche."}
              {artisans.length > 0 && (
                <button
                  onClick={() => { setMetier(""); setCity(""); }}
                  className="block mx-auto mt-3 text-brand-500 font-bold hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
              {filtered.map((a) => (
                <Link
                  key={a.id}
                  href={artisanProfilePath(a.company || a.name, a.id)}
                  onMouseEnter={() => { setHoveredId(a.id); setFocusTarget([a.lat, a.lng]); }}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`block bg-white rounded-2xl border p-4 shadow-card transition ${
                    hoveredId === a.id
                      ? "border-brand-500 -translate-y-0.5 shadow-[0_10px_30px_-10px_rgba(240,122,47,0.35)]"
                      : "border-ink-100 hover:-translate-y-0.5 hover:border-brand-500"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {a.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.avatar}
                        alt={a.name}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white font-bold flex items-center justify-center flex-shrink-0">
                        {a.name[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {/* Titre = société si présente, sinon nom du gérant */}
                      <div className="font-bold text-ink-700 truncate">
                        {a.company && a.company !== a.name ? a.company : a.name.split(" - ")[0]}
                      </div>
                      {a.company && a.company !== a.name && (
                        <div className="text-[0.72rem] text-ink-500 truncate">
                          Gérant&nbsp;: {a.name.split(" - ")[0]}
                        </div>
                      )}
                      <div className="text-xs text-ink-400 flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 font-semibold text-[0.66rem]">
                          {a.metier}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <MapPin size={11} /> {a.city}
                        </span>
                      </div>
                      {a.reviews > 0 ? (
                        <div className="flex items-center gap-1 mt-1.5 text-xs">
                          <Star size={12} fill="#f07a2f" className="text-brand-500" />
                          <span className="font-bold text-ink-700">{a.rating}</span>
                          <span className="text-ink-400">({a.reviews} avis)</span>
                        </div>
                      ) : (
                        <div className="text-[0.7rem] text-ink-400 mt-1.5">Nouveau profil</div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
