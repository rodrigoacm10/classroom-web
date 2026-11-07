import React from "react";

export interface AoVivoCloseModalProps {
  isOpen: boolean;
  closing: boolean;
  cancelling: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AoVivoCloseModal({
  isOpen,
  closing,
  cancelling,
  onConfirm,
  onCancel,
}: AoVivoCloseModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-paper p-6 shadow-xl">
        <h2 className="mb-2 font-bold text-heading text-ink">Encerrar chamada?</h2>
        <p className="mb-6 text-body text-muted">
          Os alunos que ainda não confirmaram presença ficarão marcados como{" "}
          <strong>não confirmados</strong>. Esta ação não pode ser desfeita.
        </p>
        <div className="flex justify-end gap-3">
          <button
            id="btn-cancelar-encerrar"
            type="button"
            onClick={onCancel}
            disabled={closing || cancelling}
            className="rounded-md border border-border px-4 py-2.5 font-semibold text-label text-ink transition-colors hover:bg-surface disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            id="btn-confirmar-encerrar"
            type="button"
            onClick={onConfirm}
            disabled={closing || cancelling}
            className="rounded-md px-4 py-2.5 font-bold text-label text-paper transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ background: "var(--color-danger)" }}
          >
            {closing ? "Encerrando…" : "Encerrar chamada"}
          </button>
        </div>
      </div>
    </div>
  );
}

export interface AoVivoCancelModalProps {
  isOpen: boolean;
  cancelling: boolean;
  closing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AoVivoCancelModal({
  isOpen,
  cancelling,
  closing,
  onConfirm,
  onCancel,
}: AoVivoCancelModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-paper p-6 shadow-xl">
        <h2 className="mb-2 font-bold text-heading text-ink">Cancelar chamada?</h2>
        <p className="mb-6 text-body text-muted">
          A chamada será anulada e nenhuma presença ou falta será registrada no histórico. Esta ação não pode ser desfeita.
        </p>
        <div className="flex justify-end gap-3">
          <button
            id="btn-desistir-cancelar"
            type="button"
            onClick={onCancel}
            disabled={cancelling || closing}
            className="rounded-md border border-border px-4 py-2.5 font-semibold text-label text-ink transition-colors hover:bg-surface disabled:opacity-50"
          >
            Voltar
          </button>
          <button
            id="btn-confirmar-cancelar"
            type="button"
            onClick={onConfirm}
            disabled={cancelling || closing}
            className="rounded-md px-4 py-2.5 font-bold text-label text-paper transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ background: "var(--color-danger)" }}
          >
            {cancelling ? "Cancelando…" : "Sim, cancelar chamada"}
          </button>
        </div>
      </div>
    </div>
  );
}

export interface AoVivoModalsProps {
  showCloseConfirm: boolean;
  showCancelConfirm: boolean;
  closingSession: boolean;
  cancellingSession: boolean;
  onCloseConfirm: () => void;
  onCancelCloseModal: () => void;
  onCancelSessionConfirm: () => void;
  onCancelModal: () => void;
}

export function AoVivoModals({
  showCloseConfirm,
  showCancelConfirm,
  closingSession,
  cancellingSession,
  onCloseConfirm,
  onCancelCloseModal,
  onCancelSessionConfirm,
  onCancelModal,
}: AoVivoModalsProps) {
  return (
    <>
      <AoVivoCloseModal
        isOpen={showCloseConfirm}
        closing={closingSession}
        cancelling={cancellingSession}
        onConfirm={onCloseConfirm}
        onCancel={onCancelCloseModal}
      />
      <AoVivoCancelModal
        isOpen={showCancelConfirm}
        cancelling={cancellingSession}
        closing={closingSession}
        onConfirm={onCancelSessionConfirm}
        onCancel={onCancelModal}
      />
    </>
  );
}
