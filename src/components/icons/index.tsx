import React from "react";

export interface IconProps {
  className?: string;
}

export function ChevronLeftIcon({ className = "" }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M10 3L5 8l5 5"
        stroke="var(--color-muted)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDownIcon({ className = "" }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="var(--color-muted)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SearchIcon({ className = "" }: IconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 text-muted ${className}`}
    >
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M9.5 9.5L12.5 12.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PlayIcon({ className = "" }: IconProps) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <path d="M3.5 2.5l6 3.75-6 3.75V2.5z" fill="var(--color-ink)" />
    </svg>
  );
}

export function InfoIcon({ className = "" }: IconProps) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <circle cx="6" cy="6" r="5" stroke="var(--color-on-ink-muted)" strokeWidth="1.2" />
      <path
        d="M6 5.5v3M6 4v.5"
        stroke="var(--color-on-ink-muted)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ClassesIcon({ className = "" }: IconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <rect x="1.5" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="7.5" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="1.5" y="8" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="7.5" y="8" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function LocationIcon({ className = "" }: IconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M7 1.5a4 4 0 0 1 4 4c0 2.5-4 7-4 7S3 8 3 5.5a4 4 0 0 1 4-4z"
        stroke="var(--color-on-ink-subtle)"
        strokeWidth="1.3"
      />
      <circle cx="7" cy="5.5" r="1.2" stroke="var(--color-on-ink-subtle)" strokeWidth="1.3" />
    </svg>
  );
}

export function ClockIcon({ className = "" }: IconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <circle cx="7" cy="7" r="5.5" stroke="var(--color-on-ink-subtle)" strokeWidth="1.3" />
      <path
        d="M7 4v3l2 1.2"
        stroke="var(--color-on-ink-subtle)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StudentsIcon({ className = "" }: IconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <circle cx="5" cy="4.5" r="2" stroke="var(--color-on-ink-subtle)" strokeWidth="1.3" />
      <circle cx="9.5" cy="4.5" r="2" stroke="var(--color-on-ink-subtle)" strokeWidth="1.3" />
      <path
        d="M2 11c.5-1.8 1.8-2.8 3.7-2.8s3.2 1 3.7 2.8M10 8.4c1.3 0 2.4.7 2.9 1.9"
        stroke="var(--color-on-ink-subtle)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LocationPinIcon({ className = "" }: IconProps) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M7 1.5a4 4 0 0 1 4 4c0 2.5-4 7-4 7S3 8 3 5.5a4 4 0 0 1 4-4z"
        stroke="var(--color-muted)"
        strokeWidth="1.4"
      />
      <circle cx="7" cy="5.5" r="1.3" stroke="var(--color-muted)" strokeWidth="1.4" />
    </svg>
  );
}

export function RadiusIcon({ className = "" }: IconProps) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <circle cx="7" cy="7" r="5.5" stroke="var(--color-muted)" strokeWidth="1.4" />
      <path
        d="M7 4v3l2 1.2"
        stroke="var(--color-muted)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
