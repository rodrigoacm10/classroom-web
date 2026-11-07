import React from "react";
import { Avatar } from "@/components/global";

export interface AoVivoAvatarProps {
  name: string;
}

export function AoVivoAvatar({ name }: AoVivoAvatarProps) {
  return <Avatar name={name} />;
}
