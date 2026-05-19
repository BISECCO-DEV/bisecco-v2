"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Search, Navigation, ArrowRight, Loader2 } from "lucide-react";
import type { Artisan } from "./LocalSearchMap";
import { MetierCombobox } from "@/components/ui/MetierCombobox";

const LocalSearchMap = dynamic(
  () => import("./LocalSearchMap").then((m) => m.LocalSearchMap),
  { ssr: false, loading: () => <MapSkeleton /> }
);

const DEMO_ARTISANS: Artisan[] = [
  { id: "1", name: "Jean Dupont", company: "Dupont Maçonnerie", metier: "Maçon", city: "Meaux", rating: 4.8, reviews: 23, lat: 48.961, lng: 2.879, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces" },
  { id: "2", name: "Hugo Martin", company: "Martin Carrelage", metier: "Carreleur", city: "Chelles", rating: 4.9, reviews: 41, lat: 48.880, lng: 2.594, avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop&crop=faces" },
  { id: "3", name: "Marc Lefevre", company: "Lefevre Menuiserie", metier: "Menuisier", city: "Lagny-sur-Marne", rating: 4.7, reviews: 18, lat: 48.872, lng: 2.713, avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&h=120&fit=crop&crop=faces" },
  { id: "4", name: "Sophie Lambert", company: "Lambert Toiture", metier: "Couvreur", city: "Melun", rating: 5.0, reviews: 12, lat: 48.5395, lng: 2.6614, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=faces" },
  { id: "5", name: "Emma Delcroix", company: "Delcroix Plomberie", metier: "Plombier", city: "Pontault-Combault", rating: 4.6, reviews: 31, lat: 48.793, lng: 2.610, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces" },
  { id: "6", name: "Karim Benali", company: "Benali Carrelage", metier: "Carreleur", city: "Noisy-le-Grand", rating: 4.7, reviews: 28, lat: 48.846, lng: 2.553, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces" },
];

const METIERS = ["Tous", "Plombier", "Électricien", "Maçon", "Carreleur", "Menuisier", "Couvreur", "Peintre"];


/** Distance Haversine en km */
function distanceKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

type LocalSearchProps = {
  /** Liste d'artisans à afficher (depuis Supabase). Si vide ou non fourni → fallback démo */
  artisans?: Artisan[];
};

export function LocalSearch({ artisans }: LocalSearchProps = {}) {
  const dataSource = artisans && artisans.length > 0 ? artisans : DEMO_ARTISANS;
  const [query, setQuery] = useState({ metier: "", ville: "" });
  const [activeMetier, setActiveMetier] = useState("Tous");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusTarget, setFocusTarget] = useState<[number, number] | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  /** Filtre les artisans selon query + métier sélectionné */
  const filtered = useMemo(() => {
    return dataSource.filter((a) => {
      const matchMetier =
        activeMetier === "Tous" || a.metier === activeMetier;
      const matchQuery =
        !query.metier ||
        a.metier.toLowerCase().includes(query.metier.toLowerCase()) ||
        a.name.toLowerCase().includes(query.metier.toLowerCase());
      const matchVille =
        !query.ville || a.city.toLowerCase().includes(query.ville.toLowerCase());
      return matchMetier && matchQuery && matchVille;
    });
  }, [query, activeMetier, dataSource]);

  /** Trie par distance si position user connue */
  const sorted = useMemo(() => {
    if (!userPos) return filtered;
    return [...filtered].sort(
      (a, b) =>
        distanceKm(userPos, [a.lat, a.lng]) - distanceKm(userPos, [b.lat, b.lng])
    );
  }, [filtered, userPos]);

  /** Géolocalisation */
  const geolocate = () => {
    if (typeof window === "undefined" || !navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(coords);
        setFocusTarget(coords);
        setGeoLoading(false);
      },
      () => {
        setGeoLoading(false);
        alert("Géolocalisation refusée. Activez-la dans votre navigateur.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <section className="relative py-20 sm:py-28 bg-[#0a1d44] overflow-hidden">
      {/* Pattern hexagones SVG (même que partenaires officiels) */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='84' height='96' viewBox='0 0 84 96'><path d='M42 0L84 24v48L42 96 0 72V24z' fill='none' stroke='%23ffffff' stroke-width='1.2'/></svg>")`,
          backgroundSize: "84px 96px",
        }}
      />
      {/* Halos */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[500px] rounded-full bg-brand-500/[0.10] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/[0.10] blur-[140px] pointer-events-none" />

      <div className="container-default relative">
        {/* Header premium */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-[0.7rem] font-bold tracking-[0.14em] uppercase backdrop-blur-sm">
            <MapPin size={11} strokeWidth={2.6} className="text-brand-400" />
            Recherche locale
          </span>
          <h2 className="mt-5 text-[32px] sm:text-[42px] lg:text-[52px] leading-[1.05] font-extrabold text-white tracking-[-0.025em]">
            Trouvez les meilleurs{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-brand-500 bg-clip-text text-transparent animate-gradient-flow" style={{ backgroundSize: "200% 100%" }}>
                artisans
              </span>
            </span>
            <br className="hidden sm:block" />
            <span className="text-white"> près de chez vous</span>
            <span className="text-brand-500">.</span>
          </h2>
          <p className="mt-5 text-[0.96rem] sm:text-[1.05rem] text-white/65 leading-relaxed max-w-xl mx-auto">
            Cherchez par <strong className="text-white">métier</strong> et
            <strong className="text-white"> localisation</strong>, comparez les profils
            <strong className="text-white"> vérifiés SIREN</strong> et contactez directement.
          </p>

          {/* Mini stats row */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[0.8rem]">
            <div className="flex items-center gap-2 text-white/65">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-300 text-[0.7rem] font-extrabold">
                <Search size={11} strokeWidth={2.6} />
              </span>
              Recherche instantanée
            </div>
            <span className="text-white/15 hidden sm:inline">·</span>
            <div className="flex items-center gap-2 text-white/65">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              Profils SIREN vérifiés
            </div>
            <span className="text-white/15 hidden sm:inline">·</span>
            <div className="flex items-center gap-2 text-white/65">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300">
                <Navigation size={11} strokeWidth={2.4} />
              </span>
              Géolocalisation auto
            </div>
          </div>
        </div>

        {/* Layout : 2 colonnes recherche + carte */}
        <div className="grid lg:grid-cols-[440px_1fr] gap-5 mb-8">
          {/* Panel recherche */}
          <div className="rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-sm p-7 flex flex-col">
            {/* Live indicator */}
            <div className="flex items-center justify-between mb-5">
              <div className="inline-flex items-center gap-2 text-xs text-white/85 font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                Artisans en ligne
              </div>
              <span className="text-xs text-white/50">
                <strong className="text-white">{sorted.length}</strong> {sorted.length > 1 ? "résultats" : "résultat"}
              </span>
            </div>

            {/* Form */}
            <div className="space-y-3">
              <MetierCombobox
                value={query.metier}
                onChange={(v) => setQuery((q) => ({ ...q, metier: v }))}
                placeholder="Maçon, électricien…"
              />

              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-ink-900/50 border border-white/10 focus-within:border-brand-500/50 transition">
                <MapPin size={16} className="text-white/40 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="text-[0.65rem] text-white/40 font-bold tracking-wider uppercase block">Où ?</label>
                  <input
                    type="text"
                    value={query.ville}
                    onChange={(e) => setQuery((q) => ({ ...q, ville: e.target.value }))}
                    placeholder="Votre ville"
                    className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/30"
                  />
                </div>
                <button
                  type="button"
                  onClick={geolocate}
                  disabled={geoLoading}
                  className="text-blue-400 hover:text-blue-300 transition"
                  aria-label="Me géolocaliser"
                  title="Me géolocaliser"
                >
                  {geoLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Navigation size={16} className={userPos ? "fill-current" : ""} />
                  )}
                </button>
              </div>

              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 text-white font-bold shadow-[0_8px_24px_rgba(240,122,47,0.35)] hover:bg-brand-600 hover:-translate-y-0.5 transition-all"
              >
                <Search size={16} /> Rechercher
              </button>
            </div>

            {/* User position info */}
            {userPos && (
              <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200">
                <div className="flex items-center gap-2">
                  <Navigation size={12} className="fill-current text-blue-400" />
                  <span>Position détectée — tri par distance activé</span>
                </div>
              </div>
            )}

            {/* Filtres rapides */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="text-[0.65rem] text-white/40 font-bold tracking-wider uppercase mb-3">
                Métiers populaires
              </div>
              <div className="flex flex-wrap gap-1.5">
                {METIERS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setActiveMetier(m)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                      activeMetier === m
                        ? "bg-brand-500 text-white shadow-[0_4px_12px_rgba(240,122,47,0.4)]"
                        : "bg-white/5 text-white/65 hover:bg-white/10"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-3xl overflow-hidden border border-white/10 bg-ink-900/30 h-[480px] lg:h-auto relative">
            <LocalSearchMap
              artisans={sorted}
              hoveredId={hoveredId}
              userPos={userPos}
              focusTarget={focusTarget}
            />

            {/* Overlay info en haut à gauche de la carte */}
            <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-md rounded-xl px-3 py-2 shadow-card text-xs pointer-events-none">
              <div className="font-bold text-ink-700">
                {sorted.length} artisan{sorted.length > 1 ? "s" : ""} affiché{sorted.length > 1 ? "s" : ""}
              </div>
              {userPos && (
                <div className="text-ink-400 text-[10px]">Rayon de recherche 25 km</div>
              )}
            </div>
          </div>
        </div>

        {/* Carousel artisans recommandés */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold text-white">
              {userPos ? "Artisans près de vous" : "Artisans recommandés"}
            </h3>
            <Link
              href="/rechercher"
              className="text-sm text-brand-400 hover:text-brand-300 font-semibold inline-flex items-center gap-1"
            >
              Voir tous <ArrowRight size={14} />
            </Link>
          </div>

          {sorted.length === 0 ? (
            <div className="w-full text-center py-12 text-white/50 text-sm">
              Aucun artisan ne correspond à votre recherche. Essayez d&apos;élargir vos critères.
            </div>
          ) : (
            <div
              className="group relative overflow-hidden -mx-4"
              style={{ maskImage: "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)" }}
            >
              <div
                className="flex gap-4 w-max animate-marquee group-hover:[animation-play-state:paused]"
                style={{ animationDuration: `${Math.max(20, sorted.length * 5)}s` }}
              >
                {/* On duplique la liste pour un défilement seamless */}
                {[...sorted, ...sorted].map((a, idx) => {
                  const dist = userPos ? distanceKm(userPos, [a.lat, a.lng]) : null;
                  return (
                    <ArtisanCard
                      key={`${a.id}-${idx}`}
                      artisan={a}
                      distance={dist}
                      isHovered={hoveredId === a.id}
                      onHover={() => setHoveredId(a.id)}
                      onLeave={() => setHoveredId(null)}
                      onClick={() => setFocusTarget([a.lat, a.lng])}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═════════ ARTISAN CARD ═════════ */
function ArtisanCard({
  artisan,
  distance,
  isHovered,
  onHover,
  onLeave,
  onClick,
}: {
  artisan: Artisan;
  distance: number | null;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={`group snap-start flex-shrink-0 w-[260px] rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 ${
        isHovered
          ? "bg-white/10 border-brand-500/50 -translate-y-1.5 shadow-[0_20px_50px_rgba(240,122,47,0.25)]"
          : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20"
      }`}
    >
      {/* Cover — vraie photo si dispo, sinon gradient */}
      <div className="relative h-24 bg-gradient-to-br from-ink-700 to-ink-800 overflow-hidden">
        {artisan.cover ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artisan.cover}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ink-900/30 via-transparent to-ink-900/40" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(240,122,47,0.2),transparent)]" />
        )}
        {distance !== null && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-blue-500/90 text-white text-[10px] font-bold backdrop-blur-sm">
            📍 {distance.toFixed(1)} km
          </span>
        )}
      </div>

      <div className="px-4 pb-4 -mt-8 relative">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-2xl border-[3px] border-ink-800 overflow-hidden bg-ink-700 shadow-card mb-3">
          {artisan.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={artisan.avatar} alt="" className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl bg-gradient-to-br from-brand-400 to-brand-600">
              {artisan.name[0]}
            </div>
          )}
        </div>

        <div className="font-bold text-white text-sm leading-tight">{artisan.name}</div>
        <div className="text-[0.78rem] text-white/55 mt-0.5">{artisan.company}</div>

        <div className="flex items-center gap-1.5 mt-2 text-[0.72rem] text-white/65">
          <span className="px-2 py-0.5 rounded-md bg-brand-500/15 border border-brand-500/25 text-brand-400 font-semibold">
            {artisan.metier}
          </span>
          <span>· {artisan.city}</span>
        </div>

        <div className="flex items-center justify-end mt-3 pt-3 border-t border-white/10">
          <Link
            href={`/profil/${artisan.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-brand-400 text-[0.72rem] font-bold hover:text-brand-300 inline-flex items-center gap-0.5"
          >
            Voir le profil <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-ink-900/50 animate-pulse">
      <div className="text-white/30 text-sm flex items-center gap-2">
        <Loader2 size={16} className="animate-spin" /> Chargement de la carte…
      </div>
    </div>
  );
}
