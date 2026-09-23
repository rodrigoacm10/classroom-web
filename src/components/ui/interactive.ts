/**
 * Shared interaction recipes. Every clickable element in the product goes
 * through one of these so hover, focus and press behave the same everywhere.
 *
 * Focus rings default to ink (see `:focus-visible` in globals.css). Pass
 * `onInk` for controls sitting on a dark surface, where an ink ring is invisible.
 */

type ButtonVariant = "accent" | "ink" | "outline";
type ButtonSize = "md" | "lg";

const buttonBase =
  "inline-flex items-center justify-center rounded-sm text-center transition-[background-color,border-color,color,filter] duration-150 ease-out active:translate-y-px";

const buttonVariants: Record<ButtonVariant, string> = {
  accent: "bg-accent text-ink font-semibold hover:brightness-95",
  ink: "bg-ink text-on-ink font-semibold hover:bg-ink/85",
  outline:
    "border border-control-border bg-paper text-ink font-medium hover:border-ink hover:bg-surface",
};

const buttonSizes: Record<ButtonSize, string> = {
  md: "min-h-11 px-4 text-label/caption",
  lg: "min-h-[52px] px-7 text-body leading-[18px]",
};

export function buttonClass({
  variant = "accent",
  size = "lg",
  onInk = false,
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  onInk?: boolean;
  className?: string;
} = {}) {
  return [
    buttonBase,
    buttonVariants[variant],
    buttonSizes[size],
    onInk ? "focus-visible:outline-accent" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Text inputs. Focus is handled by the global `:focus-visible` ring. */
export function fieldClass({
  invalid = false,
  className = "",
}: { invalid?: boolean; className?: string } = {}) {
  return [
    "min-h-11 w-full rounded-sm border bg-paper px-3.5 text-body/body text-ink transition-colors duration-150 ease-out placeholder:text-muted",
    invalid ? "border-danger" : "border-control-border hover:border-ink",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Text links in navigation and footers. `min-h-11` keeps the touch target
 * comfortable on phones and collapses in the desktop header bar, where the
 * row height is already fixed and the input is a pointer.
 */
export function textLinkClass({
  onInk = false,
  className = "",
}: { onInk?: boolean; className?: string } = {}) {
  return [
    "inline-flex min-h-11 items-center rounded-sm transition-colors duration-150 ease-out xl:min-h-0",
    onInk
      ? "text-on-ink-muted hover:text-on-ink focus-visible:outline-accent"
      : "text-muted hover:text-ink",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}
