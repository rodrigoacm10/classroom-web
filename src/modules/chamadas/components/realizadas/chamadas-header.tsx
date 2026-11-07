import Link from "next/link";
import { PageHeader, PageHeaderAddIcon } from "@/components/global";

export function ChamadasHeader() {
  return (
    <PageHeader
      title="Chamadas"
      bordered
      actions={
        <Link
          href="/dashboard/chamadas/nova"
          className="flex h-11 items-center gap-2 rounded-md bg-ink px-[18px] font-bold text-paper text-[14px] leading-body transition-opacity hover:opacity-80"
        >
          <PageHeaderAddIcon />
          <span>Abrir chamada</span>
        </Link>
      }
    />
  );
}
