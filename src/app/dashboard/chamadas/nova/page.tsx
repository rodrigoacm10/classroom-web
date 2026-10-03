import type { Metadata } from "next";
import { NovaChamada } from "@/components/chamadas/nova-chamada";

export const metadata: Metadata = {
  title: "Nova Chamada — Locus",
  description: "Configure e inicie uma nova chamada de presença para sua turma.",
};

export default function NovaChamadaPage() {
  return <NovaChamada />;
}
