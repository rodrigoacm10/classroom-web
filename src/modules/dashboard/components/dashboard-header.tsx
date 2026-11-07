import Link from "next/link";
import { greeting } from "@/lib/utils";
import { PageHeader, PageHeaderAddIcon } from "@/components/global";

export interface DashboardHeaderProps {
  userName: string | null;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <PageHeader
      title={`${greeting()}${userName ? `, ${userName}.` : "."}`}
      actions={
        <>
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
            <PageHeaderAddIcon />
            <span>Abrir chamada</span>
          </Link>
        </>
      }
    />
  );
}
