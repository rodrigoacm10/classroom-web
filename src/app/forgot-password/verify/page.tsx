import type { Metadata } from "next";
import Link from "next/link";
import { SecondaryPage } from "@/components/ui/secondary-page";
import { RecoverySteps } from "@/components/ui/flow-steps";
import { VerifyCodeForm } from "@/app/forgot-password/verify/verify-code-form";

export const metadata: Metadata = {
  title: "Código de verificação",
  description:
    "Digite o código de 6 dígitos recebido por e-mail para validar a recuperação de senha.",
};

type VerifyCodePageProps = {
  searchParams: Promise<{
    email?: string;
    code?: string;
  }>;
};

export default async function VerifyCodePage({
  searchParams,
}: VerifyCodePageProps) {
  const { email, code } = await searchParams;

  return (
    <SecondaryPage>
      <RecoverySteps current={2} />

      <div className="flex flex-col">
        <h1 className="text-[32px] leading-9 font-black tracking-tight text-ink sm:text-[40px] sm:leading-[46px]">
          Código de verificação
        </h1>
        {email ? (
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-body/body text-muted">
            <span>Enviamos o código de 6 dígitos para</span>
            <strong className="font-semibold text-ink">{email}</strong>
            <Link
              href={`/forgot-password?email=${encodeURIComponent(email)}`}
              className="text-label/caption font-medium text-ink underline underline-offset-4 hover:opacity-75"
            >
              (Alterar e-mail)
            </Link>
          </div>
        ) : (
          <p className="mt-3 text-body/body text-muted">
            Digite o código numérico de 6 dígitos enviado para seu e-mail.
          </p>
        )}

        <VerifyCodeForm
          initialEmail={email ?? ""}
          initialCode={code ?? ""}
        />
      </div>
    </SecondaryPage>
  );
}
