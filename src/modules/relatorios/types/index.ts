import type { StudentReportItem, ClassReportResponse } from "@/services/reports";

export type ReportStatusFilter = "all" | "regular" | "risk" | "gps_warning";

export type ReportSortOption =
  | "risk_first"
  | "freq_desc"
  | "freq_asc"
  | "name_asc"
  | "name_desc"
  | "gps_desc";

export interface TurmaReportOption {
  id: string;
  name: string;
  discipline_name: string;
  professor_name: string;
  student_count: number;
  room_name?: string;
}

export interface EnrichedStudentReportItem extends StudentReportItem {
  id: string;
  total_sessions: number;
}

export interface EnrichedClassReportResponse extends ClassReportResponse {
  subject_class_name: string;
  discipline_name: string;
  professor_name: string;
  room_name?: string;
  total_sessions: number;
  total_presences: number;
  total_absences: number;
  avg_distance_meters: number;
  students_with_gps_warning: number;
  students: EnrichedStudentReportItem[];
}
