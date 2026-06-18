"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type Artisan = {
  id: string;
  /** ID numérique du user (pour messagerie). Optionnel : si absent (démo), pas de bouton contacter. */
  user_id?: number;
  name: string;
  company: string;
  metier: string;
  city: string;
  rating: number;
  reviews: number;
  lat: number;
  lng: number;
  avatar?: string;
  cover?: string;
};

/** Crée une icône marqueur custom (cercle coloré avec badge) */
function makeMarkerIcon(color: string, active = false, urgent = false) {
  const size = active ? 56 : 44;
  const ringColor = urgent ? "#ef4444" : "white";
  return L.divIcon({
    className: "bsc-marker",
    html: `
      <div style="
        width: ${size}px; height: ${size}px;
        background: ${color};
        border: 3px solid ${ringColor};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        display: flex; align-items: center; justify-content: center;
        ${active ? "animation: bsc-pulse 1.4s ease-in-out infinite;" : ""}
      ">
        <div style="
          transform: rotate(45deg);
          color: white; font-weight: 800; font-size: ${size === 56 ? "0.85rem" : "0.75rem"};
        ">⚒</div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

const userIcon = L.divIcon({
  className: "bsc-user-marker",
  html: `
    <div style="position: relative;">
      <div style="
        position: absolute; inset: -8px;
        background: rgba(59, 130, 246, 0.3);
        border-radius: 50%;
        animation: bsc-pulse-user 2s ease-out infinite;
      "></div>
      <div style="
        position: relative;
        width: 22px; height: 22px;
        background: #3b82f6;
        border: 4px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 16px rgba(59,130,246,0.6);
      "></div>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

/** Anime le centrage sur un point (fly-to) */
function FlyToPoint({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 13, { duration: 1.2 });
  }, [target, map]);
  return null;
}

// Bounding box approximatif de la France métropolitaine (utilisé en fallback)
const FRANCE_BOUNDS: [[number, number], [number, number]] = [
  [41.3, -5.2],  // SW (Sud-Ouest : Pyrénées atlantiques)
  [51.1, 9.6],   // NE (Nord-Est : frontière allemande)
];
const FRANCE_CENTER: [number, number] = [46.7, 2.4];

// Bornes ÉLARGIES pour permettre le pan (panning) un peu hors-territoire mais
// pas trop · empêche de se retrouver en Sibérie ou au milieu de l'Atlantique.
const FRANCE_MAX_BOUNDS: [[number, number], [number, number]] = [
  [39, -8],   // SW étendu (Espagne, Atlantique proche)
  [54, 12],  // NE étendu (Bénélux, Allemagne, Suisse)
];

function FitAllBounds({ markers, userPos }: { markers: Artisan[]; userPos: [number, number] | null }) {
  const map = useMap();
  // Mémo · fit n'est appelé qu'au premier rendu et quand userPos arrive
  const fittedRef = useRef(false);
  useEffect(() => {
    // Si on a la position user → on centre sur lui avec un bon zoom (style Google Maps)
    if (userPos) {
      if (!fittedRef.current) {
        map.flyTo(userPos, 12, { duration: 1.5 });
        fittedRef.current = true;
      }
      return;
    }
    // Sinon premier load sans userPos
    const points: [number, number][] = markers.map((m) => [m.lat, m.lng]);
    if (points.length === 0) {
      map.fitBounds(FRANCE_BOUNDS, { padding: [20, 20] });
      return;
    }
    if (points.length === 1) {
      map.setView(points[0], 12);
      return;
    }
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
  }, [markers, userPos, map]);
  return null;
}

/** Bouton flottant "Me géolocaliser" (style Google Maps) directement dans la map. */
function GeolocateControl({
  onPosition,
}: {
  onPosition: (coords: [number, number]) => void;
}) {
  const map = useMap();
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locate = () => {
    if (typeof window === "undefined" || !navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        onPosition(coords);
        map.flyTo(coords, 13, { duration: 1.4 });
        setActive(true);
        setLoading(false);
      },
      () => {
        setLoading(false);
        setError("Géolocalisation refusée. Active-la dans les paramètres du navigateur.");
        setTimeout(() => setError(null), 5000);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="leaflet-top leaflet-right" style={{ zIndex: 1000, pointerEvents: "none" }}>
      <div className="leaflet-control" style={{ marginRight: "10px", marginTop: "10px", pointerEvents: "auto" }}>
        <button
          type="button"
          onClick={locate}
          disabled={loading}
          aria-label="Ma position"
          title="Me géolocaliser"
          className={`w-10 h-10 rounded-lg bg-white shadow-[0_4px_12px_rgba(0,0,0,0.25)] grid place-items-center transition hover:bg-ink-50 disabled:opacity-60 ${
            active ? "text-blue-600" : "text-ink-700"
          }`}
        >
          {loading ? (
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" opacity="0.5" />
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" opacity="0.5" />
              <line x1="2" y1="12" x2="6" y2="12" opacity="0.7" />
              <line x1="18" y1="12" x2="22" y2="12" opacity="0.7" />
            </svg>
          ) : (
            // Crosshair / target icon (style Google Maps)
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="2" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="2" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="22" y2="12" />
            </svg>
          )}
        </button>
        {error && (
          <div className="mt-2 max-w-[220px] text-xs text-red-700 bg-white border border-red-200 rounded-lg px-3 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export type ParticulierPin = {
  /** Slug d'URL (client_number ou id) */
  id: string;
  /** Prénom uniquement (le nom de famille n'est jamais affiché sur la carte) */
  prenom: string;
  /** Lat/lng dérivés de la ville · la ville elle-même n'est PAS exposée sur la map */
  lat: number;
  lng: number;
  avatar?: string;
};

type Props = {
  artisans: Artisan[];
  particuliers?: ParticulierPin[];
  hoveredId: string | null;
  userPos: [number, number] | null;
  /** Callback quand l'utilisateur clique le bouton "Me géolocaliser" intégré à la map. */
  onUserPos?: (coords: [number, number]) => void;
  focusTarget: [number, number] | null;
  radiusKm?: number;
};

/**
 * Quand plusieurs pins (artisans + particuliers) tombent sur exactement la
 * même position (typiquement : N personnes inscrites dans la même ville sans
 * lat/lng précise, ou même immeuble), on les éclate en SPIRALE DORÉE
 * (angle d'or 137.5°) pour qu'ils soient TOUS visibles individuellement.
 *
 * Pourquoi spirale dorée :
 *   - 1er pin reste exactement au point d'origine
 *   - les suivants s'enroulent en spirale dense, rayon croît en √index
 *   - 10 pins tiennent dans ~300m (réaliste pour un quartier)
 *   - 50 pins tiennent dans ~620m
 *   - 100 pins tiennent dans ~880m
 *   - jamais de regroupement bizarre quel que soit le nombre
 *
 * Bucket de regroupement : 3 décimales (~111m) → tout ce qui est dans le
 * même pâté de maisons est considéré comme "même position".
 */
function spreadOverlapping(
  artisans: Artisan[],
  particuliers: ParticulierPin[],
): { artisans: Artisan[]; particuliers: ParticulierPin[] } {
  type Tracked = { kind: "a" | "p"; idx: number; lat: number; lng: number };
  const all: Tracked[] = [
    ...artisans.map((a, i) => ({ kind: "a" as const, idx: i, lat: a.lat, lng: a.lng })),
    ...particuliers.map((p, i) => ({ kind: "p" as const, idx: i, lat: p.lat, lng: p.lng })),
  ];

  const groups = new Map<string, Tracked[]>();
  for (const m of all) {
    const key = `${m.lat.toFixed(3)},${m.lng.toFixed(3)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(m);
  }

  const artisanCoords = new Map<number, [number, number]>();
  const particulierCoords = new Map<number, [number, number]>();

  // Pas radial : ~89m par incrément de √index → 10 pins = 281m, 100 pins = 890m
  const STEP = 0.0008;
  // Angle d'or → répartition optimale des pins autour du point central
  const GOLDEN_ANGLE = 137.5 * (Math.PI / 180);

  for (const group of groups.values()) {
    if (group.length === 1) {
      const m = group[0];
      const coords: [number, number] = [m.lat, m.lng];
      if (m.kind === "a") artisanCoords.set(m.idx, coords);
      else particulierCoords.set(m.idx, coords);
      continue;
    }

    const baseLat = group[0].lat;
    const baseLng = group[0].lng;

    group.forEach((m, i) => {
      let coords: [number, number];
      if (i === 0) {
        // Le 1er pin reste exactement au point d'origine (référence)
        coords = [baseLat, baseLng];
      } else {
        const radius = STEP * Math.sqrt(i);
        const angle = i * GOLDEN_ANGLE;
        coords = [
          baseLat + radius * Math.sin(angle),
          baseLng + radius * Math.cos(angle),
        ];
      }
      if (m.kind === "a") artisanCoords.set(m.idx, coords);
      else particulierCoords.set(m.idx, coords);
    });
  }

  return {
    artisans: artisans.map((a, i) => {
      const c = artisanCoords.get(i);
      return c ? { ...a, lat: c[0], lng: c[1] } : a;
    }),
    particuliers: particuliers.map((p, i) => {
      const c = particulierCoords.get(i);
      return c ? { ...p, lat: c[0], lng: c[1] } : p;
    }),
  };
}

export function LocalSearchMap({
  artisans: rawArtisans,
  particuliers: rawParticuliers = [],
  hoveredId,
  userPos,
  onUserPos,
  focusTarget,
  radiusKm = 25,
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Écarte les pins superposés (artisans + particuliers) avant le rendu
  const { artisans, particuliers } = useMemo(
    () => spreadOverlapping(rawArtisans, rawParticuliers),
    [rawArtisans, rawParticuliers],
  );

  if (!mounted) return null;

  return (
    <MapContainer
      center={FRANCE_CENTER}
      zoom={6}
      minZoom={5}
      maxZoom={18}
      maxBounds={FRANCE_MAX_BOUNDS}
      maxBoundsViscosity={1.0}
      worldCopyJump={false}
      scrollWheelZoom
      className="w-full h-full"
      style={{ background: "#0a1e4d" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · France'
        url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
        noWrap={true}
        bounds={FRANCE_MAX_BOUNDS}
      />

      {onUserPos && <GeolocateControl onPosition={onUserPos} />}

      {/* Bounds : artisans + particuliers (mêmes points géolocalisés) */}
      <FitAllBounds
        markers={[
          ...artisans,
          ...particuliers.map((p): Artisan => ({
            id: p.id,
            name: p.prenom,
            company: p.prenom,
            metier: "Particulier",
            city: "",
            rating: 0,
            reviews: 0,
            lat: p.lat,
            lng: p.lng,
            avatar: p.avatar,
          })),
        ]}
        userPos={userPos}
      />
      <FlyToPoint target={focusTarget} />

      {/* Cercle rayon autour du user */}
      {userPos && (
        <Circle
          center={userPos}
          radius={radiusKm * 1000}
          pathOptions={{
            color: "#3b82f6",
            weight: 1.5,
            fillColor: "#3b82f6",
            fillOpacity: 0.05,
            dashArray: "6 8",
          }}
        />
      )}

      {/* Marqueur user */}
      {userPos && (
        <Marker position={userPos} icon={userIcon}>
          <Popup>
            <div className="text-sm font-bold text-ink-700">📍 Vous êtes ici</div>
            <div className="text-xs text-ink-400">Recherche dans un rayon de {radiusKm} km</div>
          </Popup>
        </Marker>
      )}

      {/*
        Ordre de rendu (Leaflet superpose dans l'ordre du JSX) :
        1. Particuliers en BAS (pins bleus) · zIndexOffset négatif
        2. Artisans EN HAUT (pins orange) · zIndexOffset positif
        → quand un particulier et un artisan sont géographiquement proches
          (ex : Mandelieu ↔ Cannes), l'artisan reste visible au-dessus.
      */}

      {/* Marqueurs particuliers (bleu) · popup avec PRÉNOM seul, pas de ville */}
      {particuliers.map((p) => {
        const active = hoveredId === p.id;
        const icon = makeMarkerIcon("#2563eb", active);
        return (
          <Marker
            key={`p-${p.id}`}
            position={[p.lat, p.lng]}
            icon={icon}
            zIndexOffset={0}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-bold text-ink-700">{p.prenom}</div>
                <div className="text-ink-400 text-xs">Particulier</div>
                <a
                  href={`/membre/${p.id}`}
                  className="inline-block mt-2 text-blue-600 font-semibold text-xs hover:underline"
                >
                  Voir le profil →
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Marqueurs artisans (orange) · toujours au-dessus des pins bleus */}
      {artisans.map((a) => {
        const active = hoveredId === a.id;
        const icon = makeMarkerIcon("#f07a2f", active);
        return (
          <Marker
            key={`a-${a.id}`}
            position={[a.lat, a.lng]}
            icon={icon}
            zIndexOffset={1000}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-bold text-ink-700">{a.company || a.name}</div>
                <div className="text-ink-400 text-xs">
                  {a.metier} · {a.city}
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs">
                  <span className="text-brand-500">★</span>
                  <span className="font-bold">{a.rating.toFixed(1)}</span>
                  <span className="text-ink-400">({a.reviews})</span>
                </div>
                <a
                  href={`/profil/${a.id}`}
                  className="inline-block mt-2 text-brand-500 font-semibold text-xs hover:underline"
                >
                  Voir le profil →
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
