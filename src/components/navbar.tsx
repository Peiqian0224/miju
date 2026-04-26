"use client";

// 顶部导航栏组件

import { Heart, MapPin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavbarProps {
  favoritesCount?: number;
  onOpenFavorites?: () => void;
  className?: string;
}

export function Navbar({ favoritesCount = 0, onOpenFavorites, className }: NavbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-80"
          aria-label="觅居首页"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <MapPin className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight text-foreground">觅居</span>
            <span className="text-[10px] text-muted-foreground">租房聚合搜索</span>
          </div>
        </Link>

        {/* 右侧操作 */}
        <div className="flex items-center gap-2">
          {/* 免责声明标记 */}
          <span className="hidden rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700 sm:inline-flex dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
            仅供参考 · 数据来源：模拟数据
          </span>

          {/* 收藏夹按钮 */}
          {onOpenFavorites && (
            <button
              onClick={onOpenFavorites}
              className="relative flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-foreground transition-colors hover:bg-muted"
              aria-label={`我的收藏 ${favoritesCount > 0 ? `(${favoritesCount}条)` : ""}`}
            >
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">收藏</span>
              {favoritesCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {favoritesCount > 99 ? "99+" : favoritesCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
