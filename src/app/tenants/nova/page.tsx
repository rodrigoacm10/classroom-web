import type { Metadata } from "next";
import { NovaTenantForm } from "@/app/tenants/nova/nova-tenant-form";
import { SecondaryPage } from "@/components/ui/secondary-page";

export const metadata: Metadata = {
  title: "Criar instituição",
  description: "Cadastre sua instituição de ensino para gerenciar turmas e chamadas no Locus.",
};

export default function NovaTenantPage() {
  return (
    <SecondaryPage>
      <h1 className="text-[32px] leading-9 font-black tracking-tight text-ink sm:text-[40px] sm:leading-[46px]">
        Criar instituição
      </h1>
      <p className="mt-3 text-body/body text-muted">
        Cadastre sua instituição de ensino. Você será o administrador desta instituição
        e poderá criar turmas, configurar salas com perímetro georreferenciado e convidar outros docentes.
      </p>

      <NovaTenantForm />
    </SecondaryPage>
  );
}
