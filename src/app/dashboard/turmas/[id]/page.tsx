import type { Metadata } from "next";
import { TurmaDetalhes } from "@/components/turmas/turma-detalhes";

export const metadata: Metadata = {
  title: "Detalhes da Turma — Locus",
  description: "Visão detalhada da turma acadêmica, alunos e frequência.",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TurmaDetailPage({ params }: Props) {
  const { id } = await params;
  return <TurmaDetalhes id={id} />;
}
