import type {
  AttendanceSessionResponse,
  ActiveAttendanceSessionResponse,
} from "@/services/attendance";
import { formatShortDate } from "@/lib/utils";
import type { AttendanceRecord, AttendanceCallStatus } from "../types";

/**
 * Converte uma sessão de presença retornada pela API em um AttendanceRecord para visualização.
 */
export function toAttendanceRecord(session: AttendanceSessionResponse): AttendanceRecord {
  const openDate = new Date(session.opened_at);
  const closeDate = session.closed_at ? new Date(session.closed_at) : null;
  const openStr = openDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const closeStr = closeDate
    ? closeDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : session.status === "open"
    ? "Aberta agora"
    : `${session.duration_minutes} min`;

  const statusUpper = (
    session.status === "open" ? "ABERTA" : session.status.toUpperCase()
  ) as AttendanceCallStatus;

  return {
    id: session.id,
    subjectClassId: session.subject_class_id,
    discipline: session.subject_class?.discipline_name || session.subject_class?.name || "Disciplina",
    classCode: session.subject_class?.name || "T01",
    room: session.room?.name || "Sem sala",
    timeBadge: `${openDate.getHours()}h`,
    dateLabel: formatShortDate(session.opened_at),
    timeRange: session.status === "open" ? `${openStr} · Aberta` : `${openStr} - ${closeStr}`,
    duration: `${session.duration_minutes} min`,
    present: session.confirmed_count,
    total: session.total_students,
    rate:
      session.total_students > 0
        ? Math.round((session.confirmed_count / session.total_students) * 100)
        : 0,
    status: statusUpper,
    dayCode: session.day_code,
    notes:
      session.status === "open"
        ? "Chamada em andamento no momento."
        : "Sessão registrada no sistema Locus.",
  };
}

/**
 * Converte uma sessão ativa (tempo real) em um AttendanceRecord para exibição na lista.
 */
export function toAttendanceRecordFromActive(
  activeSession: ActiveAttendanceSessionResponse
): AttendanceRecord {
  const openDate = new Date(activeSession.opened_at);
  const openStr = openDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return {
    id: activeSession.session_id,
    subjectClassId: activeSession.subject_class_id,
    discipline: activeSession.discipline_name,
    classCode: activeSession.subject_class_name,
    room: activeSession.room_name ?? "Sem sala",
    timeBadge: `${openDate.getHours()}h`,
    dateLabel: "Hoje",
    timeRange: `${openStr} · Aberta`,
    duration: `${activeSession.duration_minutes} min`,
    present: activeSession.present_count,
    total: activeSession.total_students,
    rate:
      activeSession.total_students > 0
        ? Math.round((activeSession.present_count / activeSession.total_students) * 100)
        : 0,
    status: "ABERTA",
    dayCode: activeSession.day_code,
    notes: "Chamada em andamento no momento.",
  };
}
