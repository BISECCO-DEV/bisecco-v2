"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Icône Leaflet par défaut (fix Next.js)
const DefaultIcon = L.icon({
  iconUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const CANNES: [number, number] = [43.5528, 7.0174]; // Boulevard de la Croisette

export function ContactMapClient() {
  return (
    <MapContainer
      center={CANNES}
      zoom={14}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "100%" }}
      className="contact-leaflet"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={CANNES}>
        <Popup>
          <div className="font-bold text-ink-900">Bisecco</div>
          <div className="text-sm text-ink-600">
            45 Boulevard de la Croisette
            <br />
            06400 Cannes, France
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
