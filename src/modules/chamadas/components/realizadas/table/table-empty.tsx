import React from "react";
import { TableRow, TableCell } from "./table";

export interface TableEmptyProps {
  colSpan?: number;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function TableEmpty({
  colSpan,
  title,
  description,
  icon,
  action,
  className,
}: TableEmptyProps) {
  const content = (
    <div className={`flex flex-col items-center justify-center py-16 text-center px-4 ${className || ""}`}>
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface text-muted">
        {icon ?? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="10" r="7" stroke="var(--color-muted)" strokeWidth="1.6" />
            <path
              d="M10 6.5v4l2.5 1.5"
              stroke="var(--color-muted)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      <h3 className="font-sans text-heading font-semibold text-ink">
        {title}
      </h3>
      {description && (
        <p className="mt-1 font-sans text-label text-muted max-w-md">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );

  if (colSpan !== undefined) {
    return (
      <TableRow hoverable={false} className="border-0">
        <TableCell colSpan={colSpan} className="p-0 border-0">
          {content}
        </TableCell>
      </TableRow>
    );
  }

  return content;
}
