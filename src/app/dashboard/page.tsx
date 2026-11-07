import type { Metadata } from "next";
import { HomeProfessor } from "@/modules/dashboard";

export const metadata: Metadata = {
  title: "Início — Locus",
  description: "Visão geral das suas turmas, frequência e alunos em risco.",
};

export default function DashboardHomePage() {
  return <HomeProfessor />;
}
