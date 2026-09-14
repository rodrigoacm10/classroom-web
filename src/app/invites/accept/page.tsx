import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aceitar convite",
};

type AcceptInvitePageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function AcceptInvitePage({
  searchParams,
}: AcceptInvitePageProps) {
  const { token } = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <Link href="/" className="text-sm font-semibold tracking-wide">
        Classroom
      </Link>
      <h1 className="mt-8 text-3xl font-semibold tracking-tight">
        Aceitar convite
      </h1>
      <p className="mt-3 leading-7 text-muted">
        A API já envia o convite para esta rota. A tela de aceite entra na
        próxima etapa.
      </p>
      <p className="mt-6 rounded-xl border border-line bg-surface px-4 py-3 font-mono text-sm break-all">
        {token ?? "nenhum token na URL"}
      </p>
    </main>
  );
}
