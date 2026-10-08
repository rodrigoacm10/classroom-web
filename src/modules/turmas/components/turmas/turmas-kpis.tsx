import React from "react";
import type { TurmasKpiData } from "../../types";

export interface TurmasKpisProps {
  kpis: TurmasKpiData;
  loading: boolean;
}

export function TurmasKpis({ kpis, loading }: TurmasKpisProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border bg-white px-8 lg:px-10">
      {/* KPI 1 */}
      <div className="flex flex-col gap-1 border-r border-b md:border-b-0 border-border py-4 pr-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Total de turmas
        </div>
        <div className="font-mono text-[36px] font-semibold tracking-tight text-ink leading-none mt-1">
          {loading ? (
            <span className="inline-block h-8 w-12 animate-pulse rounded bg-surface" />
          ) : (
            kpis.totalClasses
          )}
        </div>
        <div className="font-sans text-caption text-muted">
          {kpis.activeClasses} turmas ativas
        </div>
      </div>

      {/* KPI 2 */}
      <div className="flex flex-col gap-1 border-b md:border-b-0 md:border-r border-border py-4 px-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Frequência média
        </div>
        <div className="font-mono text-[36px] font-semibold tracking-tight text-success leading-none mt-1">
          {loading ? (
            <span className="inline-block h-8 w-16 animate-pulse rounded bg-surface" />
          ) : (
            `${kpis.avgAttendance}%`
          )}
        </div>
        <div className="font-sans text-caption text-muted">
          últimos 30 dias letivos
        </div>
      </div>

      {/* KPI 3 */}
      <div className="flex flex-col gap-1 border-r border-border py-4 pr-5 md:px-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Alunos matriculados
        </div>
        <div className="font-mono text-[36px] font-semibold tracking-tight text-ink leading-none mt-1">
          {loading ? (
            <span className="inline-block h-8 w-14 animate-pulse rounded bg-surface" />
          ) : (
            kpis.totalStudents
          )}
        </div>
        <div className="font-sans text-caption text-muted">
          em todas as turmas
        </div>
      </div>

      {/* KPI 4 */}
      <div className="flex flex-col gap-1 py-4 pl-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Status pedagógico
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          {loading ? (
            <span className="inline-block h-8 w-10 animate-pulse rounded bg-surface" />
          ) : (
            <span
              className={`font-mono text-[36px] font-semibold tracking-tight leading-none ${
                kpis.atRiskCount > 0 ? "text-danger" : "text-ink"
              }`}
            >
              {kpis.atRiskCount}
            </span>
          )}
          <span className="text-caption font-medium text-muted">
            {kpis.atRiskCount === 1 ? "turma < 75%" : "turmas < 75%"}
          </span>
        </div>
        <div className="font-sans text-caption text-muted">
          {kpis.liveCount > 0 ? `${kpis.liveCount} chamada aberta agora` : "nenhuma chamada ao vivo"}
        </div>
      </div>
    </div>
  );
}
