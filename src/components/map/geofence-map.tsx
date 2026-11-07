"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { GeofenceMapInnerProps } from "./geofence-map-inner";

const GeofenceMapClient = dynamic<GeofenceMapInnerProps>(
  () => import("./geofence-map-inner").then((mod) => mod.GeofenceMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="relative flex flex-1 w-full h-full min-h-[180px] items-center justify-center bg-surface animate-pulse">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <span className="text-caption text-muted">Carregando mapa...</span>
        </div>
      </div>
    ),
  }
);

export type GeofenceMapProps = GeofenceMapInnerProps;

export function GeofenceMap(props: GeofenceMapProps) {
  return <GeofenceMapClient {...props} />;
}
