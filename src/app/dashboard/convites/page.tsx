import type { Metadata } from "next";
import { ConvitesPage } from "@/modules/convites";
import { RoleGuard } from "@/components/global/role-guard";

export const metadata: Metadata = {
  title: "Convites & Acessos — Locus",
  description: "Gestão institucional de convites, novos membros e onboarding no Locus.",
};

export default function ConvitesRoutePage() {
  return (
    <RoleGuard deniedRoles={["professor", "aluno"]}>
      <ConvitesPage />
    </RoleGuard>
  );
}
