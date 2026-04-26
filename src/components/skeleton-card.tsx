// 骨架屏加载组件 - 在数据加载时显示占位内容

import { cn } from "@/lib/utils";
import type { ViewMode } from "@/types";

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("shimmer rounded-lg", className)} />;
}

interface SkeletonCardProps {
  viewMode: ViewMode;
}

export function SkeletonCard({ viewMode }: SkeletonCardProps) {
  if (viewMode === "list") {
    return (
      <div className="flex gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4">
        <Skeleton className="h-28 w-40 shrink-0 rounded-xl sm:h-32 sm:w-48" />
        <div className="flex flex-1 flex-col justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
            <div className="flex gap-1">
              <Skeleton className="h-5 w-12 rounded-md" />
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-5 w-10 rounded-md" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-5 w-14 rounded-md" />
          <Skeleton className="h-5 w-14 rounded-md" />
          <Skeleton className="h-5 w-14 rounded-md" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

// 骨架屏网格
export function SkeletonGrid({
  count = 12,
  viewMode,
}: {
  count?: number;
  viewMode: ViewMode;
}) {
  return (
    <div
      className={cn(
        viewMode === "grid"
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "flex flex-col gap-3"
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} viewMode={viewMode} />
      ))}
    </div>
  );
}
