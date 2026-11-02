import type { Metadata } from "next";
import { AlunosPage } from "@/modules/alunos";

export const metadata: Metadata = {
  title: "Alunos — Locus",
  description: "Gestão de alunos, turmas vinculadas e frequência acadêmica no Locus Classroom.",
};

export default function AlunosRoutePage() {
  return <AlunosPage />;
}
