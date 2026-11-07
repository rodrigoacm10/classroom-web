"use client";

import React from "react";
import { MapPinIcon } from "@/components/icons";

export function SalasEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: "var(--color-surface)" }}
      >
        <MapPinIcon size={28} />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="font-bold text-heading text-ink">Nenhuma sala cadastrada</span>
        <span className="text-body text-muted max-w-xs">
          As salas definem o ponto GPS onde os alunos devem estar para confirmar presença.
        </span>
      </div>
    </div>
  );
}

export function SalasNoResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <span className="font-bold text-heading text-ink">Nenhuma sala encontrada</span>
      <span className="text-body text-muted">Tente buscar por outro nome.</span>
      <button
        type="button"
        onClick={onClear}
        className="mt-1 text-label font-semibold text-ink underline underline-offset-4 decoration-1 hover:opacity-70 transition-opacity cursor-pointer"
      >
        Limpar busca
      </button>
    </div>
  );
}
