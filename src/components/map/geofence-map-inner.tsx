"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface GeofenceMapInnerProps {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  radius?: number;
  interactive?: boolean;
  scrollWheelZoom?: boolean;
  onLocationChange?: (lat: number, lng: number) => void;
  className?: string;
  zoom?: number;
  placeholderText?: string;
}

export function GeofenceMapInner({
  latitude,
  longitude,
  radius = 50,
  interactive = true,
  scrollWheelZoom = false,
  onLocationChange,
  className = "",
  zoom = 17,
  placeholderText = "Aguardando coordenadas...",
}: GeofenceMapInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  const hasCoords =
    typeof latitude === "number" &&
    !isNaN(latitude) &&
    typeof longitude === "number" &&
    !isNaN(longitude);

  const onLocationChangeRef = useRef(onLocationChange);
  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
  }, [onLocationChange]);

  useEffect(() => {
    if (!containerRef.current || !hasCoords) return;

    // Destruir mapa anterior se existir
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const lat = latitude as number;
    const lng = longitude as number;

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: zoom,
      scrollWheelZoom: scrollWheelZoom,
      dragging: interactive,
      touchZoom: interactive,
      doubleClickZoom: interactive,
      zoomControl: interactive,
      attributionControl: false,
    });

    const cartoKey = process.env.NEXT_PUBLIC_CARTO_API_KEY;

    // Se tiver chave da CARTO configurada, usa Carto Positron autenticado (?key=). Caso contrário, usa OpenStreetMap oficial (100% livre e sem marca d'água)
    const tileUrl = cartoKey
      ? `https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png?key=${cartoKey}`
      : "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: cartoKey ? "abcd" : "abc",
    }).addTo(map);

    // Attribution discreto no canto inferior direito
    L.control
      .attribution({
        prefix: false,
        position: "bottomright",
      })
      .addAttribution(
        cartoKey
          ? '&copy; <a href="https://carto.com/" target="_blank" rel="noopener">CARTO</a>'
          : '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
      )
      .addTo(map);

    // Custom modern pin matching design system
    const customPin = L.divIcon({
      className: "custom-geofence-pin-wrapper",
      html: `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; pointer-events: auto;">
          <div style="
            width: 22px;
            height: 22px;
            background: #FFC400;
            border: 3px solid #18191B;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
            transition: transform 0.15s ease;
          "></div>
          <div style="
            position: absolute;
            width: 6px;
            height: 6px;
            background: #18191B;
            border-radius: 50%;
            top: 10px;
          "></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 29],
    });

    // Marker
    const marker = L.marker([lat, lng], {
      icon: customPin,
      draggable: Boolean(onLocationChangeRef.current),
    }).addTo(map);

    if (onLocationChangeRef.current) {
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onLocationChangeRef.current?.(pos.lat, pos.lng);
      });

      map.on("click", (e) => {
        marker.setLatLng(e.latlng);
        circleRef.current?.setLatLng(e.latlng);
        onLocationChangeRef.current?.(e.latlng.lat, e.latlng.lng);
      });
    }

    // Geofence Circle
    const circle = L.circle([lat, lng], {
      radius: radius,
      color: "#D49B00",
      weight: 2,
      dashArray: "5, 6",
      fillColor: "#FFC400",
      fillOpacity: 0.22,
    }).addTo(map);

    mapRef.current = map;
    markerRef.current = marker;
    circleRef.current = circle;

    // Invalidate size after layout stabilization
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      circleRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCoords]); // Re-instantiate on coordinate readiness transition

  // Atualizar posição e raio reativamente sem recriar o mapa
  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !circleRef.current || !hasCoords) return;

    const lat = latitude as number;
    const lng = longitude as number;

    const currentPos = markerRef.current.getLatLng();
    const posChanged = currentPos.lat !== lat || currentPos.lng !== lng;

    if (posChanged) {
      markerRef.current.setLatLng([lat, lng]);
      circleRef.current.setLatLng([lat, lng]);
      mapRef.current.panTo([lat, lng], { animate: true });
    }

    if (circleRef.current.getRadius() !== radius) {
      circleRef.current.setRadius(radius);
    }
  }, [latitude, longitude, radius, hasCoords]);

  // Observer para resize do container (evita tiles cinzas)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      mapRef.current?.invalidateSize();
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  if (!hasCoords) {
    return (
      <div className={`relative flex flex-1 w-full h-full min-h-[180px] items-center justify-center bg-surface ${className}`}>
        <div className="flex flex-col items-center gap-2 p-4 text-center">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-accent-surface text-accent animate-pulse">
            <svg
              className="h-5 w-5 text-ink"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <span className="text-caption font-medium text-muted">
            {placeholderText}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full min-h-[180px] isolate z-0 overflow-hidden ${className}`}>
      <div ref={containerRef} className="w-full h-full min-h-[180px] z-0" />
      <style jsx global>{`
        .custom-geofence-pin-wrapper {
          background: transparent;
          border: none;
        }
        .leaflet-control-zoom {
          border: 1px solid var(--color-border) !important;
          border-radius: 8px !important;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08) !important;
        }
        .leaflet-control-zoom a {
          background-color: var(--color-paper) !important;
          color: var(--color-ink) !important;
          border-bottom: 1px solid var(--color-border) !important;
          width: 28px !important;
          height: 28px !important;
          line-height: 28px !important;
          font-size: 14px !important;
        }
        .leaflet-control-zoom a:hover {
          background-color: var(--color-surface) !important;
        }
        .leaflet-control-zoom a:last-child {
          border-bottom: none !important;
        }
        .leaflet-control-attribution {
          background: rgba(255, 255, 255, 0.75) !important;
          backdrop-filter: blur(2px);
          font-size: 9px !important;
          color: #777 !important;
          padding: 1px 5px !important;
          border-top-left-radius: 4px;
        }
      `}</style>
    </div>
  );
}
