import type { UserProfileResponse } from "@/services/user";
import type { MyTenantResponse } from "@/services/tenants";

export interface PerfilData {
  user: UserProfileResponse | null;
  tenants: MyTenantResponse[];
  activeTenant: MyTenantResponse | null;
}

export interface ToastState {
  type: "success" | "error" | "info";
  message: string;
}

