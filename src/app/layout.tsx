import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Archivo is a variable font — no weight array needed (Turbopack "one entry" constraint).
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

// IBM Plex Mono is not variable; Turbopack requires a single weight per call.
// We load 400 and 700 as separate instances sharing the same CSS variable.
const ibmPlexMono400 = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: "400",
});

const ibmPlexMono700 = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: "700",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://locus.app";

const title = "Locus — A presença da turma, no seu controle";
const description =
  "Cadastre salas e turmas, abra a chamada e valide presença do jeito que a aula pede — código, localização, revisão.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    type: "website",
    siteName: "Locus",
    locale: "pt_BR",
    url: "/",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${ibmPlexMono400.variable} ${ibmPlexMono700.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper font-sans text-ink">{children}</body>
    </html>
  );
}
