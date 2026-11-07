"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "@/components/icons";
import { formatDate, getInitials } from "@/lib/utils";
import type { AlunoItem } from "../../types";

export interface AlunoDetalhesHeaderProps {
  aluno: AlunoItem;
}

export function AlunoDetalhesHeader({ aluno }: AlunoDetalhesHeaderProps) {
  const initials = getInitials(aluno.name);

  return (
    <div className="border-b border-border bg-white px-8 py-6 lg:px-10">
      {/* Voltar para Alunos */}
      <Link
        href="/dashboard/alunos"
        className="inline-flex items-center gap-1.5 text-caption font-semibold text-muted hover:text-ink transition-colors mb-4 group"
      >
        <ChevronLeftIcon size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        <span>Voltar para Alunos</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ink text-paper font-mono text-title font-bold shadow-xs">
            {initials}
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-title font-extrabold text-ink tracking-tight truncate">
                {aluno.name}
              </h1>

              {aluno.status === "at_risk" ? (
                <span className="inline-flex rounded-full bg-danger-surface px-2.5 py-0.5 text-caption font-bold text-danger">
                  Em risco
                </span>
              ) : aluno.status === "regular" ? (
                <span className="inline-flex rounded-full bg-success-surface px-2.5 py-0.5 text-caption font-semibold text-success">
                  Regular
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-surface px-2.5 py-0.5 text-caption font-medium text-muted">
                  Sem turma
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-body text-muted">
              <span className="text-ink font-medium">{aluno.email}</span>
              <span>•</span>
              <span className="font-mono text-label text-ink">
                Matrícula: <strong>{aluno.matricula}</strong>
              </span>
              <span>•</span>
              <span className="text-caption">
                Ingresso: {formatDate(aluno.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
