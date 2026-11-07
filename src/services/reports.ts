import { api } from "@/lib/api-client";

export type StudentReportItem = {
  tenant_member_id: string;
  student_name: string;
  email: string;
  total_present: number;
  total_absent: number;
  total_irregular: number;
  frequency_rate: number;
  at_risk: boolean;
  avg_distance_meters: number;
  confirmations_near_limit: number;
};

export type ClassReportResponse = {
  subject_class_id: string;
  total_students: number;
  class_average_frequency: number;
  students_at_risk: number;
  students: StudentReportItem[];
  strategy_used: string;
  workers_used: number;
  duration_ms: number;
};

/**
 * Gera o relatório de frequência consolidado da turma com contagem de alunos em risco.
 */
export async function generateClassFrequencyReport(
  subjectClassId: string
): Promise<ClassReportResponse> {
  return api<ClassReportResponse>(
    `/subject-classes/${subjectClassId}/reports/frequency`,
    {
      method: "POST",
    }
  );
}

export const reportService = {
  generateClassFrequencyReport,
};
