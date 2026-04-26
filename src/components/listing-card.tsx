"use client";

// 房源卡片组件 - 支持网格/列表两种视图模式

import { useState } from "react";
import { Heart, MapPin, Train, Clock, Maximize2 } from "lucide-react";
import { cn, formatArea, formatRelativeTime } from "@/lib/utils";
import { PlatformBadge } from "@/components/platform-badge";
import type { Listing, ViewMode } from "@/types";

interface ListingCardProps {
  listing: Listing;
  viewMode: ViewMode;
  onOpenDetail: (listing: Listing) => void;
  // 收藏状态由父组件控制
  isFavorite?: boolean;
  onToggleFavorite?: (listing: Listing) => void;
}

export function ListingCard({
  listing,
  viewMode,
  onOpenDetail,
  isFavorite = false,
  onToggleFavorite,
}: ListingCardProps) {
  const [imgError, setImgError] = useState(false);

  function handleFavoriteClick(e: React.MouseEvent) {
    e.stopPropagation();
    onToggleFavorite?.(listing);
  }

  if (viewMode === "list") {
    return (
      <ListingRowCard
        listing={listing}
        fav={isFavorite}
        imgError={imgError}
        setImgError={setImgError}
        onOpenDetail={onOpenDetail}
        handleFavoriteClick={handleFavoriteClick}
      />
    );
  }

  return (
    <article
      className="listing-card group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:border-orange-300"
      onClick={() => onOpenDetail(listing)}
      role="button"
      tabIndex={0}
      aria-label={`查看房源：${listing.title}`}
      onKeyDown={(e) => e.key === "Enter" && onOpenDetail(listing)}
    >
      {/* 图片区域 */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {!imgError ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-secondary">
            <span className="text-4xl opacity-30">🏠</span>
          </div>
        )}

        {/* 渐变遮罩 */}
        <div className="image-overlay absolute inset-0" />

        {/* 平台徽章 */}
        <div className="absolute left-3 top-3">
          <PlatformBadge platform={listing.platform} />
        </div>

        {/* 收藏按钮 */}
        <button
          className={cn(
            "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full",
            "bg-white/90 shadow-sm backdrop-blur-sm transition-all duration-150",
            "hover:scale-110 hover:bg-white",
            isFavorite && "bg-rose-50"
          )}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? "取消收藏" : "收藏房源"}
        >
          <Heart
            className={cn(
              "h-4 w-4",
              isFavorite ? "fill-rose-500 text-rose-500" : "text-gray-500"
            )}
          />
        </button>

        {/* 价格浮层 */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xl font-bold text-white drop-shadow-md">
            ¥{listing.price.toLocaleString("zh-CN")}
            <span className="text-sm font-normal opacity-90">/月</span>
          </span>
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {listing.title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Maximize2 className="h-3 w-3" />
            {formatArea(listing.area)}
          </span>
          <span className="h-3 w-px bg-border" />
          <span className="font-medium text-foreground">{listing.roomType}</span>
          {listing.floor && (
            <>
              <span className="h-3 w-px bg-border" />
              <span>
                {listing.floor}/{listing.totalFloors}层
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{listing.location}</span>
        </div>

        {listing.subwayDistance && (
          <div className="flex items-center gap-1 text-xs text-emerald-600">
            <Train className="h-3 w-3 shrink-0" />
            <span>步行{listing.subwayDistance}分钟</span>
            {listing.subwayLines?.[0] && (
              <span className="ml-1 rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700">
                {listing.subwayLines[0]}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {listing.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(listing.publishedAt)}
          </span>
          {listing.landlordType && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-xs">
              {listing.landlordType}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── 列表视图行卡片 ───────────────────────────────────────────────

interface RowCardProps {
  listing: Listing;
  fav: boolean;
  imgError: boolean;
  setImgError: (v: boolean) => void;
  onOpenDetail: (listing: Listing) => void;
  handleFavoriteClick: (e: React.MouseEvent) => void;
}

function ListingRowCard({
  listing,
  fav,
  imgError,
  setImgError,
  onOpenDetail,
  handleFavoriteClick,
}: RowCardProps) {
  return (
    <article
      className="listing-card group flex cursor-pointer gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-orange-300"
      onClick={() => onOpenDetail(listing)}
      role="button"
      tabIndex={0}
      aria-label={`查看房源：${listing.title}`}
      onKeyDown={(e) => e.key === "Enter" && onOpenDetail(listing)}
    >
      {/* 缩略图 */}
      <div className="relative h-28 w-40 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-32 sm:w-48">
        {!imgError ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-secondary">
            <span className="text-3xl opacity-30">🏠</span>
          </div>
        )}
        <div className="absolute left-2 top-2">
          <PlatformBadge platform={listing.platform} />
        </div>
      </div>

      {/* 内容 */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="space-y-1.5">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
            {listing.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{listing.roomType}</span>
            <span>{formatArea(listing.area)}</span>
            {listing.floor && (
              <span>
                {listing.floor}/{listing.totalFloors}层
              </span>
            )}
            {listing.orientation && <span>{listing.orientation}</span>}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{listing.location}</span>
            {listing.subwayDistance && (
              <>
                <span className="mx-1">·</span>
                <Train className="h-3 w-3 shrink-0 text-emerald-600" />
                <span className="text-emerald-600">{listing.subwayDistance}分钟</span>
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-1">
            {listing.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-lg font-bold text-orange-500">
              ¥{listing.price.toLocaleString("zh-CN")}
            </span>
            <span className="text-xs text-muted-foreground">/月</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(listing.publishedAt)}
            </span>
            <button
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border border-border",
                "transition-all duration-150 hover:scale-110",
                fav
                  ? "bg-rose-50 text-rose-500"
                  : "bg-background text-muted-foreground hover:text-rose-500"
              )}
              onClick={handleFavoriteClick}
              aria-label={fav ? "取消收藏" : "收藏房源"}
            >
              <Heart className={cn("h-4 w-4", fav && "fill-rose-500 text-rose-500")} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
