"use client";

import React from "react";
import { SearchIcon, CloseIcon, ChevronDownIcon } from "@/components/icons";
import type { TurmasStatusFilter, TurmasSortOption } from "../types";

export interface TurmasFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: TurmasStatusFilter;
  onStatusChange: (status: TurmasStatusFilter) => void;
  sortOption: TurmasSortOption;
  onSortChange: (sort: TurmasSortOption) => void;
}

export function TurmasFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortOption,
  onSortChange,
}: TurmasFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-white px-8 py-3.5 lg:px-10">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {/* Search box */}
        <div className="relative min-w-[260px] flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon size={15} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por turma, disciplina, professor ou sala..."
            className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-8 font-sans text-body text-ink placeholder:text-muted focus:border-control-border focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted hover:text-ink cursor-pointer"
              title="Limpar busca"
            >
              <CloseIcon size={12} />
            </button>
          )}
        </div>

        {/* Status selector */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as TurmasStatusFilter)}
            className="h-10 cursor-pointer appearance-none rounded-lg border border-border bg-white pl-3.5 pr-8 font-sans text-label font-medium text-ink focus:border-control-border focus:outline-none"
          >
            <option value="all">Status: Todas</option>
            <option value="active">Apenas Ativas</option>
            <option value="live">Ao Vivo Agora</option>
            <option value="inactive">Inativas</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted">
            <ChevronDownIcon size={12} />
          </div>
        </div>
      </div>

      {/* Sort selector */}
      <div className="relative">
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value as TurmasSortOption)}
          className="h-10 cursor-pointer appearance-none rounded-lg border border-border bg-white pl-3.5 pr-8 font-sans text-label font-medium text-ink focus:border-control-border focus:outline-none"
        >
          <option value="name_asc">Ordenar: Nome (A-Z)</option>
          <option value="rate_desc">Maior Frequência</option>
          <option value="rate_asc">Menor Frequência (Em risco)</option>
          <option value="students_desc">Mais Alunos</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted">
          <ChevronDownIcon size={12} />
        </div>
      </div>
    </div>
  );
}
