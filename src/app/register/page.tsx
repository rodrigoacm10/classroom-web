import type { Metadata } from "next";
import { RegisterForm } from "@/app/register/register-form";
import { SecondaryPage } from "@/components/ui/secondary-page";
import { buttonClass } from "@/components/ui/interactive";

export const metadata: Metadata = {
  title: "Criar conta",
  description:
    "Crie sua conta no Locus para gerenciar turmas, salas e presença por geofencing.",
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

type RegisterPageProps = {
  searchParams: Promise<{
    token?: string;
    invite?: string;
    email?: string;
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const initialToken = params.token || params.invite || "";
  const initialEmail = params.email || "";

  return (
    <SecondaryPage>
      <h1 className="text-[32px] leading-9 font-black tracking-tight text-ink sm:text-[40px] sm:leading-[46px]">
        Criar sua conta
      </h1>
      <p className="mt-3 text-body/body text-muted">
        Cadastre seus dados de acesso ao Locus. Se você já recebeu um convite da sua
        instituição, poderá vinculá-lo agora ou após o cadastro.
      </p>

      <RegisterForm initialToken={initialToken} initialEmail={initialEmail} />

      {/* Institutional section */}
      <div className="mt-12 rounded-sm border border-border bg-surface p-6 sm:p-7">
        <h2 className="font-bold tracking-tight text-heading/heading text-ink">
          Quer implantar o Locus na sua instituição?
        </h2>
        <p className="mt-2 text-body/body text-muted">
          A instituição, os perímetros geográficos das salas e as primeiras turmas
          são configurados com o suporte da nossa equipe. Conte quantas turmas você tem
          e nós preparamos tudo.
        </p>
        <div className="mt-5">
          <a
            href={requestAccess}
            className={buttonClass({
              variant: "outline",
              size: "md",
              className: "w-full sm:w-auto",
            })}
          >
            Solicitar acesso institucional
          </a>
        </div>
      </div>

      <p className="mt-8 text-label leading-[18px] text-muted">
        O professor e a coordenação usam o Locus no navegador. O aluno confirma presença
        pelo aplicativo no próprio smartphone.
      </p>
    </SecondaryPage>
  );
}
