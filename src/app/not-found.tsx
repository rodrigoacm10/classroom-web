import type { Metadata } from "next";
import Link from "next/link";
import { SecondaryPage } from "@/components/ui/secondary-page";
import { buttonClass, textLinkClass } from "@/components/ui/interactive";

export const metadata: Metadata = {
  title: "Página não encontrada",
};

const elsewhere = [
  { href: "/login", label: "Entrar no painel" },
  { href: "/register", label: "Começar no Locus" },
  { href: "/privacidade", label: "Privacidade" },
];

export default function NotFound() {
  return (
    <SecondaryPage>
      <p className="font-mono font-bold tracking-code text-code-sm/code-sm text-ink">404</p>
      <h1 className="mt-3 text-[32px] leading-9 font-black tracking-tight text-ink sm:text-[40px] sm:leading-[46px]">
        Essa página não existe.
      </h1>
      <p className="mt-3 text-body/body text-muted">
        O endereço pode ter mudado, ou o link chegou incompleto. Nada foi perdido —
        volte ao início e siga daqui.
      </p>

      <Link href="/" className={buttonClass({ variant: "accent", className: "mt-7 self-start" })}>
        Voltar ao início
      </Link>

      <nav aria-label="Outros destinos" className="mt-8 flex flex-col items-start gap-1">
        {elsewhere.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={textLinkClass({
              className: "text-label/caption underline underline-offset-4",
            })}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </SecondaryPage>
  );
}
