import type { ReactNode } from "react";

/**
 * Callout for information the reader must not miss. Uses the accent surface so
 * it reads as the page talking to you, not as an error.
 */
export function Notice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="flex flex-col gap-2 rounded-sm bg-accent-surface px-6 py-5">
      <p className="font-bold tracking-caps text-caption/caption text-ink uppercase">
        {title}
      </p>
      <div className="text-body/body text-ink">{children}</div>
    </aside>
  );
}
