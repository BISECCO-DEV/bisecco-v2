"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Filter, Star } from "lucide-react";
import { ArtisansMap } from "@/components/features/ArtisansMapWrapper";
import { MetierCombobox } from "@/components/ui/MetierCombobox";

const DEMO_ARTISANS = [
  { id: "1", name: "Jean Dupont",    metier: "Maçon",      city: "Meaux",   rating: 4.8, reviews: 23 },
  { id: "2", name: "Hugo Martin",    metier: "Carreleur",  city: "Chelles", rating: 4.9, reviews: 41 },
  { id: "3", name: "Marc Lefevre",   metier: "Menuisier",  city: "Lille",   rating: 4.7, reviews: 18 },
  { id: "4", name: "Sophie Lambert", metier: "Couvreur",   city: "Nantes",  rating: 5.0, reviews: 12 },
];

const QUICK_METIERS = ["Plombier", "Électricien", "Maçon", "Peintre", "Menuisier", "Couvreur"];

export function SearchClient() {
  const [metier, setMetier] = useState("");
  const [city, setCity] = useState("");

  const filtered = useMemo(() => {
    return DEMO_ARTISANS.filter((a) => {
      const matchMetier =
        !metier || a.metier.toLowerCase().includes(metier.toLowerCase());
      const matchCity =
        !city || a.city.toLowerCase().includes(city.toLowerCase());
      return matchMetier && matchCity;
    });
  }, [metier, city]);

  return (
    <>
      {/* Barre de recherche */}
      <div className="mt-8 bg-white rounded-2xl shadow-card border border-ink-100 p-2 flex flex-col md:flex-row items-stretch gap-2">
        {/* Métier — combobox */}
        <div className="flex-1 min-w-0">
          <MetierCombobox
            value={metier}
            onChange={setMetier}
            placeholder="Quel métier ? (plombier, électricien...)"
            variant="light"
            label="MÉTIER"
          />
        </div>

        {/* Ville */}
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

        <button className="btn-primary px-7">
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
        <div className="order-2 lg:order-1">
          <ArtisansMap />
        </div>

        <aside className="order-1 lg:order-2 space-y-4">
          <div className="bg-white rounded-2xl border border-ink-100 p-4 shadow-card flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-brand-500" />
              <span className="font-bold text-ink-700 text-sm">
                {filtered.length} artisan{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
              </span>
            </div>
            <select className="text-xs bg-ink-50 border border-ink-200 rounded-lg px-2 py-1 text-ink-600 outline-none">
              <option>Note ↓</option>
              <option>Distance ↑</option>
              <option>Récent</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-ink-100 p-10 text-center text-ink-400 text-sm shadow-card">
              Aucun artisan ne correspond à votre recherche.
              <button
                onClick={() => { setMetier(""); setCity(""); }}
                className="block mx-auto mt-3 text-brand-500 font-bold hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            filtered.map((a) => (
              <Link
                key={a.id}
                href={`/profil/${a.id}`}
                className="block bg-white rounded-2xl border border-ink-100 p-4 shadow-card hover:-translate-y-0.5 hover:border-brand-500 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white font-bold flex items-center justify-center flex-shrink-0">
                    {a.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-ink-700 truncate">{a.name}</div>
                    <div className="text-xs text-ink-400 flex items-center gap-1.5">
                      <span>{a.metier}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin size={11} /> {a.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 text-xs">
                      <Star size={12} fill="#f07a2f" className="text-brand-500" />
                      <span className="font-bold text-ink-700">{a.rating}</span>
                      <span className="text-ink-400">({a.reviews} avis)</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </aside>
      </div>
    </>
  );
}
