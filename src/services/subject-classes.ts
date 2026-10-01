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

export type ListSubjectClassesParams = {
  professor_id?: string;
  room_id?: string;
  search?: string;
  active?: boolean;
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
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.page_size !== undefined) query.set("page_size", String(params.page_size));

  const qs = query.toString() ? `?${query.toString()}` : "";
  return api<SubjectClassesPageResponse>(`/subject-classes${qs}`);
}

export const subjectClassService = {
  listSubjectClasses,
};
