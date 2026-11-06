import type { Metadata } from "next";
import { EditarTurma } from "@/modules/turmas";

export const metadata: Metadata = {
  title: "Editar Turma — Locus",
  description: "Atualização de identificação, sala física e status operacional da turma.",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditarTurmaPage({ params }: Props) {
  const { id } = await params;
  return <EditarTurma id={id} />;
}
