/**
 * Tipos e interfaces de domínio do módulo Turmas.
 */

export type TurmasStatusFilter = "all" | "active" | "inactive" | "live";

export type TurmasSortOption =
  | "name_asc"
  | "name_desc"
  | "students_desc";

export type TurmaDetalhesTab = "students" | "sessions" | "settings";

export type StudentFilter = "all" | "regular" | "at_risk";

export interface TurmasKpiData {
  totalClasses: number;
  activeClasses: number;
  totalStudents: number;
  avgAttendance: number;
  atRiskCount: number;
  liveCount: number;
}

export type StudentMode = "catalog" | "batch";

export interface AvatarStyle {
  bg: string;
  text: string;
  border: string;
}

export interface RadiusInfo {
  label: string;
  color: string;
  bg: string;
}
