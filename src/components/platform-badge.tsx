// 平台标签组件 - 显示各平台的标识徽章

import { cn } from "@/lib/utils";
import { PLATFORM_CONFIG } from "@/lib/utils";
import type { Platform } from "@/types";

interface PlatformBadgeProps {
  platform: Platform;
  size?: "sm" | "md";
  className?: string;
}

export function PlatformBadge({ platform, size = "sm", className }: PlatformBadgeProps) {
  const config = PLATFORM_CONFIG[platform];

  return (
    <span
      className={cn(
        "platform-badge",
        config.bgColor,
        config.textColor,
        size === "md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs",
        "font-semibold border",
        className
      )}
      style={{
        borderColor: `${config.color}33`,
      }}
    >
      <span className="mr-0.5">{config.icon}</span>
      {config.name}
    </span>
  );
}
