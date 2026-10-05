/**
 * Tipos e interfaces de domínio do módulo Dashboard.
 */

export type ClassStatus = "live" | "alert" | "normal";

export type ClassItem = {
  id: string;
  name: string;
  subtitle: string;
  students: number;
  attendance: number; // 0–100
  status: ClassStatus;
  accentColor: "accent" | "ink" | "danger";
  activeSessionId?: string | null;
};

export type AtRiskStudent = {
  id: string;
  initials: string;
  name: string;
  classLabel: string;
  absences: number;
  attendancePct: number;
  /** true = danger zone (<= 71%), false = warning zone (72–74%) */
  critical: boolean;
};
