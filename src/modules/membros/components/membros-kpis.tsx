"use client";

import React from "react";
import type { MembrosKpiData } from "../types";

export interface MembrosKpisProps {
  kpis: MembrosKpiData;
}

export function MembrosKpis({ kpis }: MembrosKpisProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border bg-white px-8 lg:px-10">
      {/* KPI 1: Total de Membros */}
      <div className="flex flex-col gap-1 border-r border-b md:border-b-0 border-border py-4 pr-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Total de membros
        </div>
        <div className="font-mono text-[36px] font-semibold tracking-tight text-ink leading-none mt-1">
          {kpis.totalMembers}
        </div>
        <div className="font-sans text-caption text-muted">
          professores, coordenadores e admins
        </div>
      </div>

      {/* KPI 2: Professores */}
      <div className="flex flex-col gap-1 border-b md:border-b-0 md:border-r border-border py-4 px-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Professores
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-mono text-[36px] font-semibold tracking-tight text-ink leading-none">
            {kpis.professoresCount}
          </span>
          <span className="text-caption font-medium text-muted">
            docentes
          </span>
        </div>
        <div className="font-sans text-caption text-muted">
          corpo docente em exercício
        </div>
      </div>

      {/* KPI 3: Gestão Institucional */}
      <div className="flex flex-col gap-1 border-r border-border py-4 pr-5 md:px-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Gestão & Acesso
        </div>
        <div className="font-mono text-[36px] font-semibold tracking-tight text-ink leading-none mt-1">
          {kpis.gestaoCount}
        </div>
        <div className="font-sans text-caption text-muted">
          coordenadores e administradores
        </div>
      </div>

      {/* KPI 4: Turmas Cobertas */}
      <div className="flex flex-col gap-1 py-4 pl-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Turmas atribuídas
        </div>
        <div className="font-mono text-[36px] font-semibold tracking-tight text-ink leading-none mt-1">
          {kpis.turmasCount}
        </div>
        <div className="font-sans text-caption text-muted">
          disciplinas com docente responsável
        </div>
      </div>
    </div>
  );
}
