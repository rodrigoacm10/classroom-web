import type { Metadata } from "next";
import { ConvitesPage } from "@/modules/convites";

export const metadata: Metadata = {
  title: "Convites & Acessos — Locus",
  description: "Gestão institucional de convites, novos membros e onboarding no Locus Classroom.",
};

export default function ConvitesRoutePage() {
  return <ConvitesPage />;
}
