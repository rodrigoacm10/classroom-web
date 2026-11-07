import type { Metadata } from "next";
import { ChamadaAoVivo } from "@/modules/chamadas";

export const metadata: Metadata = {
  title: "Chamada ao Vivo — Locus",
  description: "Acompanhe em tempo real as confirmações de presença dos alunos.",
};

interface PageProps {
  params: Promise<{
    subjectClassId: string;
    sessionId: string;
  }>;
}

export default async function ChamadaAoVivoPage({ params }: PageProps) {
  const { subjectClassId, sessionId } = await params;
  return <ChamadaAoVivo subjectClassId={subjectClassId} sessionId={sessionId} />;
}
