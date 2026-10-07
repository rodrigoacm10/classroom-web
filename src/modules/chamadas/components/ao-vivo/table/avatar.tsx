import React from "react";
import { getInitials } from "@/lib/utils";

const AVATAR_COLORS = [
  { bg: "#E9F4FF", fg: "#1A6DC2" },
  { bg: "#FFF0E0", fg: "#B05A00" },
  { bg: "#F0EAF8", fg: "#6B38A8" },
  { bg: "#E7F2EB", fg: "#1E7A44" },
  { bg: "#FFF4CC", fg: "#896300" },
  { bg: "#FCE8E8", fg: "#C42B1C" },
];

interface AoVivoAvatarProps {
  name: string;
}

export function AoVivoAvatar({ name }: AoVivoAvatarProps) {
  const idx =
    name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  const { bg, fg } = AVATAR_COLORS[idx];

  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-label font-bold"
      style={{ background: bg, color: fg }}
    >
      {getInitials(name)}
    </div>
  );
}
