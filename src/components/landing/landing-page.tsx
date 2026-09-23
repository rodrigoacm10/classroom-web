import Link from "next/link";
import { buttonClass, textLinkClass } from "@/components/ui/interactive";
import { Header } from "./header";
import { HeroMap } from "./hero-map";
import { Logo } from "@/components/ui/logo";
import { PageWidth } from "@/components/ui/page-width";

/**
 * One ramp for every mid-page section heading. The hero h1 and the closing ask sit
 * one step above it at each breakpoint, which is what gives the page a crescendo
 * instead of eight headings shouting at the same volume.
 */
const sectionHeading = "text-section-sm/section-sm font-black tracking-tight sm:text-section-md/section-md xl:text-section/section";

/**
 * Every number here is a real threshold the system enforces, not traction copy:
 * RISK_THRESHOLD, confirmations_near_limit, confirmed_near_expiry, and the four
 * irregularity flags computed on each confirmation.
 */
const stats = [
  { value: "75%", label: "de frequência mínima antes de o aluno virar risco no relatório" },
  { value: "90%", label: "do raio: quem confirma sempre na borda entra na conta" },
  { value: "30 s", label: "antes de expirar, a confirmação já sai marcada" },
  { value: "4", label: "sinais de irregularidade conferidos em cada confirmação" },
];

const steps = [
  {
    n: "01",
    title: "Você monta a sala",
    body: "Turma, sala, raio, matrícula. A chamada herda esse chão — não se improvisa na hora.",
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden>
        <path
          d="M8 24L28 10L48 24V46C48 47.1 47.1 48 46 48H10C8.9 48 8 47.1 8 46V24Z"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="3"
        />
        <path
          d="M22 48V32H34V48"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="3"
        />
        <circle cx="28" cy="22" r="3" fill="var(--color-ink)" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "O aluno valida. Você conduz.",
    body: "Código do dia e posição na sala. O que sair do padrão não some: aparece para você decidir.",
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden>
        <rect
          x="18"
          y="6"
          width="20"
          height="44"
          rx="4"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="3"
        />
        <path
          d="M24 26L27.5 30L34 22"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="3"
        />
        <circle cx="28" cy="42" r="2" fill="var(--color-ink)" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "A frequência já é decisão",
    body: "Quem veio, quem falta, quem está em risco. A coordenação lê o período sem operar a chamada.",
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden>
        <path
          d="M16 8H34L42 16V46C42 47.1 41.1 48 40 48H16C14.9 48 14 47.1 14 46V10C14 8.9 14.9 8 16 8Z"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="3"
        />
        <path
          d="M34 8V16H42"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="3"
        />
        <rect x="20" y="26" width="18" height="3" fill="var(--color-ink)" />
        <rect x="20" y="33" width="14" height="3" fill="var(--color-ink)" />
        <rect x="20" y="40" width="10" height="3" fill="var(--color-ink)" />
      </svg>
    ),
  },
];

const salaRows = [
  ["Grito", "Corta a aula e não prova quem respondeu."],
  ["Celular", "Cada aluno confirma o próprio nome, em silêncio."],
  ["Ao vivo", "Irregular aparece na hora. A aula não para."],
];

const frequenciaRows = [
  ["Turma", "Quem veio, quem falta, quem está em risco."],
  ["Toque", "Relatório no fim da aula, não no domingo."],
  ["Leitura", "Coordenação vê o período sem operar a chamada."],
];

const roles = [
  ["Professor", "Conduz a sala no dia: turmas, chamada, o que revisar, relatório da turma."],
  ["Aluno", "Confirma em segundos, no próprio celular. Só o histórico dele."],
  ["Coordenador", "Frequência por turma e período, sem operar a chamada."],
  ["Admin", "Instituição, pessoas, salas e permissões. O chão de fábrica da aula."],
];

/** The four irregularity flags computed in `confirm_attendance`, verbatim in behaviour. */
const fraudRows = [
  [
    "Aparelho dividido",
    "Se o mesmo celular confirma por dois alunos na mesma chamada, os dois registros saem marcados.",
  ],
  [
    "GPS frouxo",
    "Precisão pior que o raio da sala não passa como presença limpa. Vai para revisão.",
  ],
  [
    "Fora do app",
    "Confirmação que não veio do app do aluno fica sinalizada no registro.",
  ],
  [
    "No fim do tempo",
    "Quem confirma nos últimos 30 segundos da chamada entra marcado.",
  ],
];

const dataRows = [
  [
    "Uma leitura",
    "Coordenada e precisão do GPS entram no instante em que o aluno confirma. Fora de uma chamada aberta, o Locus não pede localização nenhuma.",
  ],
  [
    "No registro",
    "Cada confirmação guarda a distância até a sala e o dispositivo usado. É esse registro que sustenta a frequência quando ela é contestada.",
  ],
  [
    "Com revisão",
    "Fora do raio não vira falta automática. Vai para o professor aprovar ou rejeitar, com a justificativa anexada ao registro.",
  ],
];

export function LandingPage() {
  return (
    <div className="landing-stage">
      <div className="landing-foreground flex min-h-full w-full min-w-0 flex-col">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2.5 focus:text-label/caption focus:font-semibold focus:text-on-ink"
        >
          Ir para o conteúdo
        </a>

        <Header />

        <main id="conteudo" className="flex-1">
        <section className="relative flex flex-col">
          <PageWidth className="flex min-w-0 flex-col gap-10 pt-12 pb-16 xl:flex-row xl:gap-14 xl:pt-[72px] xl:pb-24">
            <div className="flex min-w-0 flex-1 flex-col gap-7">
              <p className="font-semibold tracking-caps text-caption/caption text-muted uppercase">
                Gestão de presença para a sala de aula
              </p>
              <h1 className="max-w-[16ch] text-section-md/section-md font-black tracking-tight text-ink sm:max-w-none sm:text-section/section xl:text-display-lg/display-lg">
                A presença da turma, no seu controle.
              </h1>
              <p className="max-w-[480px] text-heading leading-7 text-muted">
                Cadastre salas e turmas, abra a chamada e valide presença do
                jeito que a aula pede — código, localização, revisão. Você conduz
                o que conta. A frequência sai pronta.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/register" className={buttonClass({ variant: "accent" })}>
                  Começar pela minha turma
                </Link>
                <a href="#sala" className={buttonClass({ variant: "outline" })}>
                  Ver a sala em operação
                </a>
              </div>
              <p className="font-mono text-caption/caption text-muted">
                Sem catraca · professor no navegador · aluno no celular
              </p>
            </div>
            <HeroMap />
          </PageWidth>

          <div className="bg-ink">
            <PageWidth className="py-10 xl:py-[52px]">
              <dl className="grid grid-cols-1 gap-x-7 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.value}
                    className="flex flex-col gap-1.5 border-t border-on-ink-border pt-4"
                  >
                    <dt className="font-mono text-[40px] leading-10 font-bold text-accent tabular-nums">
                      {stat.value}
                    </dt>
                    <dd className="text-label leading-[18px] text-on-ink-muted">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </PageWidth>
          </div>
        </section>

        <section id="como-funciona" className="scroll-mt-8">
          <PageWidth className="flex flex-col gap-14 pt-[88px] pb-24">
            <div className="flex max-w-[760px] flex-col gap-3">
              <p className="font-semibold tracking-caps text-caption/caption text-muted uppercase">
                Como a sala opera
              </p>
              <h2 className={`${sectionHeading} text-ink`}>
                Da turma ao relatório. Sem papel no meio.
              </h2>
            </div>
            <div className="flex gap-9">
              <div className="hidden w-1 shrink-0 self-stretch bg-accent md:block" />
              <ol className="flex min-w-0 flex-1 flex-col">
                {steps.map((step, i) => (
                  <li key={step.n}>
                    {i > 0 ? <div className="h-px bg-border" /> : null}
                    <div className="flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:gap-6">
                      <span className="w-[88px] shrink-0 font-mono text-code font-black tracking-tight text-ink max-sm:text-[40px] max-sm:leading-[46px]">
                        {step.n}
                      </span>
                      <span className="flex size-[88px] shrink-0 items-center justify-center rounded-sm bg-accent">
                        {step.icon}
                      </span>
                      <div className="flex flex-col gap-2">
                        <h3 className="font-bold tracking-tight text-title/title text-ink">
                          {step.title}
                        </h3>
                        <p className="text-base leading-body text-muted">{step.body}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </PageWidth>
        </section>

        <section className="relative">
          <div
            className="pointer-events-none absolute inset-0 hidden lg:flex"
            aria-hidden
          >
            <div className="w-1/2 bg-accent" />
            <div className="w-1/2 bg-ink" />
          </div>
          <div className="relative mx-auto grid w-full max-w-[1440px] lg:grid-cols-2">
            <div
              id="sala"
              className="flex scroll-mt-8 flex-col items-center justify-center gap-9 bg-accent px-6 py-[72px] md:px-8 lg:bg-transparent"
            >
              <div className="flex w-full max-w-[560px] flex-col items-center gap-4 text-center">
                <p className="font-semibold tracking-caps text-caption/caption text-ink uppercase">
                  A sala
                </p>
                <h2 className={`${sectionHeading} text-ink`}>
                  O silêncio onde havia chamada oral.
                </h2>
              </div>
              <div className="flex w-full max-w-[560px] flex-col gap-2">
                {salaRows.map(([label, text]) => (
                  <div key={label} className="flex">
                    <div className="flex w-[140px] shrink-0 items-center bg-ink px-[18px] py-4">
                      <p className="text-sm leading-[18px] font-bold text-accent">{label}</p>
                    </div>
                    <div className="flex flex-1 items-center bg-paper px-5 py-4">
                      <p className="text-sm leading-5 text-ink">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              id="frequencia"
              className="flex scroll-mt-8 flex-col items-center justify-center gap-9 bg-ink px-6 py-[72px] md:px-8 lg:bg-transparent"
            >
              <div className="flex w-full max-w-[560px] flex-col items-center gap-4 text-center">
                <p className="font-semibold tracking-caps text-caption/caption text-accent uppercase">
                  A frequência
                </p>
                <h2 className={`${sectionHeading} text-paper`}>
                  O relatório na palma da mão.
                </h2>
              </div>
              <div className="flex w-full max-w-[560px] flex-col gap-2">
                {frequenciaRows.map(([label, text]) => (
                  <div key={label} className="flex">
                    <div className="flex w-[140px] shrink-0 items-center bg-accent px-[18px] py-4">
                      <p className="text-sm leading-[18px] font-bold text-ink">{label}</p>
                    </div>
                    <div className="flex flex-1 items-center bg-ink px-5 py-4">
                      <p className="text-sm leading-5 text-paper">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <PageWidth className="flex flex-col items-start gap-8 py-8 xl:flex-row">
            <div className="flex w-full shrink-0 flex-col gap-4 xl:w-[360px]">
              <p className="font-semibold tracking-caps text-caption/caption text-muted uppercase">
                Quem usa
              </p>
              <h2 className={`${sectionHeading} text-ink`}>
                Cada um opera o que é seu.
              </h2>
              <p className="text-body/body text-muted">
                O aluno não vê colega nem código. Quem revisa fica com o registro.
              </p>
            </div>
            <div className="flex w-full flex-1 flex-col gap-2.5">
              {roles.map(([role, text]) => (
                <div key={role} className="flex min-h-[76px] flex-col gap-2 sm:flex-row">
                  <div className="flex w-full shrink-0 items-center justify-center rounded-sm bg-accent px-3 py-[18px] sm:w-[168px]">
                    <p className="font-bold text-heading/body text-ink">{role}</p>
                  </div>
                  <div className="flex flex-1 items-center rounded-sm bg-ink px-5 py-[18px]">
                    <p className="text-body/body text-on-ink">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </PageWidth>
        </section>

        <section id="antifraude" className="scroll-mt-8 bg-ink">
          <PageWidth className="flex flex-col gap-10 py-16 xl:py-20">
            <div className="flex flex-col gap-4 xl:max-w-[720px]">
              <p className="font-semibold tracking-caps text-caption/caption text-on-ink-muted uppercase">
                O que não passa
              </p>
              <h2 className={`${sectionHeading} text-on-ink`}>
                Chamada no celular sem antifraude é chamada no grito com mais passos.
              </h2>
              <p className="text-body/body text-on-ink-muted">
                Cada confirmação é conferida contra quatro sinais antes de virar
                presença limpa. Nada disso reprova ninguém sozinho — tudo cai na mesa
                do professor, com o motivo escrito.
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-on-ink-border sm:grid-cols-2">
              {fraudRows.map(([label, text]) => (
                <li key={label} className="flex flex-col gap-2 bg-ink px-6 py-6">
                  <p className="font-bold tracking-caps text-caption/caption text-accent uppercase">
                    {label}
                  </p>
                  <p className="text-body/body text-on-ink-muted">{text}</p>
                </li>
              ))}
            </ul>

            <p className="text-body/body text-on-ink xl:max-w-[720px]">
              E o relatório conta quantas vezes o aluno confirmou a 90% do raio, na
              beirada exata do permitido. Um dia é coincidência. Todo dia é padrão — e
              agora está escrito.
            </p>
          </PageWidth>
        </section>

        <section id="dados" className="scroll-mt-8 bg-surface">
          <PageWidth className="flex flex-col gap-9 py-16 xl:flex-row xl:gap-14 xl:py-20">
            <div className="flex w-full flex-col items-start gap-4 xl:w-[400px] xl:shrink-0">
              <p className="font-semibold tracking-caps text-caption/caption text-muted uppercase">
                Dados e privacidade
              </p>
              <h2 className={`${sectionHeading} text-ink`}>
                Presença se prova com registro. Não com vigilância.
              </h2>
              <p className="text-body/body text-muted">
                A localização entra uma vez, quando o aluno confirma, e fica no registro
                daquela aula. Não existe mapa ao vivo do aluno nem histórico de onde ele
                andou entre as aulas.
              </p>
              <Link
                href="/privacidade"
                className={buttonClass({ variant: "outline", size: "md", className: "mt-1" })}
              >
                Ler a política de privacidade
              </Link>
            </div>
            <ul className="flex min-w-0 flex-1 flex-col gap-px overflow-hidden rounded-sm bg-border">
              {dataRows.map(([label, text]) => (
                <li
                  key={label}
                  className="flex flex-col gap-1.5 bg-paper px-6 py-5 sm:flex-row sm:gap-6"
                >
                  <p className="w-[124px] shrink-0 font-bold tracking-caps text-caption/caption text-ink uppercase">
                    {label}
                  </p>
                  <p className="text-body/body text-muted">{text}</p>
                </li>
              ))}
            </ul>
          </PageWidth>
        </section>

        <section className="bg-accent">
          <PageWidth className="flex flex-col items-start justify-between gap-10 py-16 md:flex-row md:items-center xl:gap-14 xl:py-24">
            <div className="flex flex-col gap-3 xl:max-w-[760px]">
              <h2 className="text-section-md/section-md font-black tracking-tight text-ink sm:text-section/section xl:text-finale/finale">
                Papel e chamada no grito não são tradição. São atraso.
              </h2>
              <p className="text-body/body text-ink">
                Lista passada na carteira, nome no grito, frequência digitada no
                domingo: consome a aula e ainda entrega um registro frágil. Cadastre a
                instituição, uma sala, uma turma — a primeira chamada já sai com
                validação, revisão e relatório no mesmo fluxo.
              </p>
            </div>
            <Link
              href="/register"
              className={buttonClass({ variant: "ink", className: "shrink-0" })}
            >
              Começar agora
            </Link>
          </PageWidth>
        </section>
        </main>

        <footer className="bg-ink">
          <PageWidth className="flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
            <Logo inverted compact />
            <nav aria-label="Rodapé" className="flex flex-wrap items-center gap-x-7 gap-y-1">
              <a
                href="#como-funciona"
                className={textLinkClass({ onInk: true, className: "text-label/caption" })}
              >
                Como funciona
              </a>
              <Link
                href="/privacidade"
                className={textLinkClass({ onInk: true, className: "text-label/caption" })}
              >
                Privacidade
              </Link>
              <Link
                href="/termos"
                className={textLinkClass({ onInk: true, className: "text-label/caption" })}
              >
                Termos
              </Link>
              <a
                href="mailto:contato@locus.app"
                className={textLinkClass({ onInk: true, className: "text-label/caption" })}
              >
                Contato
              </a>
            </nav>
            <p className="font-mono text-caption/caption text-on-ink-subtle">© 2026 Locus</p>
          </PageWidth>
        </footer>
      </div>
    </div>
  );
}
