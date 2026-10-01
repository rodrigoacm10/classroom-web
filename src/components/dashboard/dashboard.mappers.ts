/**
 * Funções puras de mapeamento entre os contratos da API (DTOs)
 * e os modelos de apresentação da interface (ViewModels).
 */

import type { SubjectClassItem, AtRiskStudentMetric } from "@/lib/api";
import type { ClassItem, ClassStatus, AtRiskStudent } from "./dashboard.types";
import { getInitials } from "@/lib/utils";

/**
 * Converte um item de turma da API para o modelo de exibição do card/linha de turma.
 */
export function toClassItem(item: SubjectClassItem): ClassItem {
  const attendancePct = Math.round(item.attendance_rate * 100);
  const isLive = item.has_active_session;
  const isAlert = attendancePct < 75;

  let accentColor: ClassItem["accentColor"] = "ink";
  if (isLive) accentColor = "accent";
  else if (isAlert) accentColor = "danger";

  let status: ClassStatus = "normal";
  if (isLive) status = "live";
  else if (isAlert) status = "alert";

  return {
    id: item.id,
    name: item.discipline_name,
    // NOTA: Informações de horário da aula (ex: " · 19h") não constam no retorno da rota GET /subject-classes
    subtitle: `${item.name} · ${item.room_name ?? "Sem sala"}`,
    students: item.student_count,
    attendance: attendancePct,
    status,
    accentColor,
    activeSessionId: item.active_session_id,
  };
}

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
