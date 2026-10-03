import type { Metadata } from "next";
import { TurmasPage } from "@/components/turmas/turmas-page";

export const metadata: Metadata = {
  title: "Turmas — Locus",
  description: "Gerenciamento de turmas, alunos matriculados e frequência acadêmica.",
};

export default function TurmasRoutePage() {
  return <TurmasPage />;
}
