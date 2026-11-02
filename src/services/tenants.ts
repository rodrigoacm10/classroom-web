import { api, getStoredToken, setStoredToken } from "@/lib/api-client";

export type MyTenantResponse = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  deleted: boolean;
  role: "admin" | "professor" | "aluno" | "coordenador";
  created_at: string;
};

export type SwitchTenantResponse = {
  access_token: string;
  token_type: string;
};

export type StudentItem = {
  id: string; // tenant_member_id (usado para matricular em turmas)
  tenant_member_id: string;
  user_id: string;
  name: string;
  email: string;
  role: "aluno";
  created_at: string;
  turmas_count?: number;
  attendance_rate?: number;
  total_sessions?: number;
  total_present?: number;
  total_absent?: number;
  status?: "regular" | "at_risk" | "sem_turma";
};

export type StudentsMetricsResponse = {
  total_students: number;
  avg_classes_per_student: number;
  total_enrollments: number;
  average_attendance_rate: number;
  students_at_risk: number;
  students_no_class: number;
};

export type ListStudentsParams = {
  search?: string;
  subject_class_id?: string;
  status?: "regular" | "sem_turma";
  sort_by?: "name" | "turmas_count" | "created_at";
  order?: "asc" | "desc";
  include_deleted?: boolean;
  page?: number;
  page_size?: number;
};

export type StudentsPageResponse = {
  items: StudentItem[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
};

export type TenantMemberResponse = {
  id: string;
  tenant_id: string;
  user_id: string;
  name: string;
  email: string;
  role: "admin" | "professor" | "aluno" | "coordenador";
  created_at: string;
};

export type ListTenantMembersParams = {
  role?: "admin" | "professor" | "aluno" | "coordenador";
  search?: string;
  subject_class_id?: string;
  page?: number;
  page_size?: number;
};

export type TenantMembersPageResponse = {
  items: TenantMemberResponse[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
};

/** Fetch the tenants the current user belongs to (requires base token). */
export function listMyTenants(token?: string) {
  const tokenToUse = token ?? getStoredToken();
  return api<MyTenantResponse[]>("/tenants/me", {
    headers: tokenToUse ? { Authorization: `Bearer ${tokenToUse}` } : {},
  });
}

/**
 * Exchange the base token for a tenant-scoped token.
 * Note: Per tenant-context-routing.md, this is the only auth transition endpoint
 * that explicitly takes tenant_id. All subsequent business requests (e.g. /rooms,
 * /subject-classes) derive tenant_id directly from the claims inside the enriched JWT.
 */
export async function switchTenant(tenantId: string, token?: string) {
  const tokenToUse = token ?? getStoredToken();
  const res = await api<SwitchTenantResponse>("/auth/switch-tenant", {
    method: "POST",
    body: { tenant_id: tenantId },
    headers: tokenToUse ? { Authorization: `Bearer ${tokenToUse}` } : {},
    skipAuthRefresh: true,
  });

  setStoredToken(res.access_token);
  return res;
}

/**
 * Lista todos os alunos (papel ALUNO) da instituição ativa (/members/students).
 * Acessível por ADMIN, COORDENADOR e PROFESSOR.
 * Retorna campos flat (id/tenant_member_id, user_id, name, email, role, created_at).
 */
export async function listStudents(
  params: ListStudentsParams = {}
): Promise<StudentsPageResponse> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.subject_class_id) query.set("subject_class_id", params.subject_class_id);
  if (params.status) query.set("status", params.status);
  if (params.sort_by) query.set("sort_by", params.sort_by);
  if (params.order) query.set("order", params.order);
  if (params.include_deleted !== undefined)
    query.set("include_deleted", String(params.include_deleted));
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.page_size !== undefined) query.set("page_size", String(params.page_size));

  const qs = query.toString() ? `?${query.toString()}` : "";
  return api<StudentsPageResponse>(`/members/students${qs}`);
}

/**
 * Consulta os KPIs consolidados dos alunos no tenant ativo (/members/students/metrics).
 * Retorna contagem total de alunos, média de turmas por aluno, frequência média e alunos em risco.
 */
export async function getStudentsMetrics(): Promise<StudentsMetricsResponse> {
  return api<StudentsMetricsResponse>("/members/students/metrics");
}

/**
 * Lista os membros de uma instituição específica (/tenants/{tenantId}/members).
 * Retorna campos flat incluindo name e email do usuário.
 * Requer permissão de ADMIN ou COORDENADOR.
 */
export async function listTenantMembers(
  tenantId: string,
  params: ListTenantMembersParams = {}
): Promise<TenantMembersPageResponse> {
  const query = new URLSearchParams();
  if (params.role) query.set("role", params.role);
  if (params.search) query.set("search", params.search);
  if (params.subject_class_id) query.set("subject_class_id", params.subject_class_id);
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.page_size !== undefined) query.set("page_size", String(params.page_size));

  const qs = query.toString() ? `?${query.toString()}` : "";
  return api<TenantMembersPageResponse>(`/tenants/${tenantId}/members${qs}`);
}

export type InviteStatusResponse = {
  id: string;
  tenant_id: string;
  tenant_name: string;
  email: string;
  role: "admin" | "professor" | "aluno" | "coordenador";
  token: string;
  status: "pending" | "accepted" | "expired" | "revoked";
  expires_at: string;
  created_at: string;
};

/**
 * Consulta os detalhes de um convite a partir do token (Endpoint público).
 */
export async function getInvite(token: string): Promise<InviteStatusResponse> {
  return api<InviteStatusResponse>(`/invites/${token}`, {
    skipAuthRefresh: true,
  });
}

/**
 * Aceita um convite para ingressar em uma instituição.
 * Requer autenticação do usuário.
 */
export async function acceptInvite(
  token: string,
  authToken?: string,
): Promise<TenantMemberResponse> {
  const tokenToUse = authToken ?? getStoredToken();
  return api<TenantMemberResponse>(`/invites/${token}/accept`, {
    method: "POST",
    headers: tokenToUse ? { Authorization: `Bearer ${tokenToUse}` } : {},
    skipAuthRefresh: true,
  });
}

export type CreateTenantData = {
  name: string;
  slug: string;
};

export type TenantResponse = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  deleted: boolean;
  created_at: string;
};

/**
 * Cria uma nova Tenant/Instituição (/tenants/).
 * Requer autenticação. O criador torna-se automaticamente ADMIN dela.
 */
export async function createTenant(
  data: CreateTenantData,
  token?: string,
): Promise<TenantResponse> {
  const tokenToUse = token ?? getStoredToken();
  return api<TenantResponse>("/tenants/", {
    method: "POST",
    body: data,
    headers: tokenToUse ? { Authorization: `Bearer ${tokenToUse}` } : {},
  });
}

export type SendInviteData = {
  email: string;
  role: "admin" | "professor" | "aluno" | "coordenador";
  subject_class_ids?: string[];
};

/**
 * Envia um convite de ingresso na instituição por e-mail, podendo já vincular turmas.
 * Se o tenantId for omitido, utiliza a rota padrão da tenant ativa `/invites`.
 */
export async function sendInvite(
  dataOrTenantId: string | SendInviteData,
  maybeData?: SendInviteData,
  token?: string
): Promise<InviteStatusResponse> {
  const tokenToUse = token ?? getStoredToken();
  let url = "/invites";
  let body: SendInviteData;

  if (typeof dataOrTenantId === "string") {
    url = `/tenants/${dataOrTenantId}/invites`;
    body = maybeData!;
  } else {
    body = dataOrTenantId;
  }

  return api<InviteStatusResponse>(url, {
    method: "POST",
    body,
    headers: tokenToUse ? { Authorization: `Bearer ${tokenToUse}` } : {},
  });
}

/**
 * Consulta os dados cadastrais e indicadores de frequência consolidados de um aluno específico (/members/students/{studentId}).
 */
export async function getStudent(studentId: string): Promise<StudentItem> {
  return api<StudentItem>(`/members/students/${studentId}`);
}

export type StudentAttendanceHistoryItemResponse = {
  session_id: string;
  subject_class_id: string;
  subject_class_name: string;
  discipline_name: string;
  room_id?: string | null;
  room_name?: string | null;
  opened_at: string;
  session_status: string;
  record_status?: string | null;
  confirmed_at?: string | null;
  record_id?: string | null;
};

export type StudentAttendanceHistoryPageResponse = {
  items: StudentAttendanceHistoryItemResponse[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
};

/**
 * Consulta o histórico de chamadas das turmas vinculadas do aluno (/members/{memberId}/attendance-history).
 */
export async function getStudentAttendanceHistory(
  memberId: string,
  params?: {
    subject_class_id?: string;
    status?: string;
    page?: number;
    page_size?: number;
  }
): Promise<StudentAttendanceHistoryPageResponse> {
  const query = new URLSearchParams();
  if (params?.subject_class_id && params.subject_class_id !== "all") {
    query.set("subject_class_id", params.subject_class_id);
  }
  if (params?.status && params.status !== "all") {
    query.set("status", params.status);
  }
  if (params?.page) query.set("page", String(params.page));
  if (params?.page_size) query.set("page_size", String(params.page_size));

  const qs = query.toString() ? `?${query.toString()}` : "";
  return api<StudentAttendanceHistoryPageResponse>(
    `/members/${memberId}/attendance-history${qs}`
  );
}

export const tenantService = {
  listMyTenants,
  switchTenant,
  listStudents,
  getStudent,
  getStudentsMetrics,
  listTenantMembers,
  getInvite,
  acceptInvite,
  createTenant,
  sendInvite,
  getStudentAttendanceHistory,
};



