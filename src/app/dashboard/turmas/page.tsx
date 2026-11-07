import type { Metadata } from "next";
import { TurmasPage } from "@/modules/turmas";

export const metadata: Metadata = {
  title: "Turmas — Locus",
  description: "Gerenciamento de turmas, alunos matriculados e frequência acadêmica.",
};

export default function TurmasRoutePage() {
  return <TurmasPage />;
}
