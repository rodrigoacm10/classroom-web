"use client";

import React from "react";
import { SearchIcon, CloseIcon, ChevronDownIcon } from "@/components/icons";
import type { MembrosRoleFilter, MembrosSortOption } from "../types";

export interface MembrosFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  roleFilter: MembrosRoleFilter;
  onRoleFilterChange: (role: MembrosRoleFilter) => void;
  sortOption: MembrosSortOption;
  onSortOptionChange: (sort: MembrosSortOption) => void;
}

export function MembrosFilters({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  sortOption,
  onSortOptionChange,
}: MembrosFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-white px-8 py-3.5 lg:px-10">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {/* Caixa de busca */}
        <div className="relative min-w-[260px] flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
            <SearchIcon size={14} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nome ou e-mail do membro..."
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

        {/* Filtro por Papel */}
        <div className="relative min-w-[200px]">
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value as MembrosRoleFilter)}
            className="h-10 w-full appearance-none rounded-lg border border-border bg-white pl-3.5 pr-8 font-sans text-body text-ink focus:border-control-border focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">Todos os papéis</option>
            <option value="professor">Professores</option>
            <option value="coordenador">Coordenadores</option>
            <option value="admin">Administradores</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted">
            <ChevronDownIcon size={14} />
          </div>
        </div>
      </div>

      {/* Ordenação */}
      <div className="flex items-center gap-2">
        <span className="font-sans text-caption font-semibold uppercase tracking-caps text-muted">
          Ordenar:
        </span>
        <div className="relative">
          <select
            value={sortOption}
            onChange={(e) => onSortOptionChange(e.target.value as MembrosSortOption)}
            className="h-9 appearance-none rounded-lg border border-border bg-white pl-3 pr-7 font-sans text-body text-ink focus:border-control-border focus:outline-none transition-colors cursor-pointer"
          >
            <option value="name_asc">Nome (A-Z)</option>
            <option value="name_desc">Nome (Z-A)</option>
            <option value="created_at_desc">Mais recentes</option>
            <option value="created_at_asc">Mais antigos</option>
            <option value="role">Papel / Cargo</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-muted">
            <ChevronDownIcon size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}
