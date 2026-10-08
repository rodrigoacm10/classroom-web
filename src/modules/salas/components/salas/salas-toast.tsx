"use client";

import React from "react";
import { CloseIcon } from "@/components/icons";
import type { SalasToastMessage } from "../../types";

export interface SalasToastProps {
  toast: SalasToastMessage | null;
  onClose: () => void;
}

export function SalasToast({ toast, onClose }: SalasToastProps) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-border bg-paper px-4 py-3 shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
      <div
        className={`h-2.5 w-2.5 rounded-full ${
          toast.type === "success" ? "bg-success" : "bg-danger"
        }`}
      />
      <span className="text-[13px] font-medium text-ink">{toast.text}</span>
      <button
        type="button"
        onClick={onClose}
        className="text-muted hover:text-ink cursor-pointer ml-2"
        aria-label="Fechar notificação"
      >
        <CloseIcon size={13} />
      </button>
    </div>
  );
}
