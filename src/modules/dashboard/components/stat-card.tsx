export interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  valueClass?: string;
  border?: "left" | "right" | "both" | "none";
}

export function StatCard({
  label,
  value,
  sub,
  valueClass = "text-ink",
  border = "none",
}: StatCardProps) {
  const borderClass = {
    left: "border-l border-l-border pl-5",
    right: "border-r border-r-border pr-5",
    both: "border-x border-x-border px-5",
    none: "",
  }[border];

  return (
    <div className={`flex flex-1 flex-col gap-1.5 py-2 ${borderClass}`}>
      <span className="font-semibold tracking-caps uppercase text-muted text-label/caption">
        {label}
      </span>
      <span
        className={`font-mono font-medium tracking-tight text-[40px] leading-[44px] ${valueClass}`}
      >
        {value}
      </span>
      <span className="text-muted text-label/caption">{sub}</span>
    </div>
  );
}
