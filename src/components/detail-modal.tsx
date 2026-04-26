"use client";

// 房源详情弹窗 - 展示完整信息、图片轮播、设施清单、跳转原平台

import { useState, useEffect, useRef } from "react";
import {
  X, Heart, ExternalLink, MapPin, Train, Maximize2,
  Building2, ChevronLeft, ChevronRight, Home, Layers,
  Compass, Sparkles, User, Calendar,
} from "lucide-react";
import { cn, formatPrice, formatArea, formatRelativeTime, PLATFORM_CONFIG } from "@/lib/utils";
import { PlatformBadge } from "./platform-badge";
import type { Listing } from "@/types";

interface DetailModalProps {
  listing: Listing | null;
  isFavorite: boolean;
  onToggleFavorite: (listing: Listing) => void;
  onClose: () => void;
}

export function DetailModal({ listing, isFavorite, onToggleFavorite, onClose }: DetailModalProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // 重置图片索引
  useEffect(() => {
    if (listing) setCurrentImage(0);
  }, [listing?.id]);

  // 键盘导航
  useEffect(() => {
    if (!listing) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrentImage((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight" && listing.images.length > 1)
        setCurrentImage((i) => Math.min(listing.images.length - 1, i + 1));
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [listing, onClose]);

  // 锁定背景滚动
  useEffect(() => {
    if (listing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [listing]);

  if (!listing) return null;

  const config = PLATFORM_CONFIG[listing.platform];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={listing.title}
    >
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 弹窗内容 */}
      <div
        ref={modalRef}
        className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-card shadow-2xl sm:rounded-2xl animate-fade-in"
      >
        {/* 图片轮播 */}
        <div className="relative h-64 w-full shrink-0 overflow-hidden bg-muted sm:h-80">
          {listing.images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${listing.title} - 图片 ${i + 1}`}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
                i === currentImage ? "opacity-100" : "opacity-0"
              )}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${listing.id}${i}/800/500`;
              }}
            />
          ))}

          {/* 图片切换控件 */}
          {listing.images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImage((i) => Math.max(0, i - 1))}
                disabled={currentImage === 0}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60 disabled:opacity-30"
                aria-label="上一张图片"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentImage((i) => Math.min(listing.images.length - 1, i + 1))}
                disabled={currentImage === listing.images.length - 1}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60 disabled:opacity-30"
                aria-label="下一张图片"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              {/* 图片指示点 */}
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {listing.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === currentImage ? "w-4 bg-white" : "w-1.5 bg-white/50"
                    )}
                    aria-label={`第 ${i + 1} 张图片`}
                  />
                ))}
              </div>
            </>
          )}

          {/* 顶部操作栏 */}
          <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
            <PlatformBadge platform={listing.platform} size="md" />
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(listing)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-all",
                  isFavorite
                    ? "bg-rose-500 text-white"
                    : "bg-black/30 text-white hover:bg-rose-500"
                )}
                aria-label={isFavorite ? "取消收藏" : "收藏房源"}
              >
                <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
              </button>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50"
                aria-label="关闭"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 可滚动内容区 */}
        <div className="custom-scrollbar flex-1 overflow-y-auto">
          <div className="p-5">
            {/* 价格 & 标题 */}
            <div className="mb-1 flex items-start justify-between gap-3">
              <h2 className="flex-1 text-lg font-semibold leading-snug text-foreground">
                {listing.title}
              </h2>
            </div>
            <div className="mb-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(listing.price)}
              </span>
              <span className="text-sm text-muted-foreground">{listing.roomType}</span>
            </div>

            {/* 核心信息网格 */}
            <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-muted/50 p-3 sm:grid-cols-4">
              <InfoItem icon={<Maximize2 className="h-4 w-4" />} label="面积" value={formatArea(listing.area)} />
              <InfoItem icon={<Building2 className="h-4 w-4" />} label="楼层" value={listing.floor ? `${listing.floor}/${listing.totalFloors}层` : "未知"} />
              <InfoItem icon={<Compass className="h-4 w-4" />} label="朝向" value={listing.orientation ?? "未知"} />
              <InfoItem icon={<Sparkles className="h-4 w-4" />} label="装修" value={listing.decoration ?? "未知"} />
            </div>

            {/* 位置信息 */}
            <div className="mb-4 space-y-2">
              <div className="flex items-start gap-2 text-sm text-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{listing.location}</span>
              </div>
              {listing.subwayLines && listing.subwayLines.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Train className="h-4 w-4 shrink-0 text-jade-600" />
                  <span>
                    {listing.subwayLines.join("、")} 步行约 {listing.subwayDistance} 分钟
                  </span>
                </div>
              )}
            </div>

            {/* 房源标签 */}
            <div className="mb-4">
              <h3 className="mb-2 text-sm font-medium text-foreground">房源特色</h3>
              <div className="flex flex-wrap gap-2">
                {listing.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-primary/8 px-3 py-1 text-xs font-medium text-primary"
                    style={{ backgroundColor: `${PLATFORM_CONFIG[listing.platform].color}12` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 房源描述 */}
            <div className="mb-4">
              <h3 className="mb-2 text-sm font-medium text-foreground">房源描述</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {listing.description}
              </p>
            </div>

            {/* 设施配套 */}
            <div className="mb-4">
              <h3 className="mb-2 text-sm font-medium text-foreground">设施配套</h3>
              <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
                {listing.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="flex items-center justify-center rounded-lg border border-border bg-secondary px-2 py-1.5 text-center text-xs text-secondary-foreground"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* 额外信息 */}
            <div className="mb-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {listing.landlordType && (
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {listing.landlordType}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatRelativeTime(listing.publishedAt)}发布
              </span>
            </div>

            {/* 免责声明 */}
            <div className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
              ⚠️ 本平台数据仅供参考，不保证信息实时准确。如需了解真实房源信息，请点击下方链接访问原始平台核实。
            </div>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="shrink-0 border-t border-border bg-card p-4 safe-bottom">
          <a
            href={listing.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
            style={{ backgroundColor: config.color }}
          >
            <ExternalLink className="h-4 w-4" />
            在 {listing.platform} 上查看原始房源
          </a>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
