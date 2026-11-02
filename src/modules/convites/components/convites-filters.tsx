"use client";

import React from "react";
import { SearchIcon, CloseIcon, ChevronDownIcon } from "@/components/icons";
import type {
  InviteRoleFilter,
  InviteSortOption,
  InviteStatusFilter,
} from "../types";

export interface ConvitesFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: InviteStatusFilter;
  onStatusChange: (status: InviteStatusFilter) => void;
  roleFilter: InviteRoleFilter;
  onRoleChange: (role: InviteRoleFilter) => void;
  sortOption: InviteSortOption;
  onSortChange: (sort: InviteSortOption) => void;
  onClearFilters: () => void;
}

export function ConvitesFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  roleFilter,
  onRoleChange,
  sortOption,
  onSortChange,
  onClearFilters,
}: ConvitesFiltersProps) {
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    roleFilter !== "all" ||
    sortOption !== "newest";

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
            placeholder="Buscar por e-mail..."
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

        {/* Filtro de Status */}
        <div className="relative min-w-[160px]">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as InviteStatusFilter)}
            className="h-10 w-full appearance-none rounded-lg border border-border bg-white px-3 pr-8 font-sans text-body text-ink focus:border-control-border focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">Todos os status</option>
            <option value="pending">🟡 Pendentes</option>
            <option value="accepted">🟢 Aceitos</option>
            <option value="expired">⚪ Expirados</option>
            <option value="revoked">🔴 Revogados</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDownIcon size={14} />
          </div>
        </div>

        {/* Filtro de Papel */}
        <div className="relative min-w-[170px]">
          <select
            value={roleFilter}
            onChange={(e) => onRoleChange(e.target.value as InviteRoleFilter)}
            className="h-10 w-full appearance-none rounded-lg border border-border bg-white px-3 pr-8 font-sans text-body text-ink focus:border-control-border focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">Todos os papéis</option>
            <option value="aluno">Alunos</option>
            <option value="professor">Professores</option>
            <option value="coordenador">Coordenadores</option>
            <option value="admin">Administradores</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDownIcon size={14} />
          </div>
        </div>

        {/* Ordenação */}
        <div className="relative min-w-[160px]">
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as InviteSortOption)}
            className="h-10 w-full appearance-none rounded-lg border border-border bg-white px-3 pr-8 font-sans text-body text-ink focus:border-control-border focus:outline-none transition-colors cursor-pointer"
          >
            <option value="newest">Mais recentes</option>
            <option value="oldest">Mais antigos</option>
            <option value="email_asc">E-mail (A-Z)</option>
            <option value="email_desc">E-mail (Z-A)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDownIcon size={14} />
          </div>
        </div>

        {/* Botão de limpar filtros */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex h-10 items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-caption font-semibold text-muted hover:bg-surface hover:text-ink transition-colors cursor-pointer"
          >
            <CloseIcon size={12} />
            <span>Limpar filtros</span>
          </button>
        )}
      </div>
    </div>
  );
}
