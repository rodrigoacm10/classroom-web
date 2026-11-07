"use client";

import React from "react";
import { attendanceColor } from "@/lib/utils";
import type { AlunoItem } from "../../types";

export interface AlunoDetalhesKpisProps {
  aluno: AlunoItem;
}

export function AlunoDetalhesKpis({ aluno }: AlunoDetalhesKpisProps) {
  const pct = Math.round(aluno.global_attendance_rate * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-border bg-white px-8 lg:px-10">
      {/* KPI 1: Frequência Geral */}
      <div className="flex flex-col gap-1 border-b sm:border-b-0 sm:border-r border-border py-4 pr-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Frequência geral
        </div>
        <div
          className={`font-mono text-[36px] font-semibold tracking-tight leading-none mt-1 ${
            aluno.turmas_count > 0 ? attendanceColor(pct) : "text-muted"
          }`}
        >
          {aluno.turmas_count > 0 ? `${pct}%` : "—"}
        </div>
        <div className="font-sans text-caption text-muted">
          {pct >= 75 ? "presença regular" : "abaixo da meta (75%)"}
        </div>
      </div>

      {/* KPI 2: Sessões / Aulas Registradas */}
      <div className="flex flex-col gap-1 border-b sm:border-b-0 sm:border-r border-border py-4 px-0 sm:px-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Aulas registradas
        </div>
        <div className="font-mono text-[36px] font-semibold tracking-tight text-ink leading-none mt-1">
          {aluno.total_sessions}
        </div>
        <div className="font-sans text-caption text-muted">
          chamadas computadas
        </div>
      </div>

      {/* KPI 3: Presenças / Faltas */}
      <div className="flex flex-col gap-1 py-4 pl-0 sm:pl-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Presenças / Faltas
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-mono text-[36px] font-semibold tracking-tight text-success leading-none">
            {aluno.total_present}
          </span>
          <span className="font-sans text-caption text-muted">
            {aluno.total_present === 1 ? "presença" : "presenças"}
          </span>
          <span className="text-muted/40 font-mono text-caption">/</span>
          <span className="font-mono text-[24px] font-semibold tracking-tight text-danger leading-none">
            {aluno.total_absent}
          </span>
          <span className="font-sans text-caption text-muted">
            {aluno.total_absent === 1 ? "falta" : "faltas"}
          </span>
        </div>
        <div className="font-sans text-caption text-muted">
          em {aluno.total_sessions}{" "}
          {aluno.total_sessions === 1
            ? "chamada computada"
            : "chamadas computadas"}
        </div>
      </div>
    </div>
  );
}
