import type { Metadata } from "next";
import { AlunoDetalhesPage } from "@/modules/alunos";

export const metadata: Metadata = {
  title: "Ficha do Aluno — Locus",
  description: "Histórico acadêmico, turmas matriculadas e controle de chamadas do aluno no Locus Classroom.",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AlunoDetailPage({ params }: Props) {
  const { id } = await params;
  return <AlunoDetalhesPage id={id} />;
}
