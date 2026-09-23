import Link from "next/link";

type LogoProps = {
  inverted?: boolean;
  compact?: boolean;
};

export function Logo({ inverted = false, compact = false }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Locus — página inicial"
      className={`flex min-h-11 items-center gap-2.5 rounded-sm transition-opacity duration-150 ease-out hover:opacity-80 xl:min-h-0 ${
        inverted ? "focus-visible:outline-accent" : ""
      }`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-sm bg-accent ${
          compact ? "size-5" : "size-7"
        }`}
      >
        <span
          className={`shrink-0 rounded-full bg-ink ${compact ? "size-2" : "size-2.5"}`}
        />
      </span>
      <span
        className={`inline-block font-black tracking-tight ${
          inverted ? "text-on-ink" : "text-ink"
        } ${compact ? "text-body leading-[18px]" : "text-[20px] leading-6"}`}
      >
        Locus
      </span>
    </Link>
  );
}
