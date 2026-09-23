import Link from "next/link";
import { buttonClass, textLinkClass } from "@/components/ui/interactive";
import { Logo } from "@/components/ui/logo";
import { PageWidth } from "@/components/ui/page-width";

/** The three questions a visitor actually arrives with, in the order they ask them. */
const nav = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#antifraude", label: "Antifraude" },
  { href: "#dados", label: "Dados" },
];

export function Header() {
  return (
    <header className="relative w-full min-w-0 shrink-0 border-b border-border">
      <PageWidth className="py-3 xl:flex xl:h-20 xl:items-center xl:py-0">
        <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 xl:h-full xl:flex-nowrap xl:justify-between">
          <Logo />

          <div className="order-2 ml-auto flex w-full gap-2 sm:w-auto sm:gap-3 xl:order-3 xl:ml-0">
            <Link
              href="/login"
              className={buttonClass({
                variant: "outline",
                size: "md",
                className: "flex-1 sm:flex-none sm:px-[18px]",
              })}
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className={buttonClass({
                variant: "ink",
                size: "md",
                className: "flex-1 sm:flex-none sm:px-[18px]",
              })}
            >
              Criar conta
            </Link>
          </div>

          <nav
            aria-label="Seções"
            className="order-3 flex w-full flex-wrap items-center justify-center gap-x-5 xl:order-2 xl:w-auto xl:flex-nowrap xl:gap-x-6"
          >
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={textLinkClass({ className: "font-medium text-label/caption" })}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </PageWidth>
    </header>
  );
}
