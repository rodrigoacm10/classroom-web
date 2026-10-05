import Link from "next/link";
import { greeting, formattedDate } from "@/lib/utils";

interface DashboardHeaderProps {
  userName: string | null;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-9 pb-5 pt-7">
      <div className="flex flex-col gap-1">
        <span className="font-semibold tracking-caps uppercase text-muted text-label/caption">
          {formattedDate()}
        </span>
        <h1 className="font-extrabold tracking-tight text-ink text-[32px] leading-9">
          {greeting()}{userName ? `, ${userName}.` : "."}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/relatorios"
          className="flex h-11 items-center rounded-md border border-border px-4 font-semibold text-ink text-[14px] leading-body transition-colors hover:bg-surface"
        >
          Ver relatórios
        </Link>
        <Link
          href="/dashboard/chamadas/nova"
          className="flex h-11 items-center gap-2 rounded-md bg-ink px-[18px] font-bold text-paper text-[14px] leading-body transition-opacity hover:opacity-80"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 3v10M3 8h10"
              stroke="var(--color-accent)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          Abrir chamada
        </Link>
      </div>
    </div>
  );
}
