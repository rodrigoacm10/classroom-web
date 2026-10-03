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
};

export type ListStudentsParams = {
  search?: string;
  subject_class_id?: string;
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
  if (params.include_deleted !== undefined)
    query.set("include_deleted", String(params.include_deleted));
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.page_size !== undefined) query.set("page_size", String(params.page_size));

  const qs = query.toString() ? `?${query.toString()}` : "";
  return api<StudentsPageResponse>(`/members/students${qs}`);
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

export const tenantService = {
  listMyTenants,
  switchTenant,
  listStudents,
  listTenantMembers,
};

