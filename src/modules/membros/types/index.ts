/**
 * Tipos e interfaces de domínio do módulo de Gestão de Membros da Instituição.
 */

export type MembroRole = "admin" | "coordenador" | "professor";

export interface MembroItem {
  id: string; // ID do vínculo tenant_member
  user_id: string; // ID do usuário global
  tenant_id: string;
  name: string;
  email: string;
  role: MembroRole;
  created_at: string;
  turmas_count?: number;
  subject_class_names?: string[];
}

export interface MembrosKpiData {
  totalMembers: number;
  professoresCount: number;
  gestaoCount: number;
  turmasCount: number;
}

export type MembrosRoleFilter = "all" | MembroRole;

export type MembrosSortOption =
  | "name_asc"
  | "name_desc"
  | "created_at_desc"
  | "created_at_asc"
  | "role";

export interface SendMemberInviteData {
  email: string;
  role: MembroRole;
  subjectClassIds?: string[];
}
