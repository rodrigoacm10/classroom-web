import React from "react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export type StatusBadgeVariant =
  | "accent"
  | "live"
  | "success"
  | "muted"
  | "danger"
  | "warn";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: StatusBadgeVariant;
  pulse?: boolean;
}

const variantStyles: Record<StatusBadgeVariant, string> = {
  accent: "bg-accent text-ink",
  live: "bg-accent text-ink",
  success: "bg-success-surface text-success",
  muted: "bg-surface text-muted",
  danger: "bg-danger-surface text-danger",
  warn: "bg-warn/10 text-warn",
};

export function StatusBadge({
  variant = "muted",
  pulse = false,
  children,
  className,
  ...props
}: StatusBadgeProps) {
  const isPulseActive = pulse || variant === "live";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans text-caption font-bold uppercase tracking-caps whitespace-nowrap",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {isPulseActive && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-ink" />
        </span>
      )}
      {children}
    </span>
  );
}
