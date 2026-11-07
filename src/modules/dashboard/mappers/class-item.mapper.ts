import type { SubjectClassItem } from "@/lib/api";
import type { ClassItem, ClassStatus } from "../types";

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
    subtitle: `${item.name} · ${item.room_name ?? "Sem sala"}`,
    students: item.student_count,
    attendance: attendancePct,
    status,
    accentColor,
    activeSessionId: item.active_session_id,
  };
}
