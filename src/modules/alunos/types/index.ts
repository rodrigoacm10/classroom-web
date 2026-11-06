/**
 * Tipos e interfaces de domínio do módulo Alunos.
 */

export type UserRoleScope = "admin" | "professor" | "coordenador";

export type AlunosStatusFilter = "all" | "regular" | "sem_turma";

export type AlunosSortOption =
  | "name_asc"
  | "name_desc"
  | "turmas_desc"
  | "turmas_asc";

export interface AlunoTurma {
  id: string;
  enrollment_id?: string;
  name: string;
  discipline_name: string;
  professor_name: string;
  professor_id?: string;
  room_name: string;
  attendance_rate: number; // 0 a 1
  total_sessions: number;
  total_present: number;
  total_absent: number;
  avg_distance_meters: number;
  status: "regular" | "at_risk";
  is_mine?: boolean;
}

export interface AlunoItem {
  id: string;
  tenant_member_id: string;
  user_id: string;
  name: string;
  email: string;
  role: "aluno";
  matricula: string;
  created_at: string;
  turmas_count: number;
  turmas: AlunoTurma[];
  global_attendance_rate: number; // 0 a 1
  total_sessions: number;
  total_present: number;
  total_absent: number;
  avg_distance_meters: number;
  status: "regular" | "at_risk" | "sem_turma";
}

export interface AlunosKpiData {
  totalStudents: number;
  avgClassesPerStudent: number;
  avgAttendanceRate: number; // percentual 0 a 100
  atRiskCount: number;
  noClassCount: number;
  totalEnrollments: number;
}

export interface TurmaOption {
  id: string;
  name: string;
  discipline_name: string;
  professor_name: string;
  is_mine?: boolean; // Se pertence ao professor autenticado
}

export type AlunoDetalhesTab = "turmas" | "chamadas";

export type ChamadaStatusFilter = "all" | "presente" | "falta";

export interface ChamadaHistoricoItem {
  id: string;
  session_id: string;
  subject_class_id: string;
  subject_class_name: string;
  discipline_name: string;
  room_name: string;
  professor_name: string;
  professor_id?: string;
  date: string;
  status: "presente" | "falta";
  distance_meters: number | null;
  within_radius: boolean;
  accuracy_meters: number | null;
}
