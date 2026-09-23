import type { ReactNode } from "react";

export function PageWidth({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1440px] px-5 md:px-10 xl:px-[120px] ${className}`}
    >
      {children}
    </div>
  );
}
