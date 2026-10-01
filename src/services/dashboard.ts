import { api } from "@/lib/api-client";

export type DayAttendanceMetric = {
  date: string;
  day_of_week: number;
  day_label: string;
  attendance_rate: number;
  total_sessions: number;
  total_expected: number;
  total_presents: number;
};

export type AtRiskStudentMetric = {
  enrollment_id: string;
  student_name: string;
  class_name: string;
  total_sessions: number;
  absences: number;
  attendance_rate: number;
  critical: boolean;
};

export type DashboardMetricsResponse = {
  total_classes: number;
  total_unique_students: number;
  average_attendance_rate: number;
  total_students_at_risk: number;
  week_frequency: DayAttendanceMetric[];
  at_risk_students: AtRiskStudentMetric[];
};

export type GetDashboardMetricsOptions = {
  active?: boolean;
};

/**
 * Retorna as métricas consolidadas do dashboard:
 * cards do topo, frequência diária da semana (DOM a SAB) e alunos em risco.
 */
export async function getDashboardMetrics(
  options: GetDashboardMetricsOptions = {}
): Promise<DashboardMetricsResponse> {
  const query = new URLSearchParams();
  if (options.active !== undefined) {
    query.set("active", String(options.active));
  }
  const qs = query.toString() ? `?${query.toString()}` : "";
  return api<DashboardMetricsResponse>(`/dashboard/metrics${qs}`);
}

export const dashboardService = {
  getDashboardMetrics,
};
