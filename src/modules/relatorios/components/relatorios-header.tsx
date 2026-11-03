"use client";

import React from "react";
import type { TurmaReportOption } from "../types";

export interface RelatoriosHeaderProps {
  availableTurmas: TurmaReportOption[];
  selectedTurmaId: string;
  onSelectTurma: (id: string) => void;
  onExportCsv: () => void;
  isExportingCsv: boolean;
  onPrint: () => void;
  hasData?: boolean;
}

export function RelatoriosHeader({
  availableTurmas,
  selectedTurmaId,
  onSelectTurma,
  onExportCsv,
  isExportingCsv,
  onPrint,
  hasData = true,
}: RelatoriosHeaderProps) {
  const currentTurma = availableTurmas.find((t) => t.id === selectedTurmaId);

  return (
    <header className="border-b border-border bg-paper px-8 lg:px-10 py-6 print:hidden">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Título & Descrição (Sem kicker/eyebrow, respeitando a craft floor) */}
        <div className="flex flex-col gap-1.5">
          <h1 className="font-extrabold tracking-tight text-ink text-[32px] leading-9">
            Relatórios
          </h1>
          <p className="text-body text-muted">
            Auditoria consolidada de presença acadêmica e telemetria geoespacial por turma.
          </p>
        </div>

        {/* Controles de Ação & Seletor de Turma */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Seletor de Turma */}
          {availableTurmas.length > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-1.5 shadow-xs transition-colors hover:border-control-border">
              <span className="text-caption font-semibold uppercase tracking-caps text-muted">
                Turma:
              </span>
              <select
                value={selectedTurmaId}
                onChange={(e) => onSelectTurma(e.target.value)}
                className="bg-transparent text-label font-semibold text-ink focus:outline-none cursor-pointer pr-2"
                aria-label="Selecionar turma para relatório"
              >
                {availableTurmas.map((turma) => (
                  <option key={turma.id} value={turma.id}>
                    {turma.name} ({turma.student_count} alunos)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Botão Exportar CSV */}
          <button
            type="button"
            onClick={onExportCsv}
            disabled={!hasData || isExportingCsv}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-label font-semibold text-ink shadow-xs transition-all hover:bg-surface active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Baixar planilha CSV compatível com Excel e Planilhas"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-muted"
            >
              <path
                d="M8 2.5v8M4.5 7.5L8 11l3.5-3.5M2.5 13.5h11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{isExportingCsv ? "Gerando CSV..." : "Exportar CSV"}</span>
          </button>

          {/* Botão Imprimir / Salvar PDF */}
          <button
            type="button"
            onClick={onPrint}
            disabled={!hasData}
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-label font-semibold text-on-ink shadow-xs transition-all hover:bg-ink/90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Imprimir relatório oficial ou salvar como PDF"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.5 5.5V2.5h7v3M4 11.5H3a1.5 1.5 0 0 1-1.5-1.5v-3A1.5 1.5 0 0 1 3 5.5h10a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-1M4.5 9.5h7v4h-7v-4z"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {currentTurma && (
        <div className="mt-4 flex flex-wrap items-center gap-3 text-caption text-muted">
          <span>Disciplina: <strong className="text-ink font-medium">{currentTurma.discipline_name}</strong></span>
          <span className="text-border">•</span>
          <span>Docente: <strong className="text-ink font-medium">{currentTurma.professor_name}</strong></span>
          {currentTurma.room_name && (
            <>
              <span className="text-border">•</span>
              <span>Espaço: <strong className="text-ink font-medium">{currentTurma.room_name}</strong></span>
            </>
          )}
        </div>
      )}
    </header>
  );
}
