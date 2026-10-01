import { api } from "@/lib/api-client";

export type ActiveAttendanceSessionResponse = {
  session_id: string;
  subject_class_id: string;
  subject_class_name: string;
  discipline_name: string;
  day_code: string;
  room_id: string | null;
  room_name: string | null;
  opened_at: string;
  expires_at: string;
  duration_minutes: number;
  present_count: number;
  total_students: number;
};

/**
 * Consulta as chamadas abertas e ativas no momento no tenant.
 */
export async function listActiveAttendanceSessions(): Promise<ActiveAttendanceSessionResponse[]> {
  return api<ActiveAttendanceSessionResponse[]>("/attendance-sessions/active");
}

export const attendanceService = {
  listActiveAttendanceSessions,
};
