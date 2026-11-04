"use client";

import React from "react";
import { SearchIcon } from "@/components/icons";
import type { ReportStatusFilter, ReportSortOption } from "../types";

export interface RelatoriosFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: ReportStatusFilter;
  onStatusChange: (filter: ReportStatusFilter) => void;
  sortOption: ReportSortOption;
  onSortChange: (sort: ReportSortOption) => void;
  totalStudents: number;
  filteredCount: number;
  atRiskCount: number;
  regularCount: number;
  gpsWarningCount: number;
}

export function RelatoriosFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortOption,
  onSortChange,
  totalStudents,
  filteredCount,
  atRiskCount,
  regularCount,
  gpsWarningCount,
}: RelatoriosFiltersProps) {
  const filterPills: { id: ReportStatusFilter; label: string; count: number; alert?: boolean }[] = [
    { id: "all", label: "Todos", count: totalStudents },
    { id: "regular", label: "Regulares (≥75%)", count: regularCount },
    { id: "risk", label: "Em Risco (<75%)", count: atRiskCount, alert: atRiskCount > 0 },
    { id: "gps_warning", label: "Alertas GPS", count: gpsWarningCount },
  ];

  return (
    <div className="border-b border-border bg-paper px-8 lg:px-10 py-4 print:hidden">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Lado Esquerdo: Busca Textual e Filtros Segmentados */}
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Campo de Busca */}
          <div className="relative min-w-[260px] flex-1 max-w-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon size={14} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por nome ou e-mail..."
              className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-body text-ink placeholder:text-muted focus:border-control-border focus:outline-none transition-colors"
            />
          </div>

          {/* Segmented Control / Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-white p-1">
            {filterPills.map((pill) => {
              const active = statusFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => onStatusChange(pill.id)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-caption font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-ink text-on-ink shadow-2xs"
                      : "text-muted hover:text-ink hover:bg-surface"
                  }`}
                >
                  <span>{pill.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono leading-tight ${
                      active
                        ? "bg-on-ink/20 text-on-ink"
                        : pill.alert
                        ? "bg-danger-surface text-danger"
                        : "bg-surface text-muted"
                    }`}
                  >
                    {pill.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lado Direito: Ordenação e Contagem */}
        <div className="flex items-center gap-3 justify-between lg:justify-end">
          <span className="text-caption text-muted">
            Mostrando <strong>{filteredCount}</strong> de <strong>{totalStudents}</strong>
          </span>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-caption font-semibold uppercase tracking-caps text-muted">
              Ordenar:
            </label>
            <select
              id="sort-select"
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as ReportSortOption)}
              className="h-9 rounded-lg border border-border bg-white px-2.5 text-label font-semibold text-ink focus:border-control-border focus:outline-none cursor-pointer"
            >
              <option value="risk_first">Atenção primeiro (risco)</option>
              <option value="freq_asc">Menor frequência</option>
              <option value="freq_desc">Maior frequência</option>
              <option value="name_asc">Nome (A - Z)</option>
              <option value="name_desc">Nome (Z - A)</option>
              <option value="gps_desc">Distância GPS (maior)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
