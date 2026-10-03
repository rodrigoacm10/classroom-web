import type { Metadata } from "next";
import { EditarSala } from "@/components/salas/editar-sala";

export const metadata: Metadata = {
  title: "Editar Sala — Locus",
  description: "Atualize os dados e o raio de presença física do espaço.",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditarSalaRoute({ params }: Props) {
  const { id } = await params;
  return <EditarSala roomId={id} />;
}
