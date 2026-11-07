"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangleIcon, TrashIcon } from "@/components/icons";
import type { MyTenantResponse } from "@/services/tenants";

export interface ExcluirTenantModalProps {
  tenant: MyTenantResponse | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ExcluirTenantModal({
  tenant,
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: ExcluirTenantModalProps) {
  const [confirmationInput, setConfirmationInput] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setConfirmationInput("");
      return;
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen || !tenant) return null;

  const isConfirmed = confirmationInput.trim().toLowerCase() === tenant.name.trim().toLowerCase();

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-danger/30 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-7">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-danger-surface text-danger border border-danger/30">
              <AlertTriangleIcon size={22} />
            </div>

            <div>
              <h3 className="font-sans text-heading font-bold text-danger">
                Excluir Instituição Definitivamente?
              </h3>
              <p className="mt-1 text-body text-muted leading-relaxed">
                Esta ação desativa a instituição <strong className="text-ink font-semibold">{tenant.name}</strong>.
                Todos os vínculos de membros, turmas e salas associadas serão desabilitados e você
                será redirecionado à seleção de instituições.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-border bg-surface/50 p-4">
            <label className="block text-caption font-semibold text-ink mb-1.5">
              Digite o nome da instituição para confirmar:
            </label>
            <div className="font-mono text-caption text-muted mb-2 select-all font-semibold">
              {tenant.name}
            </div>
            <input
              type="text"
              value={confirmationInput}
              disabled={isLoading}
              onChange={(e) => setConfirmationInput(e.target.value)}
              placeholder="Digite o nome exato aqui..."
              className="w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-body text-ink placeholder:text-muted focus:border-danger focus:outline-none focus:ring-1 focus:ring-danger transition-all"
            />
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
              disabled={!isConfirmed || isLoading}
              onClick={onConfirm}
              className="flex items-center gap-2 rounded-lg bg-danger px-4 py-2.5 text-label font-bold text-white shadow-xs transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Excluindo...</span>
                </>
              ) : (
                <>
                  <TrashIcon size={14} />
                  <span>Excluir Instituição</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
