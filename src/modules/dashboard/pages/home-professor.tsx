"use client";

import { CallBanner } from "@/components/global";
import { useDashboard } from "../hooks";
import {
  DashboardHeader,
  DashboardStats,
  ClassList,
  WeekFrequencyChart,
  AtRiskList,
} from "../components";

export function HomeProfessor() {
  const {
    userName,
    stats,
    classes,
    atRiskStudents,
    weekFrequency,
    loading,
    error,
  } = useDashboard();

  return (
    <div className="flex flex-1 flex-col bg-paper">
      {/* Header */}
      <DashboardHeader userName={userName} />

      {/* Banner de chamada em tempo real (Auto-suficiente) */}
      <CallBanner />

      {/* Notificação de erro geral */}
      {error ? (
        <div className="mx-9 my-3 rounded-md border border-danger bg-danger-surface p-4 text-label/body text-ink">
          <span>{error}</span>
        </div>
      ) : null}

      {/* Métricas consolidadas */}
      <DashboardStats stats={stats} />

      {/* Área principal em duas colunas */}
      <div className="flex flex-1 gap-10 px-9 pb-7 pt-4">
        <ClassList items={classes} loading={loading} />

        <div className="flex w-[340px] shrink-0 flex-col gap-5">
          <WeekFrequencyChart data={weekFrequency} />
          <AtRiskList students={atRiskStudents} loading={loading} />
        </div>
      </div>
    </div>
  );
}
