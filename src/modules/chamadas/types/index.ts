/**
 * Tipos e interfaces de domínio do módulo Chamadas.
 */

export type AttendanceCallStatus =
  | "ENCERRADA"
  | "EXPIRADA"
  | "CANCELADA"
  | "ABERTA"
  | "EM ANDAMENTO";

export type AttendanceRecord = {
  id: string;
  discipline: string;
  classCode: string;
  room: string;
  timeBadge: string;
  dateLabel: string;
  timeRange: string;
  duration: string;
  present: number;
  total: number;
  rate: number;
  status: AttendanceCallStatus;
  dayCode?: string;
  notes?: string;
  subjectClassId?: string;
};

export type AttendanceTab = "realizadas" | "em_andamento";
export type AttendanceSort = "recent" | "oldest" | "presence";
export type AttendancePeriod = "30days" | "semester" | "all";
export type AttendanceStatusFilter = "all" | "ENCERRADA" | "EXPIRADA" | "CANCELADA";
