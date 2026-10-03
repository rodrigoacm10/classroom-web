import { api } from "@/lib/api-client";

export type SubjectClassItem = {
  id: string;
  tenant_id: string;
  professor_id: string | null;
  professor_name: string | null;
  room_id: string | null;
  room_name: string | null;
  name: string;
  discipline_name: string;
  active: boolean;
  student_count: number;
  attendance_rate: number;
  has_active_session: boolean;
  active_session_id: string | null;
  created_at: string;
  updated_at: string;
};

export type SubjectClassesPageResponse = {
  items: SubjectClassItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
};

export type SubjectClassMetrics = {
  total_classes: number;
  active_classes: number;
  inactive_classes: number;
  total_students: number;
  average_attendance_rate: number;
  at_risk_classes_count: number;
  live_classes_count: number;
};

export type ListSubjectClassesParams = {
  professor_id?: string;
  room_id?: string;
  search?: string;
  active?: boolean;
  has_active_session?: boolean;
  sort_by?: string;
  order?: "asc" | "desc";
  page?: number;
  page_size?: number;
};

/**
 * Lista as turmas da instituição com paginação, filtros,
 * contagem de matrículas, taxa de presença agregada e status de chamada ao vivo.
 */
export async function listSubjectClasses(
  params: ListSubjectClassesParams = {}
): Promise<SubjectClassesPageResponse> {
  const query = new URLSearchParams();
  if (params.professor_id) query.set("professor_id", params.professor_id);
  if (params.room_id) query.set("room_id", params.room_id);
  if (params.search) query.set("search", params.search);
  if (params.active !== undefined) query.set("active", String(params.active));
  if (params.has_active_session !== undefined)
    query.set("has_active_session", String(params.has_active_session));
  if (params.sort_by) query.set("sort_by", params.sort_by);
  if (params.order) query.set("order", params.order);
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.page_size !== undefined) query.set("page_size", String(params.page_size));

  const qs = query.toString() ? `?${query.toString()}` : "";
  return api<SubjectClassesPageResponse>(`/subject-classes${qs}`);
}

/**
 * Retorna as métricas consolidadas das turmas da instituição (ou do professor autenticado).
 */
export async function getSubjectClassMetrics(params?: {
  days?: number;
  professor_id?: string;
}): Promise<SubjectClassMetrics> {
  const query = new URLSearchParams();
  if (params?.days !== undefined) query.set("days", String(params.days));
  if (params?.professor_id) query.set("professor_id", params.professor_id);

  const qs = query.toString() ? `?${query.toString()}` : "";
  return api<SubjectClassMetrics>(`/subject-classes/metrics${qs}`);
}

export type CreateSubjectClassRequest = {
  name: string;
  discipline_name: string;
  room_id: string;
};

export type SubjectClassResponse = {
  id: string;
  tenant_id: string;
  professor_id: string | null;
  room_id: string | null;
  name: string;
  discipline_name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type EnrollmentResponse = {
  id: string;
  subject_class_id: string;
  tenant_member_id: string;
  status: string;
  enrolled_at: string;
};

/**
 * Consulta os detalhes enriquecidos de uma turma por ID.
 */
export async function getSubjectClass(
  subjectClassId: string
): Promise<SubjectClassItem> {
  return api<SubjectClassItem>(`/subject-classes/${subjectClassId}`);
}

/**
 * Cria uma nova turma para a instituição.
 */
export async function createSubjectClass(
  data: CreateSubjectClassRequest
): Promise<SubjectClassResponse> {
  return api<SubjectClassResponse>("/subject-classes", {
    method: "POST",
    body: data,
  });
}

/**
 * Matricula um aluno (tenant_member_id) em uma turma.
 */
export async function enrollStudent(
  subjectClassId: string,
  tenantMemberId: string
): Promise<EnrollmentResponse> {
  return api<EnrollmentResponse>(`/subject-classes/${subjectClassId}/enrollments`, {
    method: "POST",
    body: { tenant_member_id: tenantMemberId },
  });
}

/**
 * Remove uma matrícula da turma (Requer ADMIN ou COORDENADOR).
 */
export async function deleteEnrollment(
  subjectClassId: string,
  enrollmentId: string
): Promise<void> {
  return api<void>(`/subject-classes/${subjectClassId}/enrollments/${enrollmentId}`, {
    method: "DELETE",
  });
}

/**
 * Lista as matrículas de uma turma.
 */
export async function listEnrollments(
  subjectClassId: string,
  params?: { status?: string; page?: number; page_size?: number }
): Promise<{ items: EnrollmentResponse[]; total: number }> {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.page) query.set("page", String(params.page));
  if (params?.page_size) query.set("page_size", String(params.page_size));
  const qs = query.toString() ? `?${query.toString()}` : "";
  return api<{ items: EnrollmentResponse[]; total: number }>(
    `/subject-classes/${subjectClassId}/enrollments${qs}`
  );
}

export const subjectClassService = {
  listSubjectClasses,
  getSubjectClassMetrics,
  getSubjectClass,
  createSubjectClass,
  enrollStudent,
  deleteEnrollment,
  listEnrollments,
};

