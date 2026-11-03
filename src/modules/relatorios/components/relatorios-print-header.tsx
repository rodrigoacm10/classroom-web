import React from "react";
import type { EnrichedClassReportResponse } from "../types";

export interface RelatoriosPrintHeaderProps {
  report: EnrichedClassReportResponse | null;
}

export function RelatoriosPrintHeader({ report }: RelatoriosPrintHeaderProps) {
  if (!report) return null;

  const nowFormatted = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());

  return (
    <div className="hidden print:block mb-8 pb-6 border-b-2 border-ink">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[12px] font-bold tracking-widest uppercase text-muted">
            Locus Classroom • Relatório Oficial de Assiduidade
          </div>
          <h1 className="text-[26px] font-extrabold text-ink tracking-tight mt-1">
            {report.subject_class_name}
          </h1>
          <div className="text-[13px] text-muted mt-0.5">
            Disciplina: <span className="text-ink font-medium">{report.discipline_name}</span> •{" "}
            Docente: <span className="text-ink font-medium">{report.professor_name}</span>
            {report.room_name && ` • Espaço: ${report.room_name}`}
          </div>
        </div>

        <div className="text-right text-[11px] text-muted">
          <div>Emissão: <span className="font-medium text-ink">{nowFormatted}</span></div>
          <div>Auditoria Geoespacial: <span className="font-medium text-ink">Ativa (Locus Geofence)</span></div>
          <div>Engine: <span className="font-mono text-ink">{report.strategy_used} ({report.workers_used} workers)</span></div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-4 bg-surface p-3 rounded text-[12px]">
        <div>
          <span className="text-muted block text-[10px] uppercase font-bold">Matrículas Totais</span>
          <span className="text-[16px] font-bold font-mono text-ink">{report.total_students} alunos</span>
        </div>
        <div>
          <span className="text-muted block text-[10px] uppercase font-bold">Frequência da Turma</span>
          <span className="text-[16px] font-bold font-mono text-ink">
            {Math.round(report.class_average_frequency * 100)}%
          </span>
        </div>
        <div>
          <span className="text-muted block text-[10px] uppercase font-bold">Atenção Pedagógica</span>
          <span className="text-[16px] font-bold font-mono text-ink">
            {report.students_at_risk} aluno(s) &lt;75%
          </span>
        </div>
        <div>
          <span className="text-muted block text-[10px] uppercase font-bold">Precisão Média GPS</span>
          <span className="text-[16px] font-bold font-mono text-ink">
            {report.avg_distance_meters} m
          </span>
        </div>
      </div>
    </div>
  );
}
