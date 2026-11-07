import type { AtRiskStudentMetric } from "@/lib/api";
import type { AtRiskStudent } from "../types";
import { getInitials } from "@/lib/utils";

/**
 * Converte um aluno em risco da API para o modelo de exibição da lista de risco.
 */
export function toAtRiskStudent(student: AtRiskStudentMetric): AtRiskStudent {
  return {
    id: student.enrollment_id,
    initials: getInitials(student.student_name),
    name: student.student_name,
    classLabel: `${student.class_name} · ${student.absences} ${
      student.absences === 1 ? "falta" : "faltas"
    }`,
    absences: student.absences,
    attendancePct: Math.round(student.attendance_rate * 100),
    critical: student.critical,
  };
}
