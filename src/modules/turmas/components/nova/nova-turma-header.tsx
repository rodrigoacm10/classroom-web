import React from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "@/components/icons";

export interface NovaTurmaHeaderProps {
  submitting: boolean;
}

export function NovaTurmaHeader({ submitting }: NovaTurmaHeaderProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border bg-white px-8 py-5 md:flex-row md:items-center md:justify-between lg:px-10">
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
          <span className="text-ink font-semibold">Nova turma</span>
        </nav>
        <h1 className="text-title font-bold text-ink leading-title tracking-tight">
          Criar nova turma
        </h1>
        <p className="text-body text-muted mt-0.5">
          Configure os dados acadêmicos, associe a sala física para geofencing e matricule os alunos.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/turmas"
          className="flex h-11 items-center rounded-md border border-border bg-white px-4 text-label font-medium text-ink transition-colors hover:bg-surface"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          form="nova-turma-form"
          disabled={submitting}
          className="flex h-11 items-center gap-2 rounded-md bg-ink px-5 text-label font-bold text-white shadow-xs transition-opacity hover:opacity-90 active:scale-[0.98] cursor-pointer disabled:opacity-50"
        >
          {submitting ? (
            <>
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Criando turma...</span>
            </>
          ) : (
            <span>Criar turma</span>
          )}
        </button>
      </div>
    </div>
  );
}
