import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { PageWidth } from "@/components/ui/page-width";
import { textLinkClass } from "@/components/ui/interactive";

const footerLinks = [
  { href: "/privacidade", label: "Privacidade" },
  { href: "/termos", label: "Termos" },
];

/**
 * Frame for every page that is not the landing: auth, legal, invite, 404.
 * Keeps the header rule, footer and measure identical across them so the
 * landing's CTAs never land somewhere that looks like a different product.
 */
export function SecondaryPage({
  children,
  measure = "form",
}: {
  children: ReactNode;
  /** `form` for short flows, `prose` for long reading at a comfortable measure. */
  measure?: "form" | "prose";
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-paper">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2.5 focus:text-label/caption focus:font-semibold focus:text-on-ink"
      >
        Ir para o conteúdo
      </a>

      <header className="border-b border-border">
        <PageWidth className="py-3 xl:flex xl:h-20 xl:items-center xl:py-0">
          <Logo />
        </PageWidth>
      </header>

      <main id="conteudo" className="flex flex-1 flex-col">
        <PageWidth
          className={
            measure === "prose"
              ? "flex flex-1 flex-col py-14 xl:py-20"
              : "flex flex-1 flex-col items-center justify-center py-14 xl:py-20"
          }
        >
          <div
            // max-w-[460px]
            className={
              measure === "prose"
                ? "flex w-full max-w-[68ch] flex-col"
                : "flex w-full max-w-[68ch] flex-col"
            }
          >
            {children}
          </div>
        </PageWidth>
      </main>

      <footer className="border-t border-border">
        <PageWidth className="flex flex-wrap items-center justify-between gap-x-7 gap-y-1 py-6">
          <p className="font-mono text-caption/caption text-muted">© 2026 Locus</p>
          <nav aria-label="Rodapé" className="flex flex-wrap items-center gap-x-7 gap-y-1">
            {footerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={textLinkClass({ className: "text-label/caption" })}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="mailto:contato@locus.app"
              className={textLinkClass({ className: "text-label/caption" })}
            >
              Contato
            </a>
          </nav>
        </PageWidth>
      </footer>
    </div>
  );
}
