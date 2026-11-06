"use client";

import React from "react";
import type { MembersMetricsResponse } from "@/services/tenants";

export interface ConfiguracoesKpisProps {
  metrics: MembersMetricsResponse | null;
  loading: boolean;
}

export function ConfiguracoesKpis({ metrics, loading }: ConfiguracoesKpisProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border bg-white px-8 lg:px-10">
      {/* KPI 1: Total de Membros */}
      <div className="flex flex-col gap-1 border-r border-b md:border-b-0 border-border py-4 pr-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Total de membros
        </div>
        <div className="font-mono text-[36px] font-semibold tracking-tight text-ink leading-none mt-1">
          {loading ? (
            <span className="inline-block h-8 w-12 animate-pulse rounded bg-surface" />
          ) : (
            metrics?.total_members ?? "--"
          )}
        </div>
        <div className="font-sans text-caption text-muted">
          usuários vinculados ao tenant
        </div>
      </div>

      {/* KPI 2: Corpo Docente */}
      <div className="flex flex-col gap-1 border-b md:border-b-0 md:border-r border-border py-4 px-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Corpo docente
        </div>
        <div className="font-mono text-[36px] font-semibold tracking-tight text-ink leading-none mt-1">
          {loading ? (
            <span className="inline-block h-8 w-12 animate-pulse rounded bg-surface" />
          ) : (
            metrics?.professors_count ?? "--"
          )}
        </div>
        <div className="font-sans text-caption text-muted">
          professores em exercício
        </div>
      </div>

      {/* KPI 3: Coordenação */}
      <div className="flex flex-col gap-1 border-r border-border py-4 pr-5 md:px-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Coordenação
        </div>
        <div className="font-mono text-[36px] font-semibold tracking-tight text-ink leading-none mt-1">
          {loading ? (
            <span className="inline-block h-8 w-12 animate-pulse rounded bg-surface" />
          ) : (
            metrics?.coordinators_count ?? "--"
          )}
        </div>
        <div className="font-sans text-caption text-muted">
          coordenadores pedagógicos
        </div>
      </div>

      {/* KPI 4: Gestão do Tenant */}
      <div className="flex flex-col gap-1 py-4 md:pl-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Administração
        </div>
        <div className="font-mono text-[36px] font-semibold tracking-tight text-ink leading-none mt-1">
          {loading ? (
            <span className="inline-block h-8 w-12 animate-pulse rounded bg-surface" />
          ) : (
            metrics?.admins_count ?? "--"
          )}
        </div>
        <div className="font-sans text-caption text-muted">
          gestores com acesso total
        </div>
      </div>
    </div>
  );
}
