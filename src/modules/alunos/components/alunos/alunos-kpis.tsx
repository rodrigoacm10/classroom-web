"use client";

import React from "react";
import { attendanceColor } from "@/lib/utils";
import type { AlunosKpiData, UserRoleScope } from "../../types";

export interface AlunosKpisProps {
  kpis: AlunosKpiData;
  roleScope: UserRoleScope;
}

export function AlunosKpis({ kpis, roleScope }: AlunosKpisProps) {
  const isProfessor = roleScope === "professor";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border bg-white px-8 lg:px-10">
      {/* KPI 1: Total de Alunos */}
      <div className="flex flex-col gap-1 border-r border-b md:border-b-0 border-border py-4 pr-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Total de alunos
        </div>
        <div className="font-mono text-[36px] font-semibold tracking-tight text-ink leading-none mt-1">
          {kpis.totalStudents}
        </div>
        <div className="font-sans text-caption text-muted">
          {isProfessor ? "matriculados nas suas turmas" : "vinculados à instituição"}
        </div>
      </div>

      {/* KPI 2: Média de Turmas por Aluno */}
      <div className="flex flex-col gap-1 border-b md:border-b-0 md:border-r border-border py-4 px-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Média de turmas
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-mono text-[36px] font-semibold tracking-tight text-ink leading-none">
            {kpis.avgClassesPerStudent}
          </span>
          <span className="text-caption font-medium text-muted">
            por aluno
          </span>
        </div>
        <div className="font-sans text-caption text-muted">
          {isProfessor
            ? `${kpis.totalEnrollments} matrículas nas suas disciplinas`
            : `${kpis.totalEnrollments} matrículas totais no tenant`}
        </div>
      </div>

      {/* KPI 3: Frequência Média Global */}
      <div className="flex flex-col gap-1 border-r border-border py-4 pr-5 md:px-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Frequência média
        </div>
        <div
          className={`font-mono text-[36px] font-semibold tracking-tight leading-none mt-1 ${attendanceColor(
            kpis.avgAttendanceRate
          )}`}
        >
          {kpis.avgAttendanceRate}%
        </div>
        <div className="font-sans text-caption text-muted">
          presença consolidada no semestre
        </div>
      </div>

      {/* KPI 4: Alunos em Risco */}
      <div className="flex flex-col gap-1 py-4 pl-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Atenção pedagógica
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span
            className={`font-mono text-[36px] font-semibold tracking-tight leading-none ${
              kpis.atRiskCount > 0 ? "text-danger" : "text-ink"
            }`}
          >
            {kpis.atRiskCount}
          </span>
          <span className="text-caption font-medium text-muted">
            {kpis.atRiskCount === 1 ? "aluno em risco" : "alunos em risco"}
          </span>
        </div>
        <div className="font-sans text-caption text-muted">
          {kpis.atRiskCount > 0
            ? "frequência inferior a 75%"
            : kpis.noClassCount > 0 && !isProfessor
            ? `${kpis.noClassCount} sem turma vinculada`
            : "todos os alunos regulares"}
        </div>
      </div>
    </div>
  );
}
