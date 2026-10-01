/**
 * Tipos e interfaces compartilhados para os componentes do dashboard.
 */

/**
 * NOTA: As propriedades de grade horária (ex: "today" -> "HOJE 10H", "tonight", "tomorrow", "wednesday")
 * não constam no retorno da rota GET /subject-classes.
 * Apenas os status verificáveis pela API ("live" e "alert") permanecem ativos.
 */
export type ClassStatus =
  | "live"
  | "alert"
  | "normal";
  // Os status comentados abaixo dependem de horários/agenda de aula não presentes na API:
  // | "today"
  // | "tonight"
  // | "tomorrow"
  // | "wednesday"

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
