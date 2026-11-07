"use client";

import React from "react";
import type { RoomMetrics } from "@/services/rooms";

export interface SalasStatsProps {
  metrics: RoomMetrics | null;
  loading?: boolean;
}

export function SalasStats({ metrics, loading }: SalasStatsProps) {
  if (loading && !metrics) {
    return (
      <div className="flex shrink-0 divide-x divide-border border-b border-border animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-1 flex-col gap-2 px-9 py-5">
            <div className="h-3 w-20 rounded bg-border/40" />
            <div className="h-7 w-14 rounded bg-border/60" />
            <div className="h-3 w-24 rounded bg-border/40" />
          </div>
        ))}
      </div>
    );
  }

  if (!metrics || metrics.total_rooms <= 0) return null;

  return (
    <div className="flex shrink-0 divide-x divide-border border-b border-border">
      <div className="flex flex-1 flex-col gap-0.5 px-9 py-5">
        <span className="text-caption font-bold tracking-caps uppercase text-muted">
          TOTAL DE SALAS
        </span>
        <span className="font-black text-ink font-mono text-title leading-title">
          {String(metrics.total_rooms).padStart(2, "0")}
        </span>
        <span className="text-label text-muted">espaços cadastrados</span>
      </div>
      <div className="flex flex-1 flex-col gap-0.5 px-9 py-5">
        <span className="text-caption font-bold tracking-caps uppercase text-muted">
          RAIO MÉDIO
        </span>
        <span className="font-black text-ink font-mono text-title leading-title">
          {metrics.avg_radius}
          <span className="ml-1 text-body font-semibold text-muted">m</span>
        </span>
        <span className="text-label text-muted">de presença</span>
      </div>
      <div className="flex flex-1 flex-col gap-0.5 px-9 py-5">
        <span className="text-caption font-bold tracking-caps uppercase text-muted">
          PRECISAS
        </span>
        <span className="font-black font-mono text-title leading-title text-success">
          {String(metrics.precisas_count).padStart(2, "0")}
        </span>
        <span className="text-label text-muted">raio ≤ 30 m</span>
      </div>
      <div className="flex flex-1 flex-col gap-0.5 px-9 py-5">
        <span className="text-caption font-bold tracking-caps uppercase text-muted">
          AMPLAS
        </span>
        <span className="font-black font-mono text-title leading-title text-warn">
          {String(metrics.amplas_count).padStart(2, "0")}
        </span>
        <span className="text-label text-muted">raio &gt; 75 m</span>
      </div>
    </div>
  );
}
