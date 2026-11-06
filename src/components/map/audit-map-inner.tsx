"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface AuditMapInnerProps {
  studentLat: number;
  studentLng: number;
  studentName?: string;
  accuracyMeters?: number | null;
  roomLat?: number | null;
  roomLng?: number | null;
  roomName?: string;
  toleranceRadius?: number;
  distanceMeters?: number | null;
  isOutsideRadius?: boolean;
  className?: string;
}

export function AuditMapInner({
  studentLat,
  studentLng,
  studentName = "Aluno",
  accuracyMeters = null,
  roomLat = null,
  roomLng = null,
  roomName = "Sala de Aula",
  toleranceRadius = 50,
  distanceMeters = null,
  isOutsideRadius = false,
  className = "",
}: AuditMapInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  const hasStudentCoords =
    typeof studentLat === "number" &&
    !isNaN(studentLat) &&
    typeof studentLng === "number" &&
    !isNaN(studentLng);

  const hasRoomCoords =
    typeof roomLat === "number" &&
    !isNaN(roomLat) &&
    typeof roomLng === "number" &&
    !isNaN(roomLng);

  useEffect(() => {
    if (!containerRef.current || !hasStudentCoords) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const initialCenter: [number, number] = hasRoomCoords
      ? [(studentLat + (roomLat as number)) / 2, (studentLng + (roomLng as number)) / 2]
      : [studentLat, studentLng];

    const map = L.map(containerRef.current, {
      center: initialCenter,
      zoom: 17,
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: false,
    });

    const cartoKey = process.env.NEXT_PUBLIC_CARTO_API_KEY;
    const tileUrl = cartoKey
      ? `https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png?key=${cartoKey}`
      : "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: cartoKey ? "abcd" : "abc",
    }).addTo(map);

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

    // 1. Pino da Sala e Círculo de Tolerância (se houver coordenadas da sala)
    if (hasRoomCoords) {
      const rLat = roomLat as number;
      const rLng = roomLng as number;

      const roomPin = L.divIcon({
        className: "custom-map-pin",
        html: `
          <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            <div style="
              width: 22px;
              height: 22px;
              background: #FFC400;
              border: 3px solid #18191B;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
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

      L.marker([rLat, rLng], { icon: roomPin })
        .addTo(map)
        .bindTooltip(`<b>${roomName}</b><br/>Raio permitido: ${toleranceRadius}m`, {
          direction: "top",
          offset: [0, -18],
        });

      // Geofence Circle da Sala
      L.circle([rLat, rLng], {
        radius: toleranceRadius,
        color: "#D49B00",
        weight: 2,
        dashArray: "5, 6",
        fillColor: "#FFC400",
        fillOpacity: 0.2,
      }).addTo(map);

      // Linha de distância entre sala e aluno
      const line = L.polyline(
        [
          [rLat, rLng],
          [studentLat, studentLng],
        ],
        {
          color: isOutsideRadius ? "#C42B1C" : "#1E7A44",
          weight: 2,
          dashArray: "4, 6",
          opacity: 0.85,
        }
      ).addTo(map);

      if (distanceMeters != null) {
        line.bindTooltip(`${Math.round(distanceMeters)}m de distância`, {
          permanent: true,
          direction: "center",
          className: "audit-distance-badge",
        });
      }
    }

    // 2. Pino do Aluno
    const studentPin = L.divIcon({
      className: "custom-map-pin",
      html: `
        <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
          <div style="
            width: 24px;
            height: 24px;
            background: ${isOutsideRadius ? "#C42B1C" : "#1E7A44"};
            border: 3px solid #18191B;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.45);
          "></div>
          <div style="
            position: absolute;
            width: 7px;
            height: 7px;
            background: #FFFFFF;
            border-radius: 50%;
            top: 10px;
          "></div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 30],
    });

    L.marker([studentLat, studentLng], { icon: studentPin })
      .addTo(map)
      .bindTooltip(
        `<b>${studentName}</b><br/>${isOutsideRadius ? "⚠️ Fora do raio" : "✓ Dentro do raio"}${
          distanceMeters ? ` (${Math.round(distanceMeters)}m)` : ""
        }`,
        {
          direction: "top",
          offset: [0, -18],
          permanent: true,
        }
      );

    // Círculo de precisão do GPS do aluno (se informado)
    if (accuracyMeters && accuracyMeters > 0) {
      L.circle([studentLat, studentLng], {
        radius: accuracyMeters,
        color: isOutsideRadius ? "#C42B1C" : "#1E7A44",
        weight: 1,
        dashArray: "3, 5",
        fillColor: isOutsideRadius ? "#C42B1C" : "#1E7A44",
        fillOpacity: 0.1,
      }).addTo(map);
    }

    // Ajustar enquadramento (fitBounds)
    if (hasRoomCoords) {
      const bounds = L.latLngBounds([
        [studentLat, studentLng],
        [roomLat as number, roomLng as number],
      ]);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 18 });
    }

    mapRef.current = map;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStudentCoords, hasRoomCoords, studentLat, studentLng, roomLat, roomLng, toleranceRadius, distanceMeters, isOutsideRadius]);

  // Observer de redimensionamento
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      mapRef.current?.invalidateSize();
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  if (!hasStudentCoords) {
    return (
      <div className={`relative flex flex-1 w-full h-full min-h-[180px] items-center justify-center bg-surface ${className}`}>
        <span className="text-caption text-muted">Coordenadas da presença indisponíveis.</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full min-h-[200px] isolate z-0 overflow-hidden ${className}`}>
      <div ref={containerRef} className="w-full h-full min-h-[200px] z-0" />
      <style jsx global>{`
        .custom-map-pin {
          background: transparent;
          border: none;
        }
        .audit-distance-badge {
          background-color: var(--color-ink) !important;
          color: #ffffff !important;
          border: 1px solid rgba(255, 255, 255, 0.25) !important;
          border-radius: 9999px !important;
          font-family: var(--font-mono), monospace !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          padding: 2px 8px !important;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25) !important;
        }
        .audit-distance-badge::before {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
