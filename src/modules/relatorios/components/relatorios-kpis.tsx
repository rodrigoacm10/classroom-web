"use client";

import React from "react";
import { attendanceColor } from "@/lib/utils";
import type { EnrichedClassReportResponse } from "../types";

export interface RelatoriosKpisProps {
  report: EnrichedClassReportResponse | null;
  loading?: boolean;
}

export function RelatoriosKpis({ report, loading = false }: RelatoriosKpisProps) {
  if (loading || !report) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border bg-white px-8 lg:px-10 py-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col gap-2 py-2 pr-5 animate-pulse">
            <div className="h-3 w-24 bg-surface rounded" />
            <div className="h-9 w-20 bg-surface rounded mt-1" />
            <div className="h-3 w-32 bg-surface rounded" />
          </div>
        ))}
      </div>
    );
  }

  const avgPct = Math.round(report.class_average_frequency * 100);
  const totalCalls = report.total_presences + report.total_absences;
  const presenceRatio = totalCalls > 0 ? Math.round((report.total_presences / totalCalls) * 100) : 0;

  return (
    <section
      aria-label="Indicadores consolidados da turma"
      className="border-b border-border bg-white px-8 lg:px-10"
    >
      <div className="grid grid-cols-2 md:grid-cols-4">
        {/* KPI 1: Frequência Média Consolidada */}
        <div className="flex flex-col gap-1 border-r border-b md:border-b-0 border-border py-4 pr-5">
          <span className="text-label font-semibold uppercase tracking-caps text-muted">
            Frequência média
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className={`font-mono tabular-nums text-[36px] font-semibold tracking-tight leading-none ${attendanceColor(
                avgPct
              )}`}
            >
              {avgPct}%
            </span>
            <span className="text-caption font-medium text-muted">
              (meta: ≥75%)
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-1.5 w-28 bg-surface rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  avgPct >= 85
                    ? "bg-success"
                    : avgPct >= 75
                    ? "bg-warn"
                    : "bg-danger"
                }`}
                style={{ width: `${Math.min(100, avgPct)}%` }}
              />
            </div>
            <span className="text-caption text-muted">
              {report.total_students} matrículas
            </span>
          </div>
        </div>

        {/* KPI 2: Alunos em Atenção Pedagógica (Risco) */}
        <div className="flex flex-col gap-1 border-b md:border-b-0 md:border-r border-border py-4 px-5">
          <span className="text-label font-semibold uppercase tracking-caps text-muted">
            Atenção pedagógica
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className={`font-mono tabular-nums text-[36px] font-semibold tracking-tight leading-none ${
                report.students_at_risk > 0 ? "text-danger" : "text-ink"
              }`}
            >
              {report.students_at_risk}
            </span>
            <span className="text-caption font-medium text-muted">
              aluno(s) em risco
            </span>
          </div>
          <div className="text-caption text-muted">
            {report.students_at_risk > 0 ? (
              <span className="text-danger font-medium">
                Abaixo de 75% de presença exigida
              </span>
            ) : (
              <span className="text-success font-medium">
                Nenhum aluno em risco crítico
              </span>
            )}
          </div>
        </div>

        {/* KPI 3: Presenças vs. Faltas Acumuladas */}
        <div className="flex flex-col gap-1 border-r border-border py-4 pr-5 md:px-5">
          <span className="text-label font-semibold uppercase tracking-caps text-muted">
            Volume de presenças
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono tabular-nums text-[36px] font-semibold tracking-tight text-ink leading-none">
              {report.total_presences}
            </span>
            <span className="text-caption font-medium text-muted">
              de {totalCalls} registros
            </span>
          </div>
          <div className="text-caption text-muted">
            {presenceRatio}% de assiduidade em {report.total_sessions} sessões
          </div>
        </div>

        {/* KPI 4: Auditoria Geoespacial Locus */}
        <div className="flex flex-col gap-1 py-4 pl-5">
          <span className="text-label font-semibold uppercase tracking-caps text-muted">
            Precisão geoespacial
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono tabular-nums text-[36px] font-semibold tracking-tight text-ink leading-none">
              {report.avg_distance_meters}
            </span>
            <span className="text-caption font-medium text-muted">
              metros de desvio médio
            </span>
          </div>
          <div className="text-caption text-muted flex items-center gap-1.5">
            {report.students_with_gps_warning > 0 ? (
              <span className="inline-flex items-center gap-1 text-warn font-medium">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 5v4M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {report.students_with_gps_warning} com confirmações no limiar
              </span>
            ) : (
              <span className="text-success font-medium">
                100% de validações seguras no raio
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Meta-auditoria Locus: Processamento em paralelo */}
      <div className="hidden md:flex items-center justify-between py-2 border-t border-border/60 text-[11px] text-muted font-sans">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-success" />
          <span>Auditoria Locus Geofence recalculada em paralelo</span>
          <span className="text-border">•</span>
          <span>Engine: <strong className="font-mono text-ink">{report.strategy_used}</strong></span>
          <span className="text-border">•</span>
          <span>Workers: <strong className="font-mono text-ink">{report.workers_used}</strong></span>
        </div>
        <div className="font-mono">
          Tempo de consolidação: <strong>{report.duration_ms} ms</strong>
        </div>
      </div>
    </section>
  );
}
