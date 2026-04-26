"use client";

// 空状态 & 错误状态组件

import { SearchX, AlertTriangle, RefreshCw, Home } from "lucide-react";
import { cn } from "@/lib/utils";

// 搜索无结果
interface EmptyStateProps {
  keyword?: string;
  onReset?: () => void;
  className?: string;
}

export function EmptyState({ keyword, onReset, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-20 text-center",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <SearchX className="h-10 w-10 text-muted-foreground" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          {keyword ? `"${keyword}" 暂无相关房源` : "没有找到符合条件的房源"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          试试调整筛选条件，或扩大搜索范围
        </p>
      </div>
      {onReset && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          重置条件
        </button>
      )}
    </div>
  );
}

// 错误状态
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ message, onRetry, className }: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-20 text-center",
        className
      )}
      role="alert"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">加载失败</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {message ?? "网络异常，请稍后重试"}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          重新加载
        </button>
      )}
    </div>
  );
}

// 收藏夹为空状态
export function FavoritesEmpty({ onGoSearch }: { onGoSearch: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Home className="h-10 w-10 text-muted-foreground" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">收藏夹还是空的</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          在搜索结果中点击❤️图标，收藏你中意的房源
        </p>
      </div>
      <button
        onClick={onGoSearch}
        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        去找房
      </button>
    </div>
  );
}
