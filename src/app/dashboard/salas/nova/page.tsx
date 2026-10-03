import type { Metadata } from "next";
import { NovaSala } from "@/components/salas/nova-sala";

export const metadata: Metadata = {
  title: "Nova Sala — Locus",
  description: "Cadastre um novo espaço físico com geolocalização e raio de presença válido.",
};

export default function NovaSalaPage() {
  return <NovaSala />;
}
