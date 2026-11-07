import type { Metadata } from "next";
import { SecondaryPage } from "@/components/ui/secondary-page";
import { RecoverySteps } from "@/components/ui/flow-steps";
import { ForgotPasswordForm } from "@/app/forgot-password/forgot-password-form";

export const metadata: Metadata = {
  title: "Recuperar senha",
  description:
    "Recupere o acesso à sua conta institucional no Locus com código de verificação.",
};

type ForgotPasswordPageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const { email } = await searchParams;

  return (
    <SecondaryPage>
      <RecoverySteps current={1} />

      <h1 className="text-[32px] leading-9 font-black tracking-tight text-ink sm:text-[40px] sm:leading-[46px]">
        Recuperar senha
      </h1>
      <p className="mt-3 text-body/body text-muted">
        Informe o e-mail cadastrado na sua instituição. Enviaremos um código de 6
        dígitos para você criar sua nova senha.
      </p>

      <ForgotPasswordForm initialEmail={email ?? ""} />
    </SecondaryPage>
  );
}
