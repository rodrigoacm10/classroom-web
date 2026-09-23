import type { Metadata } from "next";
import Link from "next/link";
import { SecondaryPage } from "@/components/ui/secondary-page";
import { buttonClass } from "@/components/ui/interactive";

export const metadata: Metadata = {
  title: "Começar no Locus",
  description:
    "O Locus entra por instituição. Veja como aceitar um convite ou trazer sua escola.",
};

const requestAccess = `mailto:contato@locus.app?subject=${encodeURIComponent(
  "Quero levar o Locus para minha instituição",
)}&body=${encodeURIComponent(
  [
    "Instituição:",
    "Cidade / estado:",
    "Quantas turmas por período:",
    "Quem vai conduzir a chamada:",
    "Telefone ou WhatsApp:",
    "",
  ].join("\n"),
)}`;

export default function RegisterPage() {
  return (
    <SecondaryPage  >
      <h1 className="text-[32px] leading-9 font-black tracking-tight text-ink sm:text-[40px] sm:leading-[46px]">
        Começar pela sua turma
      </h1>
      <p className="mt-3 text-body/body text-muted">
        O Locus entra por instituição, não por cadastro solto — é o que mantém a
        turma, a sala e a frequência no mesmo lugar. Duas portas, dependendo de onde
        você está.
      </p>

      <div className="mt-9 flex flex-col gap-px overflow-hidden rounded-sm bg-border">
        <section className="flex flex-col items-start gap-4 bg-surface px-6 py-7">
          <h2 className="font-bold tracking-tight text-title/title text-ink">
            Já recebi um convite
          </h2>
          <p className="text-body/body text-muted">
            Sua instituição já está no Locus e alguém da coordenação te incluiu. O
            convite chega por e-mail com um link — é ele que cria sua senha. Se você
            já definiu a senha, entre direto.
          </p>
          <Link href="/login" className={buttonClass({ variant: "ink" })}>
            Entrar
          </Link>
        </section>

        <section className="flex flex-col items-start gap-4 bg-surface px-6 py-7">
          <h2 className="font-bold tracking-tight text-title/title text-ink">
            Minha instituição ainda não usa
          </h2>
          <p className="text-body/body text-muted">
            A instituição, as salas com raio e a primeira turma são configuradas com
            você — não é um formulário que você preenche sozinho às onze da noite.
            Conte quantas turmas e quem conduz a chamada, e a gente monta o chão.
          </p>
          <a href={requestAccess} className={buttonClass({ variant: "accent" })}>
            Solicitar acesso
          </a>
        </section>
      </div>

      <p className="mt-8 text-label leading-[18px] text-muted">
        O professor usa o Locus no navegador. O aluno confirma presença pelo app no
        próprio celular.
      </p>
    </SecondaryPage>
  );
}
