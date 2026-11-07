"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "@/components/icons";

export interface EditarTurmaHeaderProps {
  turmaId: string;
  turmaName?: string;
  submitting: boolean;
}

export function EditarTurmaHeader({
  turmaId,
  turmaName,
  submitting,
}: EditarTurmaHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border bg-white px-8 py-5 md:flex-row md:items-center md:justify-between lg:px-10">
      <div>
        <nav className="flex items-center gap-2 text-caption text-muted mb-1 font-medium">
          <Link
            href="/dashboard/turmas"
            className="hover:text-ink transition-colors flex items-center gap-1"
          >
            <ChevronLeftIcon size={14} />
            <span>Turmas</span>
          </Link>
          <span>/</span>
          <Link
            href={`/dashboard/turmas/${turmaId}`}
            className="hover:text-ink transition-colors"
          >
            {turmaName ?? "Detalhes"}
          </Link>
          <span>/</span>
          <span className="text-ink font-semibold">Editar</span>
        </nav>

        <h1 className="text-title font-extrabold text-ink leading-title tracking-tight text-[28px]">
          Editar Turma
        </h1>
        <p className="text-caption text-muted mt-0.5">
          Atualize a identificação, espaço físico com geofencing ou alterne o status operacional.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href={`/dashboard/turmas/${turmaId}`}
          className="flex h-10 items-center rounded-lg border border-border bg-white px-4 text-label font-medium text-ink transition-colors hover:bg-surface cursor-pointer"
        >
          Cancelar
        </Link>

        <button
          type="submit"
          form="editar-turma-form"
          disabled={submitting}
          className="flex h-10 items-center gap-2 rounded-lg bg-ink px-5 text-label font-bold text-white shadow-xs transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {submitting ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Salvando alterações…</span>
            </>
          ) : (
            <span>Salvar Alterações</span>
          )}
        </button>
      </div>
    </div>
  );
}
