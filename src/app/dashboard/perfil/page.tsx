import type { Metadata } from "next";
import { PerfilPage } from "@/modules/perfil";

export const metadata: Metadata = {
  title: "Meu Perfil · Locus Classroom",
  description: "Gerenciamento de conta, segurança e instituições vinculadas.",
};

export default function Page() {
  return <PerfilPage />;
}

