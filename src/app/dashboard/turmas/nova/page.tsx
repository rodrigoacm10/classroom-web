import type { Metadata } from "next";
import { NovaTurma } from "@/components/turmas/nova-turma";

export const metadata: Metadata = {
  title: "Nova Turma — Locus",
  description: "Cadastre uma nova turma vinculando disciplina e sala física.",
};

export default function NovaTurmaRoutePage() {
  return <NovaTurma />;
}
