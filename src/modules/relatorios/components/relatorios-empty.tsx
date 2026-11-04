"use client";

import React from "react";
import { SearchIcon } from "@/components/icons";

export interface RelatoriosEmptyProps {
  type: "no_results" | "no_turmas" | "no_students" | "error";
  errorMessage?: string;
  onClearFilters?: () => void;
  onRetry?: () => void;
}

export function RelatoriosEmpty({
  type,
  errorMessage,
  onClearFilters,
  onRetry,
}: RelatoriosEmptyProps) {
  if (type === "error") {
    return (
      <div className="flex flex-col items-center justify-center border-b border-border bg-white px-8 py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-surface text-danger mb-4">
          <svg
            width="22"
            height="22"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
            <path d="M10 6v5M10 14v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="font-sans text-heading font-bold text-ink">
          Erro ao carregar dados do relatório
        </h2>
        <p className="mt-1 text-body text-muted max-w-md">
          {errorMessage || "Ocorreu uma falha na comunicação com a API de relatórios."}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 rounded-lg border border-border bg-white px-4 py-2 text-label font-semibold text-ink transition-colors hover:bg-surface cursor-pointer"
          >
            Tentar novamente
          </button>
        )}
      </div>
    );
  }

  if (type === "no_results") {
    return (
      <div className="flex flex-col items-center justify-center border-b border-border bg-white px-8 py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-muted mb-4">
          <SearchIcon size={20} />
        </div>
        <h2 className="font-sans text-heading font-bold text-ink">
          Nenhum aluno encontrado
        </h2>
        <p className="mt-1 text-body text-muted max-w-md">
          Nenhum registro corresponde aos filtros ou ao termo de busca pesquisado nesta turma.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-5 rounded-lg border border-border bg-white px-4 py-2 text-label font-semibold text-ink transition-colors hover:bg-surface cursor-pointer"
          >
            Limpar filtros de busca
          </button>
        )}
      </div>
    );
  }

  if (type === "no_turmas") {
    return (
      <div className="flex flex-col items-center justify-center border-b border-border bg-white px-8 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-muted mb-4">
          <svg
            width="24"
            height="24"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 15V9M10 15V5M16 15v-3"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h2 className="font-sans text-heading font-bold text-ink">
          Nenhuma turma disponível para emissão
        </h2>
        <p className="mt-1 text-body text-muted max-w-md">
          Não há turmas cadastradas na sua instituição para geração de relatórios de frequência.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center border-b border-border bg-white px-8 py-20 text-center">
      <h2 className="font-sans text-heading font-bold text-ink">
        Nenhum dado consolidado
      </h2>
      <p className="mt-1 text-body text-muted max-w-md">
        Esta turma ainda não possui sessões de chamada finalizadas ou alunos matriculados para emitir relatório.
      </p>
    </div>
  );
}
