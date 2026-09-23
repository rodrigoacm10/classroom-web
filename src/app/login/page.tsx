import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/app/login/login-form";
import { SecondaryPage } from "@/components/ui/secondary-page";
import { textLinkClass } from "@/components/ui/interactive";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse o painel do Locus com a conta da sua instituição.",
};

export default function LoginPage() {
  return (
    <SecondaryPage >
      <h1 className="text-[32px] leading-9 font-black tracking-tight text-ink sm:text-[40px] sm:leading-[46px]">
        Entrar
      </h1>
      <p className="mt-3 text-body/body text-muted">
        Use a conta da instituição. A sessão fica neste navegador.
      </p>

      <LoginForm />

      <p className="mt-8 text-label/caption text-muted">
        Recebeu um convite e ainda não tem senha?{" "}
        <Link href="/register" className={textLinkClass({ className: "font-semibold underline underline-offset-4" })}>
          Veja como começar
        </Link>
      </p>
    </SecondaryPage>
  );
}
