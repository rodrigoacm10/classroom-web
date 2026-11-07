type Step = {
  label: string;
};

/**
 * Linear step indicator for multi-step flows.
 * Renders a compact progress row showing which step the user is on.
 */
export function FlowSteps({
  steps,
  current,
}: {
  steps: Step[];
  /** 1-indexed current step */
  current: number;
}) {
  return (
    <nav aria-label="Etapas do processo" className="mb-8">
      <ol className="flex items-center gap-0">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isDone = stepNumber < current;
          const isActive = stepNumber === current;
          const isLast = index === steps.length - 1;

          return (
            <li key={step.label} className="flex items-center">
              {/* Step dot + label */}
              <div className="flex items-center gap-2">
                <span
                  aria-current={isActive ? "step" : undefined}
                  className={`flex size-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                    isDone
                      ? "bg-ink text-on-ink"
                      : isActive
                        ? "bg-ink text-on-ink"
                        : "border border-control-border bg-paper text-muted"
                  }`}
                >
                  {isDone ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="size-3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </span>
                <span
                  className={`text-label/caption font-medium transition-colors ${
                    isActive ? "text-ink" : isDone ? "text-ink" : "text-muted"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  className={`mx-3 h-px w-8 transition-colors ${
                    isDone ? "bg-ink" : "bg-border"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

const RECOVERY_STEPS: Step[] = [
  { label: "E-mail" },
  { label: "Código" },
  { label: "Nova senha" },
];

/** Pre-configured step indicator for the password recovery flow. */
export function RecoverySteps({ current }: { current: 1 | 2 | 3 }) {
  return <FlowSteps steps={RECOVERY_STEPS} current={current} />;
}
