"use client";

import React, { useState } from "react";
import {
  CloseIcon,
  GpsTargetIcon,
  LocationPinIcon,
  UserIcon,
  PlusIcon,
  CheckIcon,
} from "@/components/icons";
import {
  attendanceColor,
  attendanceBarColor,
  formatDate,
  getInitials,
} from "@/lib/utils";
import type { AlunoItem, UserRoleScope, TurmaOption } from "../types";
import { CURRENT_PROFESSOR_ID } from "../data/mock-alunos";

export interface AlunoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  aluno: AlunoItem | null;
  roleScope: UserRoleScope;
  availableTurmas: TurmaOption[];
  onEnrollInClass: (studentId: string, turmaId: string) => void;
}

export function AlunoDrawer({
  isOpen,
  onClose,
  aluno,
  roleScope,
  availableTurmas,
  onEnrollInClass,
}: AlunoDrawerProps) {
  const [selectedNewTurma, setSelectedNewTurma] = useState<string>("");
  const [enrollSuccess, setEnrollSuccess] = useState<string | null>(null);

  if (!isOpen || !aluno) return null;

  const isProfessor = roleScope === "professor";
  const pct = Math.round(aluno.global_attendance_rate * 100);
  const initials = getInitials(aluno.name);

  // Turmas não matriculadas disponíveis para matricular
  const enrolledIds = new Set(aluno.turmas.map((t) => t.id));
  const unEnrolledTurmas = availableTurmas.filter((t) => !enrolledIds.has(t.id));

  const handleConfirmEnroll = () => {
    if (!selectedNewTurma) return;
    onEnrollInClass(aluno.id, selectedNewTurma);
    setEnrollSuccess("Aluno matriculado com sucesso nesta turma!");
    setSelectedNewTurma("");
    setTimeout(() => setEnrollSuccess(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="relative z-10 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl transition-transform duration-250 ease-out border-l border-border">
        {/* Header do Drawer */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-caption uppercase tracking-caps text-muted font-bold">
              Ficha do Aluno
            </span>
            <span className="text-muted">•</span>
            <span className="font-mono text-caption text-ink font-semibold">
              {aluno.matricula}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-ink transition-colors cursor-pointer"
            title="Fechar detalhes"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Conteúdo rolável */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Card Principal de Perfil */}
          <div className="flex items-start gap-4 rounded-xl border border-border bg-[#FAFAFA] p-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink text-paper font-mono text-heading font-bold shadow-xs">
              {initials}
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-heading font-extrabold text-ink tracking-tight truncate">
                  {aluno.name}
                </h2>
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

              <div className="mt-1 text-caption text-muted flex flex-col gap-0.5">
                <span className="text-body text-ink/80">{aluno.email}</span>
                <span>Ingresso em: {formatDate(aluno.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Grid de 4 Métricas de Frequência */}
          <div>
            <h3 className="font-sans text-caption font-bold uppercase tracking-caps text-muted mb-3">
              Desempenho Geral de Presença
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg border border-border bg-white p-3.5">
                <span className="text-[11px] font-semibold uppercase tracking-caps text-muted block">
                  Frequência
                </span>
                <span
                  className={`font-mono text-title font-bold mt-1 block leading-tight ${attendanceColor(
                    pct
                  )}`}
                >
                  {aluno.turmas_count > 0 ? `${pct}%` : "—"}
                </span>
                <span className="text-[11px] text-muted">presença média</span>
              </div>

              <div className="rounded-lg border border-border bg-white p-3.5">
                <span className="text-[11px] font-semibold uppercase tracking-caps text-muted block">
                  Aulas
                </span>
                <span className="font-mono text-title font-bold text-ink mt-1 block leading-tight">
                  {aluno.total_sessions}
                </span>
                <span className="text-[11px] text-muted">sessões totais</span>
              </div>

              <div className="rounded-lg border border-border bg-white p-3.5">
                <span className="text-[11px] font-semibold uppercase tracking-caps text-muted block">
                  Presenças
                </span>
                <span className="font-mono text-title font-bold text-success mt-1 block leading-tight">
                  {aluno.total_present}
                </span>
                <span className="text-[11px] text-muted">
                  {aluno.total_absent} faltas
                </span>
              </div>

              <div className="rounded-lg border border-border bg-white p-3.5">
                <span className="text-[11px] font-semibold uppercase tracking-caps text-muted block">
                  Distância
                </span>
                <div className="flex items-baseline gap-1 mt-1 leading-tight">
                  <span className="font-mono text-title font-bold text-ink">
                    {aluno.avg_distance_meters > 0
                      ? aluno.avg_distance_meters.toFixed(1)
                      : "—"}
                  </span>
                  {aluno.avg_distance_meters > 0 && (
                    <span className="text-[11px] font-mono text-muted">m</span>
                  )}
                </div>
                <span className="text-[11px] text-muted">média do geofence</span>
              </div>
            </div>
          </div>

          {/* Seção de Turmas Matriculadas */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-sans text-caption font-bold uppercase tracking-caps text-muted">
                Turmas Matriculadas ({aluno.turmas.length})
              </h3>
              <span className="font-mono text-caption text-ink font-semibold">
                {isProfessor ? "Foco docente" : "Total institucional"}
              </span>
            </div>

            {aluno.turmas.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-muted text-body bg-surface/30">
                Este aluno não possui matrículas ativas em nenhuma turma.
              </div>
            ) : (
              <div className="space-y-3">
                {aluno.turmas.map((turma) => {
                  const turmaPct = Math.round(turma.attendance_rate * 100);
                  const isMine = turma.professor_id === CURRENT_PROFESSOR_ID;

                  return (
                    <div
                      key={turma.id}
                      className={`rounded-xl border p-4 transition-all ${
                        isMine
                          ? "border-accent/40 bg-accent-surface/20 shadow-2xs"
                          : "border-border bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-ink text-body truncate">
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

                        {/* Percentual da turma */}
                        <div className="text-right shrink-0">
                          <span
                            className={`font-mono text-label font-bold ${attendanceColor(
                              turmaPct
                            )}`}
                          >
                            {turmaPct}%
                          </span>
                        </div>
                      </div>

                      {/* Barra de progresso da frequência desta turma */}
                      <div className="mt-2.5 h-1.5 w-full rounded-full bg-surface overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${attendanceBarColor(
                            turmaPct
                          )}`}
                          style={{ width: `${turmaPct}%` }}
                        />
                      </div>

                      {/* Metadados da turma: Professor, Sala e Presenças */}
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-y-1.5 pt-2 border-t border-border/60 text-caption text-muted">
                        <div className="flex items-center gap-1.5">
                          <UserIcon size={12} />
                          <span className="truncate max-w-[180px]">
                            {turma.professor_name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <LocationPinIcon size={12} />
                          <span className="truncate max-w-[150px]">
                            {turma.room_name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 font-mono text-ink text-[11px]">
                          <span>
                            {turma.total_present}P / {turma.total_absent}F
                          </span>
                          <span>•</span>
                          <span className="text-muted flex items-center gap-0.5">
                            <GpsTargetIcon size={10} />
                            {turma.avg_distance_meters.toFixed(0)}m
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Ação de Matrícula Rápida pelo Drawer (Para Admin/Gestor ou Professor com turmas livres) */}
          {unEnrolledTurmas.length > 0 && (
            <div className="rounded-xl border border-border bg-[#FAFAFA] p-4">
              <h4 className="font-sans text-caption font-bold uppercase tracking-caps text-muted mb-2">
                Matricular em outra turma
              </h4>

              {enrollSuccess && (
                <div className="mb-3 flex items-center gap-2 rounded-lg bg-success-surface p-2.5 text-caption font-semibold text-success">
                  <CheckIcon size={14} />
                  <span>{enrollSuccess}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <select
                  value={selectedNewTurma}
                  onChange={(e) => setSelectedNewTurma(e.target.value)}
                  className="h-10 flex-1 appearance-none rounded-lg border border-border bg-white px-3 font-sans text-label font-medium text-ink focus:border-control-border focus:outline-none"
                >
                  <option value="">Selecione uma turma para vincular...</option>
                  {unEnrolledTurmas.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.discipline_name} — {t.name} ({t.professor_name})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={!selectedNewTurma}
                  onClick={handleConfirmEnroll}
                  className="flex h-10 items-center gap-1.5 rounded-lg bg-ink px-4 text-label font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <PlusIcon size={14} />
                  <span>Matricular</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé do Drawer */}
        <div className="border-t border-border bg-white px-6 py-4 flex items-center justify-between">
          <span className="text-caption text-muted">
            ID Membro: <code className="font-mono">{aluno.tenant_member_id}</code>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-label font-semibold text-ink hover:bg-surface transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
