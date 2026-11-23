import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/global/sidebar";
import { AssistantLauncher } from "@/modules/assistant";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-paper">
      <DashboardSidebar />
      <main className="flex flex-1 flex-col overflow-y-auto">{children}</main>
      <AssistantLauncher />
    </div>
  );
}
