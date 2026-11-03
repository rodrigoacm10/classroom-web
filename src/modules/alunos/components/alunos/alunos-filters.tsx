"use client";

import React from "react";
import { SearchIcon, CloseIcon, ChevronDownIcon } from "@/components/icons";
import type {
  AlunosSortOption,
  AlunosStatusFilter,
  TurmaOption,
  UserRoleScope,
} from "../../types";

export interface AlunosFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTurmaId: string;
  onTurmaChange: (turmaId: string) => void;
  availableTurmas: TurmaOption[];
  statusFilter: AlunosStatusFilter;
  onStatusChange: (status: AlunosStatusFilter) => void;
  sortOption: AlunosSortOption;
  onSortChange: (sort: AlunosSortOption) => void;
  roleScope: UserRoleScope;
}

export function AlunosFilters({
  searchQuery,
  onSearchChange,
  selectedTurmaId,
  onTurmaChange,
  availableTurmas,
  statusFilter,
  onStatusChange,
  sortOption,
  onSortChange,
  roleScope,
}: AlunosFiltersProps) {
  const isProfessor = roleScope === "professor";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-white px-8 py-3.5 lg:px-10">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {/* Caixa de busca */}
        <div className="relative min-w-[240px] flex-1 max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon size={14} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por aluno ou e-mail..."
            className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-8 font-sans text-body text-ink placeholder:text-muted focus:border-control-border focus:outline-none transition-colors"
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

        {/* Seletor de Turma */}
        <div className="relative min-w-[200px]">
          <select
            value={selectedTurmaId}
            onChange={(e) => onTurmaChange(e.target.value)}
            className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-border bg-white pl-3.5 pr-8 font-sans text-label font-medium text-ink focus:border-control-border focus:outline-none transition-colors"
          >
            <option value="all">
              {isProfessor ? "Todas as minhas turmas" : "Todas as turmas da instituição"}
            </option>
            {availableTurmas.map((turma) => (
              <option key={turma.id} value={turma.id}>
                {turma.discipline_name} — {turma.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted">
            <ChevronDownIcon size={12} />
          </div>
        </div>

        {/* Segmented Control de Status */}
        <div className="hidden sm:flex items-center rounded-lg border border-border bg-surface/50 p-1">
          <button
            type="button"
            onClick={() => onStatusChange("all")}
            className={`rounded-md px-3 py-1.5 text-caption font-semibold transition-all cursor-pointer ${
              statusFilter === "all" ? "bg-ink text-white shadow-2xs" : "text-muted hover:text-ink"
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => onStatusChange("regular")}
            className={`rounded-md px-3 py-1.5 text-caption font-semibold transition-all cursor-pointer ${
              statusFilter === "regular"
                ? "bg-ink text-white shadow-2xs"
                : "text-muted hover:text-ink"
            }`}
          >
            Regulares
          </button>
          <button
            type="button"
            onClick={() => onStatusChange("sem_turma")}
            className={`rounded-md px-3 py-1.5 text-caption font-semibold transition-all cursor-pointer ${
              statusFilter === "sem_turma"
                ? "bg-ink text-white shadow-2xs"
                : "text-muted hover:text-ink"
            }`}
          >
            Sem turma
          </button>
        </div>
      </div>

      {/* Seletor de Ordenação */}
      <div className="relative">
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value as AlunosSortOption)}
          className="h-10 cursor-pointer appearance-none rounded-lg border border-border bg-white pl-3.5 pr-8 font-sans text-label font-medium text-ink focus:border-control-border focus:outline-none transition-colors"
        >
          <option value="name_asc">Ordenar: Nome (A-Z)</option>
          <option value="name_desc">Nome (Z-A)</option>
          <option value="turmas_desc">Mais Turmas</option>
          <option value="turmas_asc">Menos Turmas</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted">
          <ChevronDownIcon size={12} />
        </div>
      </div>
    </div>
  );
}
