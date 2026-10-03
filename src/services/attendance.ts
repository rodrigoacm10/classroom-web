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

export type CreateAttendanceSessionRequest = {
  room_id?: string | null;
  duration_minutes: number;
};

export type AttendanceSessionResponse = {
  id: string;
  subject_class_id: string;
  room_id: string | null;
  subject_class?: {
    id: string;
    name: string;
    discipline_name: string;
  } | null;
  room?: {
    id: string;
    name: string;
  } | null;
  day_code: string;
  opened_at: string;
  expires_at: string;
  closed_at: string | null;
  status: string;
  duration_minutes: number;
  total_students: number;
  confirmed_count: number;
  irregular_count: number;
  created_at: string;
  updated_at: string;
};

/** Item do roster da chamada ao vivo (aluno + status de presença) */
export type SessionRosterItem = {
  tenant_member_id: string;
  student_name: string;
  enrollment_id: string;
  record_id: string | null;
  confirmed_at: string | null;
  distance_meters: number | null;
  within_radius: boolean | null;
  /** "pending" | "approved" | "rejected" | null */
  record_status: string | null;
};

/**
 * Consulta as chamadas abertas e ativas no momento no tenant.
 */
export async function listActiveAttendanceSessions(): Promise<ActiveAttendanceSessionResponse[]> {
  return api<ActiveAttendanceSessionResponse[]>("/attendance-sessions/active");
}

/**
 * Abre uma nova sessão de chamada para a turma informada.
 */
export async function openAttendanceSession(
  subjectClassId: string,
  body: CreateAttendanceSessionRequest
): Promise<AttendanceSessionResponse> {
  return api<AttendanceSessionResponse>(
    `/subject-classes/${subjectClassId}/attendance-sessions`,
    {
      method: "POST",
      body,
    }
  );
}

/**
 * Retorna os detalhes de uma sessão de chamada específica.
 */
export async function getAttendanceSession(
  subjectClassId: string,
  sessionId: string
): Promise<AttendanceSessionResponse> {
  return api<AttendanceSessionResponse>(
    `/subject-classes/${subjectClassId}/attendance-sessions/${sessionId}`
  );
}

/**
 * Lista o roster completo da turma com status de presença de cada aluno.
 */
export async function listSessionRoster(
  subjectClassId: string,
  sessionId: string
): Promise<SessionRosterItem[]> {
  return api<SessionRosterItem[]>(
    `/subject-classes/${subjectClassId}/attendance-sessions/${sessionId}/roster`
  );
}

/**
 * Encerra manualmente uma chamada em aberto.
 */
export async function closeAttendanceSession(
  subjectClassId: string,
  sessionId: string
): Promise<AttendanceSessionResponse> {
  return api<AttendanceSessionResponse>(
    `/subject-classes/${subjectClassId}/attendance-sessions/${sessionId}/close`,
    { method: "PATCH" }
  );
}

/**
 * Cancela manualmente uma chamada em aberto, anulando presenças/faltas.
 */
export async function cancelAttendanceSession(
  subjectClassId: string,
  sessionId: string
): Promise<AttendanceSessionResponse> {
  return api<AttendanceSessionResponse>(
    `/subject-classes/${subjectClassId}/attendance-sessions/${sessionId}/cancel`,
    { method: "PATCH" }
  );
}

export type AttendanceSessionsPageResponse = {
  items: AttendanceSessionResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
};

export type ListAttendanceSessionsParams = {
  status?: string;
  opened_after?: string;
  opened_before?: string;
  page?: number;
  page_size?: number;
};

/**
 * Consulta o histórico de sessões de chamada de uma turma.
 */
export async function listAttendanceSessions(
  subjectClassId: string,
  params: ListAttendanceSessionsParams = {}
): Promise<AttendanceSessionsPageResponse> {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.opened_after) query.set("opened_after", params.opened_after);
  if (params.opened_before) query.set("opened_before", params.opened_before);
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.page_size !== undefined) query.set("page_size", String(params.page_size));

  const qs = query.toString() ? `?${query.toString()}` : "";
  return api<AttendanceSessionsPageResponse>(
    `/subject-classes/${subjectClassId}/attendance-sessions${qs}`
  );
}

export type LastSessionSummary = {
  id: string;
  subject_class_id: string;
  subject_class_name: string;
  discipline_name: string;
  room_name: string | null;
  opened_at: string;
  day_code: string;
  status: string;
  confirmed_count: number;
  total_students: number;
  attendance_rate: number;
};

export type AttendanceMetricsResponse = {
  total_sessions: number;
  average_attendance_rate: number;
  cancelled_sessions: number;
  last_session: LastSessionSummary | null;
};

export type ListTenantAttendanceSessionsParams = {
  subject_class_id?: string;
  status?: string;
  exclude_status?: string;
  opened_after?: string;
  opened_before?: string;
  search?: string;
  page?: number;
  page_size?: number;
};

/**
 * Consulta todas as sessões de chamada do tenant / professor logado com paginação e filtros.
 */
export async function listTenantAttendanceSessions(
  params: ListTenantAttendanceSessionsParams = {}
): Promise<AttendanceSessionsPageResponse> {
  const query = new URLSearchParams();
  if (params.subject_class_id) query.set("subject_class_id", params.subject_class_id);
  if (params.status) query.set("status", params.status);
  if (params.exclude_status) query.set("exclude_status", params.exclude_status);
  if (params.opened_after) query.set("opened_after", params.opened_after);
  if (params.opened_before) query.set("opened_before", params.opened_before);
  if (params.search) query.set("search", params.search);
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.page_size !== undefined) query.set("page_size", String(params.page_size));

  const qs = query.toString() ? `?${query.toString()}` : "";
  return api<AttendanceSessionsPageResponse>(`/attendance-sessions${qs}`);
}

/**
 * Consulta métricas consolidadas de chamadas (últimos N dias e última chamada).
 */
export async function getAttendanceMetrics(
  days: number = 30
): Promise<AttendanceMetricsResponse> {
  return api<AttendanceMetricsResponse>(`/attendance-sessions/metrics?days=${days}`);
}

export const attendanceService = {
  listActiveAttendanceSessions,
  listAttendanceSessions,
  listTenantAttendanceSessions,
  getAttendanceMetrics,
  openAttendanceSession,
  getAttendanceSession,
  listSessionRoster,
  closeAttendanceSession,
  cancelAttendanceSession,
};

