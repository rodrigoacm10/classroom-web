"use client";

import React, { useEffect } from "react";
import { AlertTriangleIcon } from "@/components/icons";
import type { MyTenantResponse } from "@/services/tenants";

export interface SuspenderTenantModalProps {
  tenant: MyTenantResponse | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function SuspenderTenantModal({
  tenant,
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: SuspenderTenantModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen || !tenant) return null;

  const isSuspending = tenant.active;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-3.5">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                isSuspending
                  ? "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                  : "bg-success-surface text-success border border-success/30"
              }`}
            >
              <AlertTriangleIcon size={22} />
            </div>

            <div>
              <h3 className="font-sans text-heading font-bold text-ink">
                {isSuspending ? "Suspender Instituição?" : "Reativar Instituição?"}
              </h3>
              <p className="mt-1 text-body text-muted leading-relaxed">
                {isSuspending ? (
                  <>
                    Ao suspender <strong className="text-ink font-semibold">{tenant.name}</strong>,
                    os docentes não poderão iniciar novas sessões de chamada. Os dados históricos e turmas
                    permanecerão preservados.
                  </>
                ) : (
                  <>
                    Ao reativar <strong className="text-ink font-semibold">{tenant.name}</strong>,
                    as operações de chamada e matrículas voltam a operar normalmente.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="rounded-lg border border-border bg-white px-4 py-2.5 text-label font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-40 cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-label font-bold text-white shadow-xs transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-50 cursor-pointer ${
                isSuspending ? "bg-amber-600" : "bg-ink"
              }`}
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Processando...</span>
                </>
              ) : (
                <span>{isSuspending ? "Confirmar Suspensão" : "Confirmar Reativação"}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
