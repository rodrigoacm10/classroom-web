"use client";

import { useEffect, useState } from "react";

/**
 * `declined` and `missing` are both "no confirmation arrived" — they differ only
 * in cause, so they share the muted hue and are told apart by shape (dashed ring
 * vs. solid). Refusing the location prompt is a state the teacher resolves, not
 * an error to flag in red.
 */
type PinTone = "success" | "warn" | "missing" | "declined";

const pinTone: Record<PinTone, { pin: string; dot: string; border: string }> = {
  success: { pin: "bg-success", dot: "bg-success", border: "border-solid border-success" },
  warn: { pin: "bg-warn", dot: "bg-warn", border: "border-solid border-warn" },
  missing: { pin: "bg-muted", dot: "bg-muted", border: "border-solid border-muted" },
  declined: {
    pin: "bg-muted",
    dot: "border-2 border-muted bg-paper",
    border: "border-dashed border-muted",
  },
};

const SESSION_SECONDS = 8 * 60 + 47;
const SIGNED_START = 23;
const SIGNED_CAP = 31;
const ROSTER_TOTAL = 40;

/**
 * The session in the hero actually runs: the clock counts down while the signed
 * counter climbs. Those two numbers moving against each other *is* the tension of
 * an open roll call, which a frozen screenshot cannot show. Both hold still for
 * anyone who asked for reduced motion.
 */
function useLiveSession() {
  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS);
  const [signed, setSigned] = useState(SIGNED_START);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const clock = setInterval(
      () => setSecondsLeft((value) => (value > 0 ? value - 1 : value)),
      1000,
    );
    const roll = setInterval(
      () => setSigned((value) => (value < SIGNED_CAP ? value + 1 : value)),
      2600,
    );

    return () => {
      clearInterval(clock);
      clearInterval(roll);
    };
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return {
    clock: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    signed,
  };
}

function MapPin({
  src,
  tone,
  delay,
  className,
}: {
  src: string;
  tone: PinTone;
  /** Milliseconds after the radius is measured, so the class lands in order. */
  delay: number;
  className: string;
}) {
  const classes = pinTone[tone];

  return (
    <div
      className={`locus-land absolute h-[52px] w-10 ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`absolute top-[26px] left-[14px] size-3 origin-top-left ${classes.pin}`}
        style={{ rotate: "45deg" }}
      />
      <div
        className={`absolute top-0 left-0 size-10 overflow-clip rounded-full border-[3px] ${classes.border}`}
      >
        {/* Decorative map faces from the Paper artboard */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={40} height={40} className="size-10 object-cover" />
      </div>
    </div>
  );
}

const roster = [
  { name: "Ana Beatriz", status: "Presente", distance: "8 m", tone: "success" as const },
  { name: "Mariana Costa", status: "Presente", distance: "11 m", tone: "success" as const },
  { name: "João Pedro", status: "Presente", distance: "14 m", tone: "success" as const },
  { name: "Carlos Lima", status: "Irregular", distance: "184 m", tone: "warn" as const },
  { name: "Rafael Santos", status: "Não bateu", distance: "—", tone: "missing" as const },
  { name: "Luísa Torres", status: "Recusou", distance: "—", tone: "declined" as const },
];

const statusColor: Record<PinTone, string> = {
  success: "text-success",
  warn: "text-warn",
  missing: "text-muted",
  declined: "text-muted",
};

export function HeroMap() {
  const { clock, signed } = useLiveSession();

  return (
    <div className="w-full min-w-0 max-w-[460px] shrink-0">
      <div className="flex w-full min-w-0 flex-col gap-4">
      <div className="relative aspect-[460/300] w-full min-w-0 overflow-hidden">
        <svg
          viewBox="0 0 460 300"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 h-full w-full max-w-full"
          aria-hidden
        >
          <circle
            cx="230"
            cy="168"
            r="64"
            fill="var(--color-accent-surface)"
            className="locus-measure"
          />
          <circle
            cx="230"
            cy="168"
            r="64"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="3"
            className="locus-measure"
          />
          <circle
            cx="230"
            cy="168"
            r="108"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
            className="locus-measure"
            style={{ animationDelay: "120ms" }}
          />
          <circle
            cx="230"
            cy="168"
            r="152"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="2"
            strokeDasharray="5 7"
            className="locus-measure"
            style={{ animationDelay: "220ms" }}
          />
          <line
            x1="230"
            y1="168"
            x2="338"
            y2="168"
            stroke="var(--color-accent)"
            strokeWidth="2"
          />
          <line
            x1="230"
            y1="168"
            x2="428"
            y2="32"
            stroke="var(--color-muted)"
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />
          <line
            x1="230"
            y1="168"
            x2="360"
            y2="22"
            stroke="var(--color-muted)"
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />
          <line
            x1="230"
            y1="168"
            x2="22"
            y2="262"
            stroke="var(--color-muted)"
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />
          <line
            x1="230"
            y1="168"
            x2="418"
            y2="242"
            stroke="var(--color-muted)"
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />
          <g transform="translate(198,92) rotate(-6)">
            <path
              d="M32 0C17 0 6 11 6 26C6 50 32 80 32 80C32 80 58 50 58 26C58 11 47 0 32 0Z"
              fill="var(--color-accent)"
            />
            <circle cx="32" cy="26" r="12" fill="var(--color-paper)" />
          </g>
        </svg>

        <span className="absolute top-[51.33%] left-[74.78%] font-mono text-[11px] leading-[14px] font-bold text-ink">
          30 m
        </span>

        <MapPin src="/landing/avatars/avatar-1.webp" tone="success" delay={480} className="top-[39.33%] left-[32.17%]" />
        <MapPin src="/landing/avatars/avatar-2.webp" tone="success" delay={660} className="top-[34%] left-[53.91%]" />
        <MapPin src="/landing/avatars/avatar-3.webp" tone="success" delay={600} className="top-[59.33%] left-[40.87%]" />
        <MapPin src="/landing/avatars/avatar-4.webp" tone="success" delay={720} className="top-[56%] left-[58.26%]" />
        <MapPin src="/landing/avatars/avatar-5.webp" tone="success" delay={540} className="top-[49.33%] left-[27.83%]" />
        <MapPin src="/landing/avatars/avatar-6.webp" tone="warn" delay={1120} className="top-0 left-[86.96%]" />
        <MapPin src="/landing/avatars/avatar-7.webp" tone="warn" delay={1060} className="top-[1.33%] left-[73.48%]" />
        <MapPin src="/landing/avatars/avatar-8.webp" tone="missing" delay={860} className="top-[76%] left-[0.87%]" />
        <MapPin src="/landing/avatars/avatar-9.webp" tone="declined" delay={980} className="top-[69.33%] left-[85.22%]" />

        <div className="absolute top-2.5 left-2 flex gap-1.5 sm:left-4 sm:gap-2">
          <div className="flex flex-col gap-0.5 rounded-sm bg-accent px-2.5 py-2 sm:px-3.5 sm:py-2.5">
            <span className="font-semibold tracking-caps text-caption/caption text-ink uppercase">
              Código do dia
            </span>
            <span className="font-mono text-[18px] leading-6 font-bold tracking-code text-ink sm:text-[22px] sm:leading-7">
              A7X-249
            </span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-sm bg-accent px-2.5 py-2 sm:px-3.5 sm:py-2.5">
            <span className="font-semibold tracking-caps text-caption/caption text-ink uppercase">
              Restam
            </span>
            <span className="font-mono text-[18px] leading-6 font-bold tracking-code text-ink tabular-nums sm:text-[22px] sm:leading-7">
              {clock}
            </span>
          </div>
          <div className="hidden flex-col gap-0.5 rounded-sm bg-ink px-3.5 py-2.5 sm:flex">
            <span className="font-semibold tracking-caps text-caption/caption text-accent uppercase">
              Assinaram
            </span>
            <span className="font-mono text-[22px] leading-7 font-bold tracking-code text-paper tabular-nums">
              {signed}/{ROSTER_TOTAL}
            </span>
          </div>
        </div>

        <svg
          viewBox="0 0 460 300"
          xmlns="http://www.w3.org/2000/svg"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden
        >
          <line
            x1="230"
            y1="168"
            x2="38"
            y2="96"
            stroke="var(--color-muted)"
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />
          <line
            x1="230"
            y1="168"
            x2="320"
            y2="272"
            stroke="var(--color-muted)"
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />
        </svg>

        <span className="absolute top-[36%] left-[46.96%] flex w-7 items-center justify-center text-[11px] leading-[14px] font-bold text-ink">
          204
        </span>

        <MapPin src="/landing/avatars/avatar-10.webp" tone="success" delay={780} className="top-[65.33%] left-[45.65%]" />
        <MapPin src="/landing/avatars/avatar-11.webp" tone="missing" delay={920} className="top-[66.67%] left-[0.43%]" />
        <MapPin src="/landing/avatars/avatar-12.webp" tone="warn" delay={1180} className="top-[82%] left-[65.22%]" />
      </div>

      <ul className="flex flex-wrap items-center gap-x-4 gap-y-3">
        {(
          [
            ["success", "Presente"],
            ["warn", "Irregular"],
            ["missing", "Não bateu"],
            ["declined", "Recusou"],
          ] as const
        ).map(([tone, label]) => (
          <li key={label} className="flex items-center gap-1.5">
            <span
              aria-hidden
              className={`size-2 shrink-0 rounded-full ${pinTone[tone].dot}`}
            />
            <span className="text-[11px] leading-[14px] text-muted">{label}</span>
          </li>
        ))}
      </ul>

      <div>
        <table className="w-full table-fixed border-collapse text-left">
          <caption className="sr-only">
            Exemplo de chamada em andamento: alunos da turma, status da confirmação e
            distância até a sala.
          </caption>
          <thead>
            <tr className="font-semibold tracking-caps text-caption/caption text-muted uppercase">
              <th scope="col" className="pb-2.5 font-semibold">
                Aluno
              </th>
              <th scope="col" className="w-[92px] pb-2.5 font-semibold">
                Status
              </th>
              <th scope="col" className="w-14 pb-2.5 font-semibold">
                Dist.
              </th>
            </tr>
          </thead>
          <tbody>
            {roster.map((row) => (
              <tr key={row.name}>
                <th
                  scope="row"
                  className="py-2 pr-3 text-label leading-[18px] font-normal text-ink"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden
                      className={`size-2 shrink-0 rounded-full ${pinTone[row.tone].dot}`}
                    />
                    <span className="min-w-0 truncate">{row.name}</span>
                  </span>
                </th>
                <td className={`py-2 text-caption/caption ${statusColor[row.tone]}`}>
                  {row.status}
                </td>
                <td
                  className={`py-2 font-mono text-label leading-[18px] ${
                    row.distance === "—" ? "text-muted" : "text-ink"
                  }`}
                >
                  {row.distance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p
          aria-hidden
          className="pt-1 pl-5 text-base leading-5 font-bold tracking-[0.12em] text-muted"
        >
          ...
        </p>
      </div>
      </div>
    </div>
  );
}
