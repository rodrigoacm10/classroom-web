"use client";

import React from "react";
import { GpsTargetIcon } from "@/components/icons";
import { attendanceColor, attendanceBarColor } from "@/lib/utils";

export interface DetalhesKpisProps {
  attendancePct: number;
  sessionsCount: number;
  studentsCount: number;
  regularCount: number;
  atRiskCount: number;
  roomName: string;
  toleranceRadius: number;
}

export function DetalhesKpis({
  attendancePct,
  sessionsCount,
  studentsCount,
  regularCount,
  atRiskCount,
  roomName,
  toleranceRadius,
}: DetalhesKpisProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border bg-white px-8 lg:px-10">
      {/* KPI 1 */}
      <div className="flex flex-col gap-1 border-r border-b md:border-b-0 border-border py-4 pr-5">
        <span className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Frequência acumulada
        </span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className={`font-mono text-[36px] font-bold tracking-tight leading-none ${attendanceColor(attendancePct)}`}>
            {attendancePct}%
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-surface overflow-hidden mt-1 max-w-[140px]">
          <div
            className={`h-full rounded-full ${attendanceBarColor(attendancePct)}`}
            style={{ width: `${attendancePct}%` }}
          />
        </div>
        <span className="font-sans text-caption text-muted mt-1">
          média de {sessionsCount} {sessionsCount === 1 ? "chamada" : "chamadas"}
        </span>
      </div>

      {/* KPI 2 */}
      <div className="flex flex-col gap-1 border-b md:border-b-0 md:border-r border-border py-4 px-5">
        <span className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Alunos matriculados
        </span>
        <div className="font-mono text-[36px] font-bold tracking-tight text-ink leading-none mt-1">
          {studentsCount}
        </div>
        <span className="font-sans text-caption text-muted mt-2">
          {regularCount} regulares · {atRiskCount} em atenção
        </span>
      </div>

      {/* KPI 3 */}
      <div className="flex flex-col gap-1 border-r border-border py-4 pr-5 md:px-5">
        <span className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Em risco de reprovação
        </span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className={`font-mono text-[36px] font-bold tracking-tight leading-none ${atRiskCount > 0 ? "text-danger" : "text-ink"}`}>
            {String(atRiskCount).padStart(2, "0")}
          </span>
          <span className="text-caption font-medium text-muted">abaixo de 75%</span>
        </div>
        <span className="font-sans text-caption text-muted mt-2">
          demanda intervenção pedagógica
        </span>
      </div>

      {/* KPI 4 */}
      <div className="flex flex-col gap-1 py-4 pl-5">
        <span className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Espaço & Validação
        </span>
        <div className="text-heading font-bold text-ink leading-tight truncate mt-1">
          {roomName}
        </div>
        <span className="font-sans text-caption text-muted mt-1 flex items-center gap-1">
          <GpsTargetIcon size={12} />
          <span>Raio de {toleranceRadius}m · Geofence ativo</span>
        </span>
      </div>
    </div>
  );
}
