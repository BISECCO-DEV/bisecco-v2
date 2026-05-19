"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icônes par défaut Leaflet en Next.js
const DefaultIcon = L.icon({
  iconUrl:
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export interface ArtisanMarker {
  id: string;
  name: string;
  metier: string;
  city: string;
  lat: number;
  lng: number;
}

function FitBounds({ markers }: { markers: ArtisanMarker[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length === 0) return;
    const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [markers, map]);
  return null;
}

const DEMO_MARKERS: ArtisanMarker[] = [
  { id: "1", name: "Jean Dupont", metier: "Maçon", city: "Meaux",   lat: 48.961, lng: 2.879 },
  { id: "2", name: "Hugo Martin", metier: "Carreleur", city: "Chelles", lat: 48.880, lng: 2.594 },
  { id: "3", name: "Marc Lefevre", metier: "Menuisier", city: "Lille", lat: 50.633, lng: 3.067 },
  { id: "4", name: "Sophie Lambert", metier: "Couvreur", city: "Nantes", lat: 47.218, lng: -1.554 },
];

export function ArtisansMap({ markers = DEMO_MARKERS }: { markers?: ArtisanMarker[] }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-ink-100 shadow-card h-[500px]">
      <MapContainer
        center={[48.961, 2.879]}
        zoom={6}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds markers={markers} />
        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]}>
            <Popup>
              <div className="text-sm">
                <div className="font-bold text-ink-700">{m.name}</div>
                <div className="text-ink-400">
                  {m.metier} · {m.city}
                </div>
                <a
                  href={`/profil/${m.id}`}
                  className="text-brand-500 font-semibold mt-1 inline-block"
                >
                  Voir le profil →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
