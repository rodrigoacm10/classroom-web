/**
 * Tipos e interfaces de domínio do módulo Turmas.
 */

export type TurmasStatusFilter = "all" | "active" | "inactive" | "live";

export type TurmasSortOption =
  | "name_asc"
  | "rate_desc"
  | "rate_asc"
  | "students_desc";

export interface TurmasKpiData {
  totalClasses: number;
  activeClasses: number;
  totalStudents: number;
  avgAttendance: number;
  atRiskCount: number;
  liveCount: number;
}
