import type { Metadata } from "next";
import { SalasPage } from "@/modules/salas";

export const metadata: Metadata = {
  title: "Salas — Locus",
  description: "Gerencie os espaços físicos da instituição e seus raios de presença válida.",
};

export default function SalasRoutePage() {
  return <SalasPage />;
}
