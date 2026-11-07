import React from "react";
import { getInitials } from "@/lib/utils";

export interface AvatarColor {
  bg: string;
  fg: string;
}

export const AVATAR_COLORS: AvatarColor[] = [
  { bg: "#E9F4FF", fg: "#1A6DC2" },
  { bg: "#FFF0E0", fg: "#B05A00" },
  { bg: "#F0EAF8", fg: "#6B38A8" },
  { bg: "#E7F2EB", fg: "#1E7A44" },
  { bg: "#FFF4CC", fg: "#896300" },
  { bg: "#FCE8E8", fg: "#C42B1C" },
];

export function getAvatarColor(name: string): AvatarColor {
  if (!name) return AVATAR_COLORS[0];
  const idx =
    name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | number;
  className?: string;
  style?: React.CSSProperties;
}

export function Avatar({
  name,
  size = "md",
  className = "",
  style,
}: AvatarProps) {
  const { bg, fg } = getAvatarColor(name);

  const sizeClassMap: Record<"sm" | "md" | "lg", string> = {
    sm: "h-8 w-8 text-caption",
    md: "h-9 w-9 text-label",
    lg: "h-10 w-10 text-body",
  };

  const isPresetSize = typeof size === "string";
  const sizeClasses = isPresetSize ? sizeClassMap[size] : "";

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full text-label font-bold select-none ${sizeClasses} ${className}`}
      style={{
        background: bg,
        color: fg,
        ...(typeof size === "number" ? { width: size, height: size } : {}),
        ...style,
      }}
    >
      {getInitials(name)}
    </div>
  );
}
