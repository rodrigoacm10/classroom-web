import Link from "next/link";
import type { AttendanceRecord } from "../types";
import { StatusBadge } from "./table";

export interface ChamadaDetailModalProps {
  call: AttendanceRecord | null;
  onClose: () => void;
}

export function ChamadaDetailModal({ call, onClose }: ChamadaDetailModalProps) {
  if (!call) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-border bg-white p-6 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div>
            <span className="rounded bg-accent-surface px-2 py-0.5 font-mono text-[11px] font-bold text-[#8A6D00]">
              {call.timeBadge}
            </span>
            <h3 className="mt-2 font-sans text-heading font-bold text-ink">
              {call.discipline}
            </h3>
            <p className="font-sans text-label text-muted">
              Turma {call.classCode} · {call.room}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-muted hover:bg-surface hover:text-ink"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12M4 4l8 8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-2 gap-4 py-5 text-left">
          <div className="rounded-lg border border-border bg-surface/50 p-3">
            <span className="font-sans text-caption uppercase tracking-caps text-muted">
              Data e Horário
            </span>
            <p className="mt-1 font-sans text-body font-semibold text-ink">
              {call.dateLabel}
            </p>
            <p className="font-sans text-caption text-muted">
              {call.timeRange}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface/50 p-3">
            <span className="font-sans text-caption uppercase tracking-caps text-muted">
              Código do Dia
            </span>
            <p className="mt-1 font-mono text-[20px] font-semibold text-ink">
              {call.dayCode ?? "----"}
            </p>
            <p className="font-sans text-caption text-muted">Validação de raio ativa</p>
          </div>

          <div className="rounded-lg border border-border bg-surface/50 p-3">
            <span className="font-sans text-caption uppercase tracking-caps text-muted">
              Presença / Quórum
            </span>
            <p className="mt-1 font-mono text-[20px] font-semibold text-success">
              {call.present}/{call.total}
            </p>
            <p className="font-sans text-caption text-muted">
              {call.rate}% dos matriculados
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface/50 p-3">
            <span className="font-sans text-caption uppercase tracking-caps text-muted">
              Status da Chamada
            </span>
            <div className="mt-1">
              {call.status === "ENCERRADA" && (
                <StatusBadge variant="success">ENCERRADA</StatusBadge>
              )}
              {call.status === "EXPIRADA" && (
                <StatusBadge variant="muted">EXPIRADA</StatusBadge>
              )}
              {call.status === "CANCELADA" && (
                <StatusBadge variant="danger">CANCELADA</StatusBadge>
              )}
              {(call.status === "ABERTA" || call.status === "EM ANDAMENTO") && (
                <StatusBadge variant="accent" pulse>
                  ABERTA
                </StatusBadge>
              )}
            </div>
            <p className="mt-1 font-sans text-caption text-muted">
              Duração: {call.duration}
            </p>
          </div>
        </div>

        {call.notes && (
          <div className="mb-5 rounded-lg border border-border bg-[#FAFAFA] p-3 text-left">
            <span className="font-sans text-caption uppercase tracking-caps text-muted">
              Observações da Sessão
            </span>
            <p className="mt-1 font-sans text-label text-ink">
              {call.notes}
            </p>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-border px-4 py-2 font-sans text-label font-semibold text-ink hover:bg-surface"
          >
            Fechar
          </button>
          {call.subjectClassId && (
            <Link
              href={`/dashboard/chamadas/${call.subjectClassId}/${call.id}`}
              className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 font-sans text-label font-semibold text-ink hover:bg-surface"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 7h10M8 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Acessar chamada</span>
            </Link>
          )}
          <Link
            href="/dashboard/relatorios"
            className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2 font-sans text-label font-semibold text-white hover:opacity-90"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 2v10M7 5v7M11 8v4"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span>Ver relatório</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
