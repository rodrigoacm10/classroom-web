"use client";

import React from "react";
import Link from "next/link";
import { SearchIcon, AttendanceIcon, PlusIcon } from "@/components/icons";
import type { TurmasStatusFilter } from "../../types";

export interface TableEmptyProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export function TableEmpty({ hasFilters, onClearFilters }: TableEmptyProps) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-muted mb-3">
          <SearchIcon size={22} />
        </div>
        <h3 className="font-sans text-heading font-semibold text-ink">
          Nenhuma turma encontrada
        </h3>
        <p className="mt-1 text-body text-muted max-w-sm">
          Não encontramos nenhuma turma correspondente aos filtros de busca aplicados.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-4 rounded-lg border border-border bg-white px-4 py-2 text-label font-semibold text-ink hover:bg-surface transition-colors cursor-pointer"
        >
          Limpar todos os filtros
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-muted mb-3">
        <AttendanceIcon size={22} />
      </div>
      <h3 className="font-sans text-heading font-semibold text-ink">
        Nenhuma turma cadastrada
      </h3>
      <p className="mt-1 text-body text-muted max-w-sm">
        Sua instituição ainda não possui turmas registradas. Crie a primeira turma para começar o gerenciamento pedagógico.
      </p>
      <Link
        href="/dashboard/turmas/nova"
        className="mt-4 flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-label font-bold text-white shadow-xs transition-opacity hover:opacity-90 active:scale-[0.98]"
      >
        <PlusIcon size={15} />
        <span>Criar primeira turma</span>
      </Link>
    </div>
  );
}
