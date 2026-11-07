import type { Metadata } from "next";
import { SecondaryPage } from "@/components/ui/secondary-page";
import { TenantPicker } from "@/app/tenants/tenant-picker";

export const metadata: Metadata = {
  title: "Escolher instituição",
  description: "Selecione em qual instituição você quer entrar.",
};

export default function TenantsPage() {
  return (
    <SecondaryPage>
      <h1 className="text-[32px] leading-9 font-black tracking-tight text-ink sm:text-[40px] sm:leading-[46px]">
        Escolha a instituição
      </h1>
      <p className="mt-3 text-body/body text-muted">
        Selecione em qual instituição você quer entrar.
      </p>

      <TenantPicker />
    </SecondaryPage>
  );
}
