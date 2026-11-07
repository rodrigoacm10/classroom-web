import React from "react";
import Link from "next/link";
import { PageHeader, PageHeaderAddIcon } from "@/components/global";
import { AttendanceIcon } from "@/components/icons";
import { getFormattedDateSubtitle } from "@/lib/utils";

export function TurmasHeader() {
  return (
    <PageHeader
      eyebrow={getFormattedDateSubtitle()}
      title="Turmas"
      description="Gerencie as turmas ativas, acompanhe a taxa de presença e acesse as sessões ao vivo."
      bordered
      actions={
        <>
          <Link
            href="/dashboard/chamadas/nova"
            className="flex h-11 items-center gap-2 rounded-md border border-border px-4 font-semibold text-ink text-[14px] leading-body transition-colors hover:bg-surface"
          >
            <AttendanceIcon size={16} />
            <span>Abrir chamada</span>
          </Link>

          <Link
            href="/dashboard/turmas/nova"
            className="flex h-11 items-center gap-2 rounded-md bg-ink px-[18px] font-bold text-paper text-[14px] leading-body transition-opacity hover:opacity-80"
          >
            <PageHeaderAddIcon />
            <span>Criar turma</span>
          </Link>
        </>
      }
    />
  );
}
