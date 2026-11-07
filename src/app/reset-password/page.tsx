import type { Metadata } from "next";
import { SecondaryPage } from "@/components/ui/secondary-page";
import { RecoverySteps } from "@/components/ui/flow-steps";
import { ResetPasswordForm } from "@/app/reset-password/reset-password-form";

export const metadata: Metadata = {
  title: "Criar nova senha",
  description:
    "Defina uma nova senha para sua conta institucional no Locus.",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{
    reset_token?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { reset_token } = await searchParams;

  return (
    <SecondaryPage>
      <RecoverySteps current={3} />

      <div className="flex flex-col">
        <h1 className="text-[32px] leading-9 font-black tracking-tight text-ink sm:text-[40px] sm:leading-[46px]">
          Criar nova senha
        </h1>
        <p className="mt-3 text-body/body text-muted">
          Defina sua nova credencial de acesso institucional.
        </p>

        <ResetPasswordForm resetToken={reset_token ?? ""} />
      </div>
    </SecondaryPage>
  );
}
