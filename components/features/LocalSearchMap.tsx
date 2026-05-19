"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type Artisan = {
  id: string;
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

function FitAllBounds({ markers, userPos }: { markers: Artisan[]; userPos: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    const points: [number, number][] = markers.map((m) => [m.lat, m.lng]);
    if (userPos) points.push(userPos);
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 12);
      return;
    }
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
  }, [markers, userPos, map]);
  return null;
}

type Props = {
  artisans: Artisan[];
  hoveredId: string | null;
  userPos: [number, number] | null;
  focusTarget: [number, number] | null;
  radiusKm?: number;
};

export function LocalSearchMap({
  artisans,
  hoveredId,
  userPos,
  focusTarget,
  radiusKm = 25,
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <MapContainer
      center={[48.96, 2.88]}
      zoom={9}
      scrollWheelZoom
      className="w-full h-full"
      style={{ background: "#0a1e4d" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitAllBounds markers={artisans} userPos={userPos} />
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

      {/* Marqueurs artisans */}
      {artisans.map((a) => {
        const active = hoveredId === a.id;
        const icon = makeMarkerIcon("#f07a2f", active);
        return (
          <Marker key={a.id} position={[a.lat, a.lng]} icon={icon}>
            <Popup>
              <div className="text-sm">
                <div className="font-bold text-ink-700">{a.name}</div>
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
