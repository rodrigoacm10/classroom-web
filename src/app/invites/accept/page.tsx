import type { Metadata } from "next";
import Link from "next/link";
import { SecondaryPage } from "@/components/ui/secondary-page";
import { buttonClass } from "@/components/ui/interactive";

export const metadata: Metadata = {
  title: "Aceitar convite",
  description: "Aceite o convite da sua instituição para entrar no Locus.",
};

type AcceptInvitePageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function AcceptInvitePage({
  searchParams,
}: AcceptInvitePageProps) {
  const { token } = await searchParams;

  return (
    <SecondaryPage>
      <h1 className="text-[32px] leading-9 font-black tracking-tight text-ink sm:text-[40px] sm:leading-[46px]">
        Aceitar convite
      </h1>
      <p className="mt-3 text-body/body text-muted">
        A API já envia o convite para esta rota. A tela de aceite entra na próxima
        etapa.
      </p>

      {token ? (
        <div className="mt-7 flex flex-col gap-2">
          <p className="font-semibold tracking-caps text-caption/caption text-muted uppercase">
            Token recebido
          </p>
          <p className="rounded-sm border border-border bg-surface px-4 py-3 font-mono text-label leading-[18px] break-all text-ink">
            {token}
          </p>
        </div>
      ) : (
        <div className="mt-7 flex flex-col items-start gap-4 rounded-sm border border-border bg-surface px-6 py-6">
          <p className="text-body/body text-ink">
            Este link não trouxe um token de convite. Abra o link exatamente como
            ele chegou no seu e-mail — copiar só um pedaço da URL costuma perder o
            token.
          </p>
          <Link href="/login" className={buttonClass({ variant: "outline", size: "md" })}>
            Já tenho senha, quero entrar
          </Link>
        </div>
      )}
    </SecondaryPage>
  );
}
