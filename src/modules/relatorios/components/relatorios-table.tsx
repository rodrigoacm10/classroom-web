"use client";

import React from "react";
import Link from "next/link";
import { getInitials, attendanceColor, attendanceBarColor } from "@/lib/utils";
import { ExternalLinkIcon } from "@/components/icons";
import type { EnrichedStudentReportItem } from "../types";

export interface RelatoriosTableProps {
  students: EnrichedStudentReportItem[];
  totalSessions: number;
  loading?: boolean;
}

export function RelatoriosTable({
  students,
  totalSessions,
  loading = false,
}: RelatoriosTableProps) {
  if (loading) {
    return (
      <div className="flex flex-1 flex-col bg-white divide-y divide-border">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center justify-between px-8 py-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-surface" />
              <div className="space-y-1.5">
                <div className="h-4 w-40 bg-surface rounded" />
                <div className="h-3 w-28 bg-surface rounded" />
              </div>
            </div>
            <div className="h-4 w-24 bg-surface rounded" />
            <div className="h-4 w-28 bg-surface rounded" />
            <div className="h-4 w-16 bg-surface rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-between bg-white">
      <div className="overflow-x-auto print:overflow-visible">
        <div className="min-w-[980px] print:min-w-full">
          {/* Header da Tabela */}
          <div className="grid grid-cols-12 items-center border-b border-border bg-[#FAFAFA] px-8 py-3.5 font-sans text-caption font-bold uppercase tracking-caps text-muted">
            <div className="col-span-4">Aluno & Contato</div>
            <div className="col-span-2">Presenças / Faltas</div>
            <div className="col-span-2">Taxa de Frequência</div>
            <div className="col-span-2">Auditoria Geoespacial</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-1 text-right print:hidden">Ação</div>
          </div>

          {/* Linhas da Tabela */}
          <div className="divide-y divide-border">
            {students.map((student) => {
              const pct = Math.round(student.frequency_rate * 100);
              const initials = getInitials(student.student_name);

              return (
                <div
                  key={student.id}
                  className="grid grid-cols-12 items-center px-8 py-3.5 transition-colors hover:bg-surface/50 group"
                >
                  {/* Coluna 1: Aluno & E-mail */}
                  <div className="col-span-4 flex items-center gap-3.5 pr-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-on-ink text-caption font-bold font-mono tracking-wider print:border print:border-ink">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-sans text-label font-bold text-ink">
                        {student.student_name}
                      </div>
                      <div className="truncate font-sans text-caption text-muted">
                        {student.email}
                      </div>
                    </div>
                  </div>

                  {/* Coluna 2: Presenças / Faltas */}
                  <div className="col-span-2 flex flex-col gap-0.5">
                    <div className="font-mono tabular-nums text-label font-semibold text-ink">
                      <span>{student.total_present}P</span>
                      <span className="text-muted mx-1">/</span>
                      <span className={student.total_absent > 0 ? "text-danger" : "text-muted"}>
                        {student.total_absent}F
                      </span>
                    </div>
                    <div className="text-caption text-muted">
                      de {student.total_sessions || totalSessions} sessões
                    </div>
                  </div>

                  {/* Coluna 3: Taxa de Frequência */}
                  <div className="col-span-2 flex flex-col gap-1.5 pr-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-mono tabular-nums text-label font-bold ${attendanceColor(
                          pct
                        )}`}
                      >
                        {pct}%
                      </span>
                      <span className="text-caption text-muted">
                        {student.total_present}/{student.total_sessions || totalSessions}
                      </span>
                    </div>
                    {/* Barra de Progresso */}
                    <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${attendanceBarColor(
                          pct
                        )}`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>

                  {/* Coluna 4: Auditoria Geoespacial */}
                  <div className="col-span-2 flex flex-col gap-0.5 pr-3">
                    <div className="flex items-center gap-1.5 font-mono tabular-nums text-label text-ink">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-muted shrink-0"
                      >
                        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      <span>{student.avg_distance_meters.toFixed(1)} m médios</span>
                    </div>
                    <div>
                      {student.confirmations_near_limit > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded bg-warn/10 px-1.5 py-0.5 text-[11px] font-semibold text-warn">
                          <span>⚠️ {student.confirmations_near_limit} no limite</span>
                        </span>
                      ) : (
                        <span className="text-caption text-success font-medium">
                          ✓ Raio seguro
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Coluna 5: Situação Acadêmica */}
                  <div className="col-span-1 text-center">
                    {student.at_risk ? (
                      <span className="inline-block rounded-full bg-danger-surface px-2.5 py-1 text-caption font-bold text-danger border border-danger/20">
                        Em risco
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-success-surface px-2.5 py-1 text-caption font-bold text-success border border-success/20">
                        Regular
                      </span>
                    )}
                  </div>

                  {/* Coluna 6: Ação / Ficha */}
                  <div className="col-span-1 flex justify-end print:hidden">
                    <Link
                      href={`/dashboard/alunos/${student.id}`}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-2.5 py-1.5 text-caption font-semibold text-ink shadow-2xs transition-colors hover:bg-surface hover:text-ink cursor-pointer"
                      title="Ver ficha completa do aluno"
                    >
                      <span>Ficha</span>
                      <ExternalLinkIcon size={12} className="text-muted" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
