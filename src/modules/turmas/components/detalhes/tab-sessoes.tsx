"use client";

import React from "react";
import Link from "next/link";
import { PlusIcon } from "@/components/icons";
import { formatSessionDate, formatSessionTimeRange } from "@/lib/utils";
import type { AttendanceSessionResponse } from "@/services/attendance";

export interface TabSessoesProps {
  turmaId: string;
  defaultRoomName?: string | null;
  sessions: AttendanceSessionResponse[];
  loadingSessions: boolean;
}

export function TabSessoes({
  turmaId,
  defaultRoomName,
  sessions,
  loadingSessions,
}: TabSessoesProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-heading font-bold text-ink">
            Atestados & Histórico de Sessões
          </h3>
          <p className="text-caption text-muted">
            Registros cronológicos de chamadas de presença geovalidadas nesta turma.
          </p>
        </div>

        <Link
          href={`/dashboard/chamadas/nova?turma=${turmaId}`}
          className="flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-label font-bold text-white transition-opacity hover:opacity-90 shadow-xs"
        >
          <PlusIcon size={14} />
          <span>Nova chamada</span>
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-xs">
        <div className="grid grid-cols-12 items-center border-b border-border bg-[#FAFAFA] px-5 py-3 font-sans text-caption font-bold uppercase tracking-caps text-muted">
          <div className="col-span-12 md:col-span-4">DATA / SESSÃO</div>
          <div className="col-span-4 md:col-span-2">CÓDIGO DO DIA</div>
          <div className="hidden md:col-span-2 md:block">DURAÇÃO</div>
          <div className="col-span-4 md:col-span-2">PRESENÇA</div>
          <div className="col-span-4 md:col-span-2 text-right">STATUS & ATA</div>
        </div>

        {loadingSessions ? (
          <div className="py-12 text-center text-body text-muted animate-pulse">
            Carregando histórico de sessões...
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-12 text-center text-body text-muted">
            Nenhuma chamada realizada nesta turma ainda.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sessions.map((ses) => {
              const sessionRate =
                ses.total_students > 0
                  ? Math.round((ses.confirmed_count / ses.total_students) * 100)
                  : 0;

              return (
                <div
                  key={ses.id}
                  className="grid grid-cols-12 items-center px-5 py-4 hover:bg-surface/50 transition-colors"
                >
                  <div className="col-span-12 md:col-span-4 pr-3">
                    <span className="font-semibold text-ink text-body block">
                      {formatSessionDate(ses.opened_at)}
                    </span>
                    <span className="text-caption text-muted">
                      {formatSessionTimeRange(ses.opened_at, ses.expires_at)} · {ses.room?.name ?? defaultRoomName ?? "Sala física"}
                    </span>
                  </div>

                  <div className="col-span-4 md:col-span-2">
                    <span className="rounded bg-surface border border-border px-2 py-0.5 font-mono text-label font-bold text-ink">
                      {ses.day_code}
                    </span>
                  </div>

                  <div className="hidden md:col-span-2 md:block text-body text-ink">
                    {ses.duration_minutes} min
                  </div>

                  <div className="col-span-4 md:col-span-2">
                    <span className="font-mono text-body font-semibold text-ink">
                      {ses.confirmed_count}/{ses.total_students}
                    </span>
                    <span className="text-caption text-muted block">
                      {sessionRate}% de presença
                    </span>
                  </div>

                  <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-3">
                    {ses.status === "OPEN" && (
                      <span className="rounded-full bg-accent-surface border border-accent/30 px-2.5 py-0.5 text-caption font-bold text-ink animate-pulse">
                        Ao Vivo
                      </span>
                    )}
                    {ses.status === "CLOSED" && (
                      <span className="rounded-full bg-surface px-2.5 py-0.5 text-caption font-semibold text-muted">
                        Encerrada
                      </span>
                    )}
                    {ses.status === "EXPIRED" && (
                      <span className="rounded-full bg-warn/10 px-2.5 py-0.5 text-caption font-semibold text-warn">
                        Expirada
                      </span>
                    )}
                    {ses.status === "CANCELLED" && (
                      <span className="rounded-full bg-danger-surface px-2.5 py-0.5 text-caption font-semibold text-danger">
                        Cancelada
                      </span>
                    )}

                    <Link
                      href={`/dashboard/chamadas/${turmaId}/${ses.id}`}
                      className="rounded-lg border border-border bg-white px-2.5 py-1 text-caption font-bold text-ink hover:bg-surface transition-colors"
                    >
                      Ver ata
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
