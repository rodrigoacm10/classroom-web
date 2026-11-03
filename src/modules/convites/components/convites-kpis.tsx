"use client";

import React from "react";
import type { InvitesKpiData } from "../types";

export interface ConvitesKpisProps {
  kpis: InvitesKpiData;
}

export function ConvitesKpis({ kpis }: ConvitesKpisProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border bg-white px-8 lg:px-10">
      {/* KPI 1: Total de Convites (30 dias) */}
      <div className="flex flex-col gap-1 border-r border-b md:border-b-0 border-border py-4 pr-5">
        <div className="flex items-center justify-between">
          <span className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
            Total de convites
          </span>
          <span className="text-[11px] font-mono text-muted bg-surface px-1.5 py-0.5 rounded border border-border">
            30 dias
          </span>
        </div>
        <div className="font-mono text-[36px] font-semibold tracking-tight text-ink leading-none mt-1">
          {kpis.total}
        </div>
        <div className="font-sans text-caption text-muted">
          emitidos nos últimos 30 dias
        </div>
      </div>

      {/* KPI 2: Convites Pendentes (30 dias) */}
      <div className="flex flex-col gap-1 border-b md:border-b-0 md:border-r border-border py-4 px-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-amber-700">
          Pendentes
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-mono text-[36px] font-semibold tracking-tight text-amber-600 leading-none">
            {kpis.pending}
          </span>
          <span className="text-caption font-medium text-amber-800/80">
            aguardando
          </span>
        </div>
        <div className="font-sans text-caption text-muted">
          links em aberto (últimos 30d)
        </div>
      </div>

      {/* KPI 3: Convites Aceitos & Taxa de Conversão (30 dias) */}
      <div className="flex flex-col gap-1 border-r border-border py-4 pr-5 md:px-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-emerald-700">
          Aceitos
        </div>
        <div className="flex items-baseline gap-2.5 mt-1">
          <span className="font-mono text-[36px] font-semibold tracking-tight text-emerald-600 leading-none">
            {kpis.accepted}
          </span>
          <span className="font-mono text-label font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
            {kpis.acceptanceRate}% adesão
          </span>
        </div>
        <div className="font-sans text-caption text-muted">
          membros ativos nos últimos 30d
        </div>
      </div>

      {/* KPI 4: Expirados e Revogados (30 dias) */}
      <div className="flex flex-col gap-1 py-4 pl-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Inativos
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-mono text-[36px] font-semibold tracking-tight text-ink leading-none">
            {kpis.expired + kpis.revoked}
          </span>
          <span className="text-caption font-medium text-muted">
            ({kpis.expired} exp. · {kpis.revoked} rev.)
          </span>
        </div>
        <div className="font-sans text-caption text-muted">
          expirados ou cancelados (30d)
        </div>
      </div>
    </div>
  );
}
