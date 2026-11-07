import type { Metadata } from "next";
import { Suspense } from "react";
import { NovaChamada } from "@/modules/chamadas";

export const metadata: Metadata = {
  title: "Nova Chamada — Locus",
  description: "Configure e inicie uma nova chamada de presença para sua turma.",
};

export default function NovaChamadaPage() {
  return (
    <Suspense fallback={null}>
      <NovaChamada />
    </Suspense>
  );
}
