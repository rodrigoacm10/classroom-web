"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@/components/icons";
import { attendanceColor, attendanceBarColor, getInitials } from "@/lib/utils";
import type { AlunoItem, UserRoleScope } from "../../types";

export interface AlunosTableProps {
  alunos: AlunoItem[];
  totalStudents: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSelectStudent?: (student: AlunoItem) => void;
  onClearFilters: () => void;
  roleScope: UserRoleScope;
}

export function AlunosTable({
  alunos,
  totalStudents,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onSelectStudent,
  onClearFilters,
  roleScope,
}: AlunosTableProps) {
  const router = useRouter();
  const isProfessor = roleScope === "professor";

  if (alunos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border-b border-border bg-white px-8 py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-muted mb-4">
          <SearchIcon size={20} />
        </div>
        <h3 className="font-sans text-heading font-bold text-ink">
          Nenhum aluno encontrado
        </h3>
        <p className="mt-1 text-body text-muted max-w-md">
          {isProfessor
            ? "Nenhum aluno corresponde aos filtros selecionados nas suas turmas."
            : "Nenhum aluno cadastrado corresponde à busca ou filtros informados."}
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-5 rounded-lg border border-border bg-white px-4 py-2 text-label font-semibold text-ink transition-colors hover:bg-surface cursor-pointer"
        >
          Limpar filtros
        </button>
      </div>
    );
  }

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalStudents);

  return (
    <div className="flex flex-1 flex-col justify-between bg-white">
      <div className="overflow-x-auto">
        <div className="min-w-[960px]">
          {/* Header da Tabela */}
          <div className="grid grid-cols-12 items-center border-b border-border bg-[#FAFAFA] px-8 py-3.5 font-sans text-caption font-bold uppercase tracking-caps text-muted">
            <div className="col-span-4">Aluno & Matrícula</div>
            <div className="col-span-3">Turmas Vinculadas</div>
            <div className="col-span-2">Frequência Geral</div>
            <div className="col-span-2">Presenças / Faltas</div>
            <div className="col-span-1 text-right">Ficha</div>
          </div>

          {/* Linhas da Tabela */}
          <div className="divide-y divide-border">
            {alunos.map((aluno) => {
              const pct = Math.round(aluno.global_attendance_rate * 100);
              const initials = getInitials(aluno.name);

              // Filtrar turmas para exibição rápida de chips
              const displayTurmas = isProfessor
                ? aluno.turmas.filter((t) => t.is_mine)
                : aluno.turmas;

              return (
                <div
                  key={aluno.id}
                  onClick={() => {
                    if (onSelectStudent) onSelectStudent(aluno);
                    router.push(`/dashboard/alunos/${aluno.id}`);
                  }}
                  className="grid grid-cols-12 items-center px-8 py-4 transition-colors hover:bg-surface/50 cursor-pointer group"
                >
                  {/* Coluna 1: Aluno & Matrícula */}
                  <div className="col-span-4 flex items-center gap-3.5 pr-3">
                    <Link
                      href={`/dashboard/alunos/${aluno.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectStudent) onSelectStudent(aluno);
                      }}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-paper font-mono text-label font-bold shadow-2xs group-hover:scale-105 transition-transform"
                      title={`Ver ficha de ${aluno.name}`}
                    >
                      {initials}
                    </Link>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/alunos/${aluno.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectStudent) onSelectStudent(aluno);
                          }}
                          className="font-semibold text-ink text-body truncate hover:underline hover:text-accent group-hover:text-accent-foreground transition-colors"
                          title={aluno.name}
                        >
                          {aluno.name}
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 text-caption text-muted truncate mt-0.5">
                        <span className="truncate">{aluno.email}</span>
                        <span>•</span>
                        <span className="font-mono text-ink/70 shrink-0">
                          {aluno.matricula}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Coluna 2: Quantidade de Turmas Vinculadas */}
                  <div className="col-span-3 flex flex-col justify-center pr-3">
                    <span className="font-mono text-label font-bold text-ink">
                      {aluno.turmas_count === 1
                        ? "1 turma"
                        : `${aluno.turmas_count} turmas`}
                    </span>
                    {aluno.turmas_count === 0 ? (
                      <span className="text-[11px] font-medium text-muted mt-0.5">
                        Sem matrículas
                      </span>
                    ) : displayTurmas.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-1 max-w-full overflow-hidden">
                        {displayTurmas.slice(0, 2).map((t) => (
                          <span
                            key={t.id}
                            className="inline-block max-w-[120px] truncate rounded bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted"
                            title={t.name}
                          >
                            {t.name}
                          </span>
                        ))}
                        {displayTurmas.length > 2 && (
                          <span className="text-[10px] text-muted self-center">
                            +{displayTurmas.length - 2}
                          </span>
                        )}
                      </div>
                    ) : null}
                  </div>

                  {/* Coluna 3: Frequência Geral */}
                  <div className="col-span-2 pr-6">
                    {aluno.turmas_count > 0 ? (
                      <>
                        <div className="flex items-center justify-between text-label font-mono font-bold mb-1">
                          <span className={attendanceColor(pct)}>{pct}%</span>
                          <span className="text-[11px] font-normal text-muted">
                            {pct >= 75 ? "adequada" : "abaixo de 75%"}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-surface overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${attendanceBarColor(
                              pct
                            )}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <span className="text-caption text-muted">—</span>
                    )}
                  </div>

                  {/* Coluna 4: Presenças / Faltas */}
                  <div className="col-span-2">
                    {aluno.total_sessions > 0 ? (
                      <>
                        <div className="font-mono text-label font-medium text-ink">
                          {aluno.total_present} {aluno.total_present === 1 ? "presença" : "presenças"}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-muted">
                            {aluno.total_absent} {aluno.total_absent === 1 ? "falta" : "faltas"}
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className="text-caption text-muted">—</span>
                    )}
                  </div>

                  {/* Coluna 5: Status & Ação de Ficha */}
                  <div className="col-span-1 flex items-center justify-end gap-2">
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
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Barra de Paginação */}
      <div className="flex flex-wrap items-center justify-between border-t border-border px-8 py-4">
        <span className="font-sans text-caption text-muted">
          Mostrando <strong className="text-ink">{startIdx}</strong> a{" "}
          <strong className="text-ink">{endIdx}</strong> de{" "}
          <strong className="text-ink">{totalStudents}</strong> alunos
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-caption font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeftIcon size={14} />
            <span>Anterior</span>
          </button>

          <span className="px-2 font-mono text-caption text-muted">
            Página {currentPage} de {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-caption font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>Próxima</span>
            <ChevronRightIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
