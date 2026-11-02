"use client";

import React from "react";
import {
  ChevronDownIcon,
  SearchIcon,
} from "@/components/icons";
import { formatDateTime } from "@/lib/utils";
import type {
  AlunoTurma,
  ChamadaHistoricoItem,
  ChamadaStatusFilter,
} from "../../types";

export interface TabHistoricoProps {
  chamadas: ChamadaHistoricoItem[];
  turmas: AlunoTurma[];
  selectedTurmaFilter: string;
  onTurmaFilterChange: (turmaId: string) => void;
  statusFilter: ChamadaStatusFilter;
  onStatusFilterChange: (status: ChamadaStatusFilter) => void;
}

export function TabHistorico({
  chamadas,
  turmas,
  selectedTurmaFilter,
  onTurmaFilterChange,
  statusFilter,
  onStatusFilterChange,
}: TabHistoricoProps) {
  return (
    <div className="space-y-4">
      {/* Barra de Filtros do Histórico */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white p-4 shadow-2xs">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Seletor de Turma */}
          <div className="relative min-w-[220px]">
            <select
              value={selectedTurmaFilter}
              onChange={(e) => onTurmaFilterChange(e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-border bg-white pl-3.5 pr-8 font-sans text-label font-medium text-ink focus:border-control-border focus:outline-none"
            >
              <option value="all">Todas as turmas cursadas</option>
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.discipline_name} — {t.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted">
              <ChevronDownIcon size={12} />
            </div>
          </div>

          {/* Segmented Control de Presença / Falta */}
          <div className="flex items-center rounded-lg border border-border bg-surface/50 p-1">
            <button
              type="button"
              onClick={() => onStatusFilterChange("all")}
              className={`rounded-md px-3 py-1.5 text-caption font-semibold transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-ink text-white shadow-2xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              Todas ({chamadas.length})
            </button>
            <button
              type="button"
              onClick={() => onStatusFilterChange("presente")}
              className={`rounded-md px-3 py-1.5 text-caption font-semibold transition-all cursor-pointer ${
                statusFilter === "presente"
                  ? "bg-success text-white shadow-2xs"
                  : "text-muted hover:text-success"
              }`}
            >
              Presenças ({chamadas.filter((c) => c.status === "presente").length})
            </button>
            <button
              type="button"
              onClick={() => onStatusFilterChange("falta")}
              className={`rounded-md px-3 py-1.5 text-caption font-semibold transition-all cursor-pointer ${
                statusFilter === "falta"
                  ? "bg-danger text-white shadow-2xs"
                  : "text-muted hover:text-danger"
              }`}
            >
              Faltas ({chamadas.filter((c) => c.status === "falta").length})
            </button>
          </div>
        </div>

        <span className="font-mono text-caption text-muted">
          Total: <strong>{chamadas.length}</strong> chamadas registradas
        </span>
      </div>

      {/* Tabela de Chamadas */}
      {chamadas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-white p-12 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-muted mb-3">
            <SearchIcon size={18} />
          </div>
          <h3 className="text-body font-bold text-ink">
            Nenhuma chamada encontrada
          </h3>
          <p className="text-caption text-muted mt-1 max-w-sm">
            Não há registros de chamadas para os filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header da Tabela */}
              <div className="grid grid-cols-12 items-center border-b border-border bg-[#FAFAFA] px-6 py-3.5 font-sans text-caption font-bold uppercase tracking-caps text-muted">
                <div className="col-span-4">Data & Horário</div>
                <div className="col-span-4">Disciplina / Turma</div>
                <div className="col-span-2">Sala Física</div>
                <div className="col-span-2 text-right">Status</div>
              </div>

              {/* Linhas */}
              <div className="divide-y divide-border">
                {chamadas.map((c) => {
                  return (
                    <div
                      key={c.id}
                      className="grid grid-cols-12 items-center px-6 py-3.5 hover:bg-surface/40 transition-colors"
                    >
                      {/* Data e Hora */}
                      <div className="col-span-4 flex flex-col">
                        <span className="text-body font-semibold text-ink">
                          {formatDateTime(c.date)}
                        </span>
                      </div>

                      {/* Disciplina e Turma */}
                      <div className="col-span-4 flex flex-col min-w-0 pr-3">
                        <span className="font-bold text-ink text-body truncate">
                          {c.discipline_name}
                        </span>
                        <span className="text-caption text-muted truncate">
                          {c.professor_name}
                        </span>
                      </div>

                      {/* Sala */}
                      <div className="col-span-2 text-caption text-muted truncate pr-2">
                        {c.room_name}
                      </div>

                      {/* Status */}
                      <div className="col-span-2 flex justify-end">
                        {c.status === "presente" ? (
                          <span className="inline-flex items-center rounded-full bg-success-surface px-2.5 py-0.5 text-caption font-bold text-success">
                            Presente
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-danger-surface px-2.5 py-0.5 text-caption font-bold text-danger">
                            Falta
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
