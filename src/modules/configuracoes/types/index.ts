import type { MyTenantResponse, MembersMetricsResponse } from "@/services/tenants";
import type { UserProfileResponse } from "@/services/user";

export interface TenantConfigState {
  tenant: MyTenantResponse | null;
  profile: UserProfileResponse | null;
  metrics: MembersMetricsResponse | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
}

export type ToastMessage = {
  type: "success" | "error";
  text: string;
};
