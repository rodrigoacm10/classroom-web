import React from "react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/* ─── Table Container & Root ─────────────────────────────────────────────── */

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
  footer?: React.ReactNode;
}

export function Table({
  children,
  className,
  containerClassName,
  footer,
  ...props
}: TableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-white shadow-xs",
        containerClassName
      )}
    >
      <div className="w-full overflow-x-auto">
        <table
          className={cn("w-full border-collapse text-left font-sans text-body", className)}
          {...props}
        >
          {children}
        </table>
      </div>
      {footer}
    </div>
  );
}

/* ─── Table Header ────────────────────────────────────────────────────────── */

export type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>;

export function TableHeader({ children, className, ...props }: TableHeaderProps) {
  return (
    <thead
      className={cn("border-b border-border bg-[#FAFAFA]", className)}
      {...props}
    >
      {children}
    </thead>
  );
}

/* ─── Table Body ──────────────────────────────────────────────────────────── */

export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

export function TableBody({ children, className, ...props }: TableBodyProps) {
  return (
    <tbody
      className={cn("divide-y divide-border bg-white", className)}
      {...props}
    >
      {children}
    </tbody>
  );
}

/* ─── Table Row ───────────────────────────────────────────────────────────── */

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  hoverable?: boolean;
}

export function TableRow({
  children,
  className,
  hoverable = true,
  ...props
}: TableRowProps) {
  return (
    <tr
      className={cn(
        "border-b border-border transition-colors last:border-b-0",
        hoverable && "hover:bg-surface/50",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

/* ─── Table Head (Column title) ───────────────────────────────────────────── */

export type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement>;

export function TableHead({ children, className, ...props }: TableHeadProps) {
  return (
    <th
      className={cn(
        "px-5 py-3 font-sans text-caption font-bold uppercase tracking-caps text-muted align-middle whitespace-nowrap",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

/* ─── Table Cell ──────────────────────────────────────────────────────────── */

export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>;

export function TableCell({ children, className, ...props }: TableCellProps) {
  return (
    <td className={cn("px-5 py-4 align-middle", className)} {...props}>
      {children}
    </td>
  );
}

/* ─── Table Footer ────────────────────────────────────────────────────────── */

export type TableFooterProps = React.HTMLAttributes<HTMLDivElement>;

export function TableFooter({ children, className, ...props }: TableFooterProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between border-t border-border bg-white px-5 py-4 gap-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
