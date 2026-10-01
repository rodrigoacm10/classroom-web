import { api } from "@/lib/api-client";

export type UserProfileResponse = {
  id: string;
  name: string;
  email: string;
  tenant_id: string | null;
  role: "admin" | "professor" | "aluno" | "coordenador" | null;
  created_at: string;
};

/**
 * Retorna os dados do perfil do usuário autenticado (/users/me).
 */
export async function getMyProfile(): Promise<UserProfileResponse> {
  return api<UserProfileResponse>("/users/me");
}

export const userService = {
  getMyProfile,
};
