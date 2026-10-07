"use client";

import React from "react";
import { UsersIcon, ClockIcon, MapPinIcon } from "@/components/icons";
import type { TurmaDetalhesTab } from "../../types";

export interface DetalhesTabsNavProps {
  activeTab: TurmaDetalhesTab;
  onTabChange: (tab: TurmaDetalhesTab) => void;
  studentsCount: number;
  sessionsCount: number;
}

export function DetalhesTabsNav({
  activeTab,
  onTabChange,
  studentsCount,
  sessionsCount,
}: DetalhesTabsNavProps) {
  return (
    <div className="flex items-center gap-6 border-b border-border bg-white px-8 lg:px-10">
      <button
        type="button"
        onClick={() => onTabChange("students")}
        className={`py-3.5 text-label font-bold transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
          activeTab === "students"
            ? "border-ink text-ink"
            : "border-transparent text-muted hover:text-ink"
        }`}
      >
        <UsersIcon size={15} />
        <span>Alunos & Frequência</span>
        <span className="rounded-full bg-surface border border-border px-2 py-0.5 text-caption font-mono text-ink">
          {studentsCount}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("sessions")}
        className={`py-3.5 text-label font-bold transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
          activeTab === "sessions"
            ? "border-ink text-ink"
            : "border-transparent text-muted hover:text-ink"
        }`}
      >
        <ClockIcon size={14} />
        <span>Histórico de Chamadas</span>
        <span className="rounded-full bg-surface border border-border px-2 py-0.5 text-caption font-mono text-ink">
          {sessionsCount}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("settings")}
        className={`py-3.5 text-label font-bold transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
          activeTab === "settings"
            ? "border-ink text-ink"
            : "border-transparent text-muted hover:text-ink"
        }`}
      >
        <MapPinIcon size={14} />
        <span>Espaço Físico & Geofence</span>
      </button>
    </div>
  );
}
