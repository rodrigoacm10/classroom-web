import React from "react";

export interface IconProps {
  className?: string;
  size?: number;
}

export function ChevronLeftIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
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

export function ChevronRightIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M6 3l5 5-5 5"
        stroke="var(--color-muted)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDownIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
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

export function SearchIcon({ className = "", size = 14 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
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

export function ClockIcon({ className = "", size = 14 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M7 4v3l2 1.2"
        stroke="currentColor"
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

export function RadiusIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2.5 2" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function FilterIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M2 4h12M4 8h8M6 12h4"
        stroke="var(--color-muted)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PlusIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M8 2.5v11M2.5 8h11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MapPinIcon({ className = "", size = 14 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 text-muted ${className}`}
    >
      <path
        d="M8 1.5a4.5 4.5 0 0 0-4.5 4.5c0 3.2 4.5 8.5 4.5 8.5s4.5-5.3 4.5-8.5A4.5 4.5 0 0 0 8 1.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function RadioLiveIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <circle cx="8" cy="8" r="3" fill="currentColor" />
      <path
        d="M4 4a5.66 5.66 0 0 0 0 8M12 4a5.66 5.66 0 0 1 0 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M2 2a8.5 8.5 0 0 0 0 12M14 2a8.5 8.5 0 0 1 0 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function UserIcon({ className = "", size = 14 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 text-muted ${className}`}
    >
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M2.5 13.5c0-2.8 2.5-4.5 5.5-4.5s5.5 1.7 5.5 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AttendanceIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5v3.2l2 1.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className = "", size = 14 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M3.5 3.5l7 7M10.5 3.5l-7 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CheckIcon({ className = "", size = 14 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M2.5 7.5L5.5 10.5L11.5 3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UsersIcon({ className = "", size = 15 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M1.5 13c0-2.5 2-3.8 4.5-3.8s4.5 1.3 4.5 3.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M11 4a2.2 2.2 0 0 1 0 4.4M14.5 12.5c0-1.8-1.2-2.8-3-3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ExternalLinkIcon({ className = "", size = 13 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M6 2H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M8.5 1H13m0 0v4.5M13 1 7 7"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GpsTargetIcon({ className = "", size = 14 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" />
      <path
        d="M7 1v2M7 11v2M1 7h2M11 7h2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CopyIcon({ className = "", size = 14 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <rect x="1" y="4" width="8" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M4 4V2.5A1.5 1.5 0 0 1 5.5 1H11a1.5 1.5 0 0 1 1.5 1.5V8a1.5 1.5 0 0 1-1.5 1.5H10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DotsVerticalIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <circle cx="8" cy="3.5" r="1.5" fill="currentColor" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="8" cy="12.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function PencilIcon({ className = "", size = 14 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M10 2l2 2-7.5 7.5H2.5v-2L10 2z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrashIcon({ className = "", size = 14 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M2.5 3.5h9M5 3.5V2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M11.5 3.5l-.8 8.4A1.5 1.5 0 0 1 9.2 13.5H4.8a1.5 1.5 0 0 1-1.5-1.6L2.5 3.5M5.5 6.5v4M8.5 6.5v4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}



