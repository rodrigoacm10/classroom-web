import type { Metadata } from "next";
import { NovaTurma } from "@/modules/turmas";

export const metadata: Metadata = {
  title: "Nova Turma — Locus",
  description: "Cadastre uma nova turma vinculando disciplina e sala física.",
};

export default function NovaTurmaRoutePage() {
  return <NovaTurma />;
}
