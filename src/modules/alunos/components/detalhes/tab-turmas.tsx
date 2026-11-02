"use client";

import React from "react";
import {
  PlusIcon,
  UserIcon,
  LocationPinIcon,
  TrashIcon,
} from "@/components/icons";
import { attendanceColor, attendanceBarColor } from "@/lib/utils";
import type { AlunoTurma, UserRoleScope } from "../../types";
import { CURRENT_PROFESSOR_ID } from "../../data/mock-alunos";

export interface TabTurmasProps {
  turmas: AlunoTurma[];
  userRole: UserRoleScope;
  canUnenroll: (turma: AlunoTurma) => boolean;
  onOpenEnrollModal: () => void;
  onRequestUnenroll: (turma: AlunoTurma) => void;
}

export function TabTurmas({
  turmas,
  userRole,
  canUnenroll,
  onOpenEnrollModal,
  onRequestUnenroll,
}: TabTurmasProps) {
  const isProfessor = userRole === "professor";

  return (
    <div className="space-y-6">
      {/* Barra de Ações da Aba */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-heading font-extrabold text-ink tracking-tight">
            Turmas Vinculadas ({turmas.length})
          </h2>
          <p className="text-caption text-muted mt-0.5">
            {isProfessor
              ? "Disciplinas deste aluno na instituição. Você pode matriculá-lo em novas turmas disponíveis."
              : "Lista de todas as turmas que o aluno cursa na instituição."}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenEnrollModal}
          className="flex h-10 items-center gap-1.5 rounded-lg bg-ink px-4 text-label font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer shadow-xs"
        >
          <PlusIcon size={14} />
          <span>Matricular em turma</span>
        </button>
      </div>

      {/* Listagem de Turmas */}
      {turmas.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
          <h3 className="text-body font-bold text-ink">
            Nenhuma turma vinculada
          </h3>
          <p className="text-caption text-muted mt-1 max-w-sm mx-auto">
            Este aluno não possui matrículas ativas no momento. Clique no botão acima para matricular.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {turmas.map((turma) => {
            const pct = Math.round(turma.attendance_rate * 100);
            const isMine = turma.professor_id === CURRENT_PROFESSOR_ID;
            const userCanUnenroll = canUnenroll(turma);

            return (
              <div
                key={turma.id}
                className={`flex flex-col justify-between rounded-xl border p-5 transition-all bg-white ${
                  isMine
                    ? "border-accent/60 shadow-xs"
                    : "border-border shadow-2xs"
                }`}
              >
                <div>
                  {/* Topo do Card */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-ink text-body truncate">
                          {turma.discipline_name}
                        </span>
                        {isMine && (
                          <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-ink shrink-0">
                            Minha Turma
                          </span>
                        )}
                      </div>
                      <span className="text-caption text-muted mt-0.5 truncate">
                        {turma.name}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`font-mono text-label font-bold ${attendanceColor(pct)}`}>
                        {pct}%
                      </span>
                    </div>
                  </div>

                  {/* Barra de Progresso de Presença */}
                  <div className="mt-3 h-1.5 w-full rounded-full bg-surface overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${attendanceBarColor(pct)}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Metadados: Professor e Sala */}
                  <div className="mt-4 space-y-1.5 text-caption text-muted">
                    <div className="flex items-center gap-2">
                      <UserIcon size={13} />
                      <span className="truncate">{turma.professor_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LocationPinIcon size={13} />
                      <span className="truncate">{turma.room_name}</span>
                    </div>
                  </div>
                </div>

                {/* Rodapé do Card com Presenças e Botão Desmatricular */}
                <div className="mt-5 pt-3.5 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-[12px] text-ink">
                    <span>
                      <strong>{turma.total_present}</strong>P / <strong>{turma.total_absent}</strong>F
                    </span>
                  </div>

                  {userCanUnenroll ? (
                    <button
                      type="button"
                      onClick={() => onRequestUnenroll(turma)}
                      className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-caption font-semibold text-danger hover:bg-danger-surface transition-colors cursor-pointer"
                      title="Cancelar matrícula nesta turma"
                    >
                      <TrashIcon size={13} />
                      <span>Desmatricular</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-muted italic">
                      Somente leitura
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
