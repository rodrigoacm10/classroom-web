import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SalaDetailPage({ params }: Props) {
  const { id } = await params;
  redirect(`/dashboard/salas/${id}/editar`);
}
