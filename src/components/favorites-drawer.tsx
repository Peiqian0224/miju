"use client";

// 收藏夹抽屉 - 滑出式侧边栏，展示已收藏房源列表

import { useEffect, useRef } from "react";
import { X, Heart, Trash2, ExternalLink, MapPin } from "lucide-react";
import { cn, formatPrice, formatArea, formatRelativeTime } from "@/lib/utils";
import { PlatformBadge } from "./platform-badge";
import { FavoritesEmpty } from "./empty-state";
import type { Listing } from "@/types";

interface FavoritesDrawerProps {
  isOpen: boolean;
  favorites: Listing[];
  onClose: () => void;
  onRemove: (listing: Listing) => void;
  onOpenDetail: (listing: Listing) => void;
  onClearAll: () => void;
}

export function FavoritesDrawer({
  isOpen,
  favorites,
  onClose,
  onRemove,
  onOpenDetail,
  onClearAll,
}: FavoritesDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // 键盘 Escape 关闭
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // 锁定背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // 焦点陷阱
  useEffect(() => {
    if (isOpen) {
      drawerRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 抽屉面板 */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="我的收藏"
        tabIndex={-1}
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-card shadow-2xl outline-none transition-transform duration-300 ease-out sm:w-96",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* 抽屉头部 */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
            <h2 className="text-base font-semibold text-foreground">我的收藏</h2>
            {favorites.length > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {favorites.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {favorites.length > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                aria-label="清空所有收藏"
              >
                <Trash2 className="h-3.5 w-3.5" />
                清空
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="关闭收藏夹"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 收藏列表 */}
        <div className="custom-scrollbar flex-1 overflow-y-auto">
          {favorites.length === 0 ? (
            <FavoritesEmpty onGoSearch={onClose} />
          ) : (
            <ul className="divide-y divide-border">
              {favorites.map((listing) => (
                <li key={listing.id} className="group relative">
                  <button
                    className="flex w-full gap-3 p-4 text-left transition-colors hover:bg-muted/50"
                    onClick={() => {
                      onOpenDetail(listing);
                      onClose();
                    }}
                    aria-label={`查看收藏房源：${listing.title}`}
                  >
                    {/* 缩略图 */}
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${listing.id}/400/280`;
                        }}
                      />
                      <div className="absolute left-1 top-1">
                        <PlatformBadge platform={listing.platform} />
                      </div>
                    </div>

                    {/* 信息 */}
                    <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                      <p className="line-clamp-2 text-sm font-medium text-foreground leading-snug">
                        {listing.title}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{listing.location}</span>
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-primary">
                          {formatPrice(listing.price)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatArea(listing.area)} · {listing.roomType}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground/60">
                        {formatRelativeTime(listing.publishedAt)}
                      </p>
                    </div>
                  </button>

                  {/* 操作按钮（悬停显示） */}
                  <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <a
                      href={listing.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-card shadow-sm border border-border text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="查看原始链接"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(listing);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-card shadow-sm border border-border text-muted-foreground transition-colors hover:text-destructive"
                      aria-label="取消收藏"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 底部提示 */}
        {favorites.length > 0 && (
          <div className="shrink-0 border-t border-border px-5 py-3 safe-bottom">
            <p className="text-center text-xs text-muted-foreground">
              收藏数据存储在本地，清除浏览器缓存后将丢失
            </p>
          </div>
        )}
      </div>
    </>
  );
}
