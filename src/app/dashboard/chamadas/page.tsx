import type { Metadata } from "next";
import { ChamadasRealizadas } from "@/modules/chamadas";

export const metadata: Metadata = {
  title: "Chamadas Realizadas — Locus",
  description: "Histórico consolidado e métricas das sessões de presença das turmas.",
};

export default function ChamadasRoutePage() {
  return <ChamadasRealizadas />;
}
