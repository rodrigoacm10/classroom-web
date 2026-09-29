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

export const tenantService = {
  listMyTenants,
  switchTenant,
};
