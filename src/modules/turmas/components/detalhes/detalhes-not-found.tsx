"use client";

import React from "react";
import Link from "next/link";

export interface DetalhesNotFoundProps {
  errorMessage: string | null;
}

export function DetalhesNotFound({ errorMessage }: DetalhesNotFoundProps) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-paper p-8 text-center">
      <div className="rounded-2xl border border-border bg-white p-8 max-w-md shadow-xs space-y-4">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-danger-surface text-danger text-title font-bold">
          !
        </span>
        <h2 className="text-heading font-bold text-ink">Turma Não Encontrada</h2>
        <p className="text-body text-muted">
          {errorMessage ?? "Não foi possível carregar os detalhes da turma solicitada."}
        </p>
        <Link
          href="/dashboard/turmas"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-ink px-5 text-label font-bold text-white hover:opacity-90 transition-opacity"
        >
          ← Voltar para Turmas
        </Link>
      </div>
    </div>
  );
}
