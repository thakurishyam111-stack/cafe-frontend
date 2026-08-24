"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import { MapPin, Navigation, Coffee, Clock, Phone } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const cafeLocation = [27.7172, 85.324];

const cafeIcon = new L.Icon({
  iconUrl: "/cafe-logo.svg",
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -40],
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -28],
});

export default function CafeMap() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );

  useEffect(() => {
   navigator.geolocation.getCurrentPosition(
  (position) => {
    setUserLocation([
      position.coords.latitude,
      position.coords.longitude,
    ]);
  },
  (error) => {
    console.log(error);
  },
  {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  }
);
  }, []);

  return (
    <section className="relative overflow-hidden rounded-[3rem] bg-slate-950 px-4 m-10 py-16 text-slate-100 shadow-[0_40px_120px_rgba(15,23,42,0.45)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.14),_transparent_28%),linear-gradient(180deg,_rgba(15,23,42,0.96),_rgba(15,23,42,0.86))]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <span className="inline-flex rounded-full bg-amber-400/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
            Find us on the map
          </span>
          <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Visit Deurali Cafe
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Explore our cafe location with a real map experience, custom marker,
            and easy directions to arrive fast.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-800/80 bg-slate-900/95 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-amber-400/15 text-amber-300 shadow-inner shadow-amber-400/10">
                <Coffee size={28} />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
                  Cafe
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  Deurali Cafe
                </h3>
              </div>
            </div>

            <div className="mt-8 space-y-4 text-slate-300">
              <div className="flex gap-3 rounded-3xl bg-slate-950/70 p-4">
                <MapPin className="mt-1 h-6 w-6 text-amber-300" />
                <div>
                  <p className="text-sm font-semibold text-white">Location</p>
                  <p className="text-sm text-slate-400">Kathmandu, Nepal</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-3xl bg-slate-950/70 p-4">
                <Navigation className="mt-1 h-6 w-6 text-amber-300" />
                <div>
                  <p className="text-sm font-semibold text-white">Navigation</p>
                  <p className="text-sm text-slate-400">
                    Tap the marker for cafe details.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-3xl bg-slate-950/70 p-4">
                <Phone className="mt-1 h-6 w-6 text-amber-300" />
                <div>
                  <p className="text-sm font-semibold text-white">Contact</p>
                  <p className="text-sm text-slate-400">+977 9845784548</p>
                </div>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${cafeLocation[0]},${cafeLocation[1]}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Directions
            </a>
          </div>

          <div className="lg:col-span-2 overflow-hidden rounded-[2rem] border border-slate-800/80 shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
            <MapContainer
              center={cafeLocation}
              zoom={15}
              scrollWheelZoom={true}
              style={{
                height: "600px",
                width: "100%",
              }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={cafeLocation} icon={cafeIcon}>
                <Popup>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold">RR Cafe ☕</p>
                    <p>Kathmandu, Nepal</p>
                    <p className="text-slate-500">Open 7:00 AM - 11:00 PM</p>
                  </div>
                </Popup>
                <Tooltip direction="top" offset={[0, -25]} opacity={0.95}>
                  RR Cafe - Tap for details
                </Tooltip>
              </Marker>

              {userLocation && (
                <Marker position={userLocation} icon={userIcon}>
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold">Your Location</p>
                      <p>Use this as a starting point for directions.</p>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
