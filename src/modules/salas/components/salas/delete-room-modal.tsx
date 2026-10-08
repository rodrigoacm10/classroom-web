"use client";

import React, { useState } from "react";
import { TrashIcon } from "@/components/icons";
import { deleteRoom, type Room } from "@/services/rooms";

export interface DeleteRoomModalProps {
  room: Room;
  onClose: () => void;
  onDeleted: (roomId: string) => void;
}

export function DeleteRoomModal({
  room,
  onClose,
  onDeleted,
}: DeleteRoomModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    try {
      setSubmitting(true);
      setError(null);
      await deleteRoom(room.id);
      onDeleted(room.id);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao excluir a sala. Verifique se você possui papel de Administrador (ADMIN)."
      );
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-paper shadow-2xl">
        <div className="p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-surface text-danger mb-4">
            <TrashIcon size={22} />
          </div>

          <h2 className="text-title font-bold text-ink tracking-tight mb-2">
            Excluir sala física?
          </h2>
          <p className="text-body text-muted leading-relaxed mb-4">
            Tem certeza que deseja remover permanentemente o espaço{" "}
            <strong className="text-ink font-semibold">&ldquo;{room.name}&rdquo;</strong>?
            Esta ação não pode ser desfeita e qualquer turma vinculada perderá este ponto de presença padrão.
          </p>

          {error && (
            <div className="rounded-lg border border-danger/30 bg-danger-surface p-3 text-caption font-medium text-danger mb-4">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="flex h-10 items-center rounded-lg border border-border px-4 text-label font-medium text-muted transition-colors hover:border-ink/30 hover:text-ink cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleDelete}
              className="flex h-10 items-center gap-2 rounded-lg bg-danger px-5 text-label font-bold text-white transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50"
            >
              {submitting && (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              <span>{submitting ? "Excluindo..." : "Excluir permanentemente"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
