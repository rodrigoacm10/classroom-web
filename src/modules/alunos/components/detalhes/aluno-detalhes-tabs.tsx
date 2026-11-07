"use client";

import React from "react";
import { ClassesIcon, AttendanceIcon } from "@/components/icons";
import type { AlunoDetalhesTab } from "../../types";

export interface AlunoDetalhesTabsProps {
  activeTab: AlunoDetalhesTab;
  onTabChange: (tab: AlunoDetalhesTab) => void;
  turmasCount: number;
  chamadasCount: number;
}

export function AlunoDetalhesTabs({
  activeTab,
  onTabChange,
  turmasCount,
  chamadasCount,
}: AlunoDetalhesTabsProps) {
  return (
    <div className="border-b border-border bg-white px-8 lg:px-10">
      <nav className="flex space-x-8" aria-label="Abas da ficha do aluno">
        <button
          type="button"
          onClick={() => onTabChange("turmas")}
          className={`flex items-center gap-2 border-b-2 py-4 text-label font-bold transition-colors cursor-pointer ${
            activeTab === "turmas"
              ? "border-ink text-ink"
              : "border-transparent text-muted hover:border-border hover:text-ink"
          }`}
        >
          <ClassesIcon />
          <span>Turmas Matriculadas</span>
          <span
            className={`rounded-full px-2 py-0.5 text-caption font-mono font-semibold ${
              activeTab === "turmas"
                ? "bg-ink text-paper"
                : "bg-surface text-muted"
            }`}
          >
            {turmasCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("chamadas")}
          className={`flex items-center gap-2 border-b-2 py-4 text-label font-bold transition-colors cursor-pointer ${
            activeTab === "chamadas"
              ? "border-ink text-ink"
              : "border-transparent text-muted hover:border-border hover:text-ink"
          }`}
        >
          <AttendanceIcon size={15} />
          <span>Histórico de Chamadas</span>
          <span
            className={`rounded-full px-2 py-0.5 text-caption font-mono font-semibold ${
              activeTab === "chamadas"
                ? "bg-ink text-paper"
                : "bg-surface text-muted"
            }`}
          >
            {chamadasCount}
          </span>
        </button>
      </nav>
    </div>
  );
}
