/**
 * Tipos e interfaces de domínio do módulo de Convites & Acessos.
 */

export type InviteRole = "aluno" | "professor" | "coordenador" | "admin";

export type InviteStatus = "pending" | "accepted" | "expired" | "revoked";

export type InviteStatusFilter = "all" | "pending" | "accepted" | "expired" | "revoked";

export type InviteRoleFilter = "all" | "aluno" | "professor" | "coordenador" | "admin";

export type InviteSortOption =
  | "newest"
  | "oldest"
  | "email_asc"
  | "email_desc";

export interface InviteItem {
  id: string;
  tenant_id: string;
  tenant_name: string;
  email: string;
  role: InviteRole;
  status: InviteStatus;
  token: string;
  subject_class_ids: string[];
  subject_class_names?: string[];
  expires_at: string;
  created_at: string;
  accepted_at?: string | null;
  revoked_at?: string | null;
  invited_by_name?: string;
}

export interface InvitesKpiData {
  total: number;
  pending: number;
  accepted: number;
  expired: number;
  revoked: number;
  acceptanceRate: number; // 0 a 100
}

export interface SendInviteFormData {
  email: string;
  role: InviteRole;
  subjectClassIds: string[];
}
