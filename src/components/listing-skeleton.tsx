// 骨架屏组件 - 内容加载时的占位动效

import { cn } from "@/lib/utils";
import type { ViewMode } from "@/types";

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("shimmer rounded-lg", className)} />;
}

// 网格视图骨架卡片
function GridSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="flex flex-col gap-2.5 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/5" />
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="mt-2 h-3 w-1/3" />
      </div>
    </div>
  );
}

// 列表视图骨架卡片
function ListSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm">
      <Skeleton className="h-28 w-40 shrink-0" />
      <div className="flex flex-1 flex-col gap-2.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/5" />
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="mt-auto flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

interface ListingSkeletonProps {
  viewMode: ViewMode;
  count?: number;
}

export function ListingSkeletons({ viewMode, count = 12 }: ListingSkeletonProps) {
  return (
    <div
      className={cn(
        viewMode === "grid"
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "flex flex-col gap-3"
      )}
      aria-busy="true"
      aria-label="正在加载房源…"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ animationDelay: `${i * 50}ms` }}>
          {viewMode === "grid" ? <GridSkeleton /> : <ListSkeleton />}
        </div>
      ))}
    </div>
  );
}

// 过滤面板骨架
export function FilterSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-9 w-28" />
        <div className="flex gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-12" />
          ))}
        </div>
        <Skeleton className="ml-auto h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
