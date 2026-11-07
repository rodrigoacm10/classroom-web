import { StatCard } from "./stat-card";
import type { DashboardStatsData } from "../types";

interface DashboardStatsProps {
  stats: DashboardStatsData;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="flex w-full items-stretch px-9 py-5">
      <StatCard
        label="Turmas ativas"
        value={stats.totalClasses}
        sub="neste semestre"
        border="right"
      />
      <StatCard
        label="Alunos registrados"
        value={stats.totalStudents}
        sub="matrículas únicas"
        border="left"
      />
      <StatCard
        label="Frequência média"
        value={stats.averageAttendance}
        sub="últimos 30 dias"
        valueClass={stats.averageAttendanceClass}
        border="both"
      />
      <StatCard
        label="Em risco de falta"
        value={stats.totalAtRisk}
        sub="abaixo de 75%"
        valueClass={stats.atRiskClass}
        border="left"
      />
    </div>
  );
}
