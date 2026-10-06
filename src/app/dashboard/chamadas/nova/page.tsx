import type { Metadata } from "next";
import { NovaChamada } from "@/modules/chamadas";

export const metadata: Metadata = {
  title: "Nova Chamada — Locus",
  description: "Configure e inicie uma nova chamada de presença para sua turma.",
};

export default function NovaChamadaPage() {
  return <NovaChamada />;
}
