import React from "react";
import { formattedDate } from "@/lib/utils";

export interface PageHeaderProps {
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  bordered?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  eyebrow = formattedDate(),
  subtitle,
  description,
  actions,
  bordered = false,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-4 px-9 py-6 md:flex-row md:items-center md:justify-between ${
        bordered ? "border-b border-border bg-paper" : ""
      } ${className}`}
    >
      <div className="flex flex-col gap-1">
        {eyebrow && (
          typeof eyebrow === "string" ? (
            <span className="font-semibold tracking-caps uppercase text-muted text-label/caption">
              {eyebrow}
            </span>
          ) : (
            eyebrow
          )
        )}
        <h1 className="font-extrabold tracking-tight text-ink text-[32px] leading-9">
          {title}
        </h1>
        {subtitle && (
          typeof subtitle === "string" ? (
            <span className="text-label text-muted">{subtitle}</span>
          ) : (
            subtitle
          )
        )}
        {description && (
          <p className="mt-0.5 text-body text-muted">{description}</p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}


/**
 * Ícone '+' com traço em destaque amarelo (var(--color-accent)) para botões principais de cabeçalho.
 */
export function PageHeaderAddIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M8 3v10M3 8h10"
        stroke="var(--color-accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
