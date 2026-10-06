import type { AttendanceTab } from "../../types";

export interface ChamadasTabsProps {
  activeTab: AttendanceTab;
  onTabChange: (tab: AttendanceTab) => void;
  hasActiveSession?: boolean;
}

export function ChamadasTabs({
  activeTab,
  onTabChange,
  hasActiveSession = false,
}: ChamadasTabsProps) {
  return (
    <div className="flex items-center border-b border-border bg-white px-10">
      <button
        type="button"
        onClick={() => onTabChange("realizadas")}
        className={`mr-5 cursor-pointer px-1 py-[14px] text-[14px] transition-colors ${
          activeTab === "realizadas"
            ? "border-b-2 border-ink font-semibold text-ink"
            : "border-b-2 border-transparent font-normal text-muted hover:text-ink"
        }`}
      >
        Realizadas
      </button>
      <button
        type="button"
        onClick={() => onTabChange("em_andamento")}
        className={`mr-5 flex cursor-pointer items-center gap-2 px-1 py-[14px] text-[14px] transition-colors ${
          activeTab === "em_andamento"
            ? "border-b-2 border-ink font-semibold text-ink"
            : "border-b-2 border-transparent font-normal text-muted hover:text-ink"
        }`}
      >
        <span>Em andamento</span>
        {hasActiveSession && (
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8A6D00]" />
          </span>
        )}
      </button>
    </div>
  );
}
