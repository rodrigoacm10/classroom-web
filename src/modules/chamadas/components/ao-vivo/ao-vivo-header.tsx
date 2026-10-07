import React from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "@/components/icons";
import { PageHeader } from "@/components/global";
import type { AttendanceSessionResponse } from "@/lib/api";

export interface AoVivoHeaderProps {
  session: AttendanceSessionResponse | null;
  disciplineName: string;
  subjectClassName: string;
  metaLine: string;
  isOpen: boolean;
  loading: boolean;
  closingSession: boolean;
  cancellingSession: boolean;
  onOpenCancelConfirm: () => void;
  onOpenCloseConfirm: () => void;
}

export function AoVivoHeader({
  session,
  disciplineName,
  subjectClassName,
  metaLine,
  isOpen,
  loading,
  closingSession,
  cancellingSession,
  onOpenCancelConfirm,
  onOpenCloseConfirm,
}: AoVivoHeaderProps) {
  const statusLabel = isOpen
    ? "AO VIVO"
    : session?.status === "closed"
    ? "ENCERRADA"
    : session?.status === "cancelled"
    ? "CANCELADA"
    : "CHAMADA";

  const eyebrowContent = (
    <div className="flex items-center gap-2">
      {isOpen && (
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: "var(--color-danger)" }}
        />
      )}
      <span
        className="text-label font-bold tracking-caps uppercase"
        style={{ color: isOpen ? "var(--color-danger)" : "var(--color-muted)" }}
      >
        {statusLabel}
      </span>
    </div>
  );

  const titleContent = loading ? (
    <span className="inline-block h-8 w-80 animate-pulse rounded bg-border/60" />
  ) : (
    disciplineName || subjectClassName || "Chamada ao Vivo"
  );

  const subtitleContent = loading ? (
    <span className="inline-block h-3.5 w-56 animate-pulse rounded bg-border/40 mt-1" />
  ) : (
    metaLine
  );

  const actionsContent = (
    <>
      <Link
        href="/dashboard/chamadas"
        className="flex h-11 items-center gap-2 rounded-md border border-border px-4 font-semibold text-ink text-label transition-colors hover:bg-surface"
      >
        <ChevronLeftIcon />
        Voltar
      </Link>

      {isOpen && (
        <>
          <button
            id="btn-cancelar-chamada-trigger"
            type="button"
            onClick={onOpenCancelConfirm}
            disabled={closingSession || cancellingSession}
            className="flex h-11 items-center rounded-md border border-border px-4 font-semibold text-danger text-label transition-colors hover:bg-danger-surface hover:border-danger disabled:opacity-50"
          >
            Cancelar chamada
          </button>

          <button
            id="btn-encerrar-chamada"
            type="button"
            onClick={onOpenCloseConfirm}
            disabled={closingSession || cancellingSession}
            className="flex h-11 items-center rounded-md px-5 font-bold text-paper text-label transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ background: "var(--color-ink)" }}
          >
            {closingSession ? "Encerrando…" : "Encerrar chamada"}
          </button>
        </>
      )}
    </>
  );

  return (
    <PageHeader
      eyebrow={eyebrowContent}
      title={titleContent}
      subtitle={subtitleContent}
      actions={actionsContent}
      bordered
      className="shrink-0 min-h-[110px]"
    />
  );
}
