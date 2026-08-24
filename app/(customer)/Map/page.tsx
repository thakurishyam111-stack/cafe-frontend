"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip } from "react-leaflet";
import { Coffee, MapPin, Navigation, Phone, Locate } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const cafeLocation: [number, number] = [27.7238, 85.3675];

const createPinIcon = (color: string, label: string) =>
  L.divIcon({
    html: `<div style="background:${color}; color:white; width:34px; height:34px; border-radius:9999px; display:flex; align-items:center; justify-content:center; font-size:16px; box-shadow:0 8px 18px rgba(0,0,0,0.25); border:2px solid white; font-weight:700;">${label}</div>`,
    className: "",
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });

const cafeIcon = createPinIcon("#f59e0b", "☕");
const userIcon = createPinIcon("#2563eb", "●");

export default function CafeMap() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState("");
  const [isLocating, setIsLocating] = useState(true);

  const requestLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setIsLocating(false);
      setLocationError("Location access is unavailable on this device.");
      return;
    }

    setIsLocating(true);
    setLocationError("");

    const onSuccess = (position: GeolocationPosition) => {
      const nextLocation: [number, number] = [position.coords.latitude, position.coords.longitude];
      setUserLocation(nextLocation);
      setLocationError("");
      setIsLocating(false);
    };

    const onError = () => {
      navigator.geolocation.getCurrentPosition(
        onSuccess,
        () => {
          setLocationError("Location permission is blocked or unavailable. You can still view the cafe location.");
          setIsLocating(false);
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
      );
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 0,
    });
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const mapCenter = useMemo(() => userLocation ?? cafeLocation, [userLocation]);

  const distanceKm = useMemo(() => {
    if (!userLocation) return null;

    const toRad = (value: number) => (value * Math.PI) / 180;
    const [lat1, lon1] = userLocation;
    const [lat2, lon2] = cafeLocation;
    const radius = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (radius * c).toFixed(1);
  }, [userLocation]);

  return (
    <section className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-slate-950 px-4 py-10 sm:px-6 lg:px-8 lg:py-14 text-slate-100 shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_35%)] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 text-center md:mb-10">
          <span className="inline-flex rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.3em] text-amber-300">
            Find us on the map
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Deurali Cafe • Tokha, Kathmandu
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            This map shows the cafe location, your current position when available, and a simple route view like Google Maps.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.55fr]">
          <div className="flex flex-col justify-between rounded-[1.7rem] border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur">
            <div>
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-400/15 text-amber-400">
                  <Coffee size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Cafe address</p>
                  <h3 className="mt-1 text-xl font-bold text-white">Deurali Cafe</h3>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Location</p>
                    <p className="mt-1 text-sm text-slate-300">Tokha, Kathmandu, Nepal</p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <Navigation className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Directions</p>
                    <p className="mt-1 text-sm text-slate-300">
                      {userLocation ? `${distanceKm} km from your current location` : "Enable location for live distance"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Contact</p>
                    <p className="mt-1 text-sm text-slate-300">+977 9845784548</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
              {isLocating ? "Finding your location..." : locationError || "Your location is shown when available."}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={requestLocation}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 font-semibold text-sky-300 transition hover:bg-sky-500/20"
              >
                <Locate size={18} />
                Find my location
              </button>

              <a
                href={`https://www.google.com/maps?q=${cafeLocation[0]},${cafeLocation[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-amber-500 px-4 font-semibold text-slate-950 transition hover:bg-amber-400"
              >
                Open in Google Maps
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.7rem] border border-slate-800 shadow-2xl">
            <div className="h-[420px] w-full sm:h-[500px] lg:h-[560px]">
              <MapContainer
                center={mapCenter}
                zoom={14}
                scrollWheelZoom
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={cafeLocation} icon={cafeIcon}>
                  <Popup>
                    <div className="space-y-1 p-1 text-slate-900">
                      <p className="font-bold">Deurali Cafe ☕</p>
                      <p className="text-sm text-slate-600">Tokha, Kathmandu</p>
                      <p className="text-sm font-medium text-amber-600">Open 7:00 AM - 11:00 PM</p>
                    </div>
                  </Popup>
                  <Tooltip direction="top" offset={[0, -12]} opacity={0.95}>
                    Deurali Cafe
                  </Tooltip>
                </Marker>

                {userLocation && (
                  <>
                    <Marker position={userLocation} icon={userIcon}>
                      <Popup>
                        <div className="p-1 text-slate-900">
                          <p className="font-bold">Your current location</p>
                          <p className="text-sm text-slate-600">Starting point for directions</p>
                        </div>
                      </Popup>
                    </Marker>
                    <Polyline positions={[userLocation, cafeLocation]} color="#f59e0b" weight={4} opacity={0.9} />
                  </>
                )}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}