import React from "react";
import type { SessionRosterItem } from "@/lib/api";
import { AoVivoStudentRow, AoVivoSkeletonRow } from "./table";

export interface AoVivoTableProps {
  loading: boolean;
  roster: SessionRosterItem[];
}

export function AoVivoTable({ loading, roster }: AoVivoTableProps) {
  return (
    <>
      {/* Table header */}
      <div className="flex shrink-0 items-center gap-4 border-b border-border px-6 py-2.5">
        <div className="h-9 w-9 shrink-0" />
        <span className="flex-1 text-label font-bold tracking-caps uppercase text-muted">ALUNO</span>
        <span className="w-[100px] shrink-0 text-right text-label font-bold tracking-caps uppercase text-muted">
          HORÁRIO
        </span>
        <span className="w-[88px] shrink-0 text-right text-label font-bold tracking-caps uppercase text-muted">
          DISTÂNCIA
        </span>
        <span className="w-[148px] shrink-0 text-right text-label font-bold tracking-caps uppercase text-muted">
          STATUS
        </span>
      </div>

      {/* Student list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <AoVivoSkeletonRow key={i} />)
        ) : roster.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted">
            <span className="text-heading font-semibold">Nenhum aluno neste filtro</span>
            <span className="text-label">Mude o filtro acima para ver os alunos</span>
          </div>
        ) : (
          roster.map((item) => (
            <AoVivoStudentRow key={item.tenant_member_id} item={item} />
          ))
        )}
      </div>
    </>
  );
}
