import type { Metadata } from "next";
import { MembrosPage } from "@/modules/membros";

export const metadata: Metadata = {
  title: "Membros da Instituição — Locus",
  description: "Gestão do corpo docente, coordenação e administradores do tenant ativo.",
};

export default function MembrosRoutePage() {
  return <MembrosPage />;
}
