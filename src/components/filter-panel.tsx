"use client";

// 过滤面板 - 房型、价格、平台、入住时间等筛选条件

import { useState } from "react";
import { ChevronDown, SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { cn, PRICE_PRESETS, BEIJING_DISTRICTS } from "@/lib/utils";
import type { SearchFilters, Platform, RoomType, SortOption } from "@/types";

const ROOM_TYPES: Array<RoomType | "全部"> = ["全部", "整租", "合租", "1室", "2室", "3室+"];
const PLATFORMS: Platform[] = ["贝壳", "小红书", "自如", "链家", "安居客"];
const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: "date_desc", label: "最新发布" },
  { value: "price_asc", label: "价格从低" },
  { value: "price_desc", label: "价格从高" },
  { value: "area_asc", label: "面积从小" },
];

interface FilterPanelProps {
  filters: SearchFilters;
  onChange: (filters: Partial<SearchFilters>) => void;
  onReset: () => void;
  totalResults: number;
}

export function FilterPanel({ filters, onChange, onReset, totalResults }: FilterPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customPriceMin, setCustomPriceMin] = useState(
    filters.priceMin > 0 ? String(filters.priceMin) : ""
  );
  const [customPriceMax, setCustomPriceMax] = useState(
    filters.priceMax < 99999 ? String(filters.priceMax) : ""
  );

  // 判断是否有激活的过滤条件
  const hasActiveFilters =
    filters.roomType !== "全部" ||
    filters.priceMin > 0 ||
    filters.priceMax < 99999 ||
    filters.platforms.length > 0 ||
    filters.district !== "全部" ||
    filters.moveInDate !== "";

  const handlePricePreset = (min: number, max: number) => {
    onChange({ priceMin: min, priceMax: max });
    setCustomPriceMin(min > 0 ? String(min) : "");
    setCustomPriceMax(max < 99999 ? String(max) : "");
  };

  const handleCustomPrice = () => {
    const min = parseInt(customPriceMin) || 0;
    const max = parseInt(customPriceMax) || 99999;
    onChange({ priceMin: min, priceMax: Math.max(min, max) });
  };

  const handlePlatformToggle = (platform: Platform) => {
    const current = filters.platforms;
    const updated = current.includes(platform)
      ? current.filter((p) => p !== platform)
      : [...current, platform];
    onChange({ platforms: updated });
  };

  const handleReset = () => {
    setCustomPriceMin("");
    setCustomPriceMax("");
    onReset();
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      {/* 基础过滤行 */}
      <div className="flex flex-wrap items-center gap-3 p-4">
        {/* 区域选择 */}
        <div className="relative">
          <select
            value={filters.district}
            onChange={(e) => onChange({ district: e.target.value })}
            className={cn(
              "h-9 appearance-none rounded-lg border px-3 pr-8 text-sm transition-colors",
              "bg-background text-foreground outline-none",
              filters.district !== "全部"
                ? "border-primary bg-primary/5 text-primary font-medium"
                : "border-border hover:border-primary/50"
            )}
            aria-label="选择行政区"
          >
            {BEIJING_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* 房型选择 */}
        <div className="flex items-center gap-1">
          {ROOM_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => onChange({ roomType: type })}
              className={cn(
                "h-9 rounded-lg px-3 text-sm transition-all",
                filters.roomType === type
                  ? "bg-primary text-primary-foreground font-medium shadow-sm"
                  : "border border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
              )}
              aria-pressed={filters.roomType === type}
            >
              {type}
            </button>
          ))}
        </div>

        {/* 排序 */}
        <div className="relative ml-auto">
          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ sortBy: e.target.value as SortOption })}
            className="h-9 appearance-none rounded-lg border border-border bg-background px-3 pr-8 text-sm text-foreground outline-none hover:border-primary/50"
            aria-label="排序方式"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* 展开高级过滤 */}
        <button
          onClick={() => setShowAdvanced((v) => !v)}
          className={cn(
            "flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm transition-all",
            showAdvanced || hasActiveFilters
              ? "border-primary bg-primary/5 text-primary"
              : "border-border text-foreground hover:border-primary/50"
          )}
          aria-expanded={showAdvanced}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          更多筛选
          {hasActiveFilters && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
              ✓
            </span>
          )}
        </button>

        {/* 重置 */}
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
            aria-label="重置所有过滤条件"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            重置
          </button>
        )}
      </div>

      {/* 高级过滤面板 */}
      {showAdvanced && (
        <div className="border-t border-border p-4 animate-fade-in">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* 价格区间 */}
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">价格区间（元/月）</p>
              <div className="flex flex-wrap gap-2">
                {PRICE_PRESETS.map((preset) => {
                  const isActive =
                    filters.priceMin === preset.min && filters.priceMax === preset.max;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => handlePricePreset(preset.min, preset.max)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs transition-all",
                        isActive
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
              {/* 自定义价格输入 */}
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  placeholder="最低"
                  value={customPriceMin}
                  onChange={(e) => setCustomPriceMin(e.target.value)}
                  onBlur={handleCustomPrice}
                  className="w-24 rounded-lg border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-primary"
                  aria-label="最低价格"
                />
                <span className="text-xs text-muted-foreground">—</span>
                <input
                  type="number"
                  placeholder="最高"
                  value={customPriceMax}
                  onChange={(e) => setCustomPriceMax(e.target.value)}
                  onBlur={handleCustomPrice}
                  className="w-24 rounded-lg border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-primary"
                  aria-label="最高价格"
                />
                <span className="text-xs text-muted-foreground">元</span>
              </div>
            </div>

            {/* 平台筛选 */}
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">平台选择</p>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((platform) => {
                  const isActive = filters.platforms.includes(platform);
                  return (
                    <button
                      key={platform}
                      onClick={() => handlePlatformToggle(platform)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all",
                        isActive
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      )}
                      aria-pressed={isActive}
                    >
                      {isActive && <X className="h-3 w-3" />}
                      {platform}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {filters.platforms.length === 0 ? "全部平台" : `已选 ${filters.platforms.length} 个平台`}
              </p>
            </div>

            {/* 入住时间 */}
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">期望入住日期</p>
              <input
                type="date"
                value={filters.moveInDate}
                onChange={(e) => onChange({ moveInDate: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                aria-label="期望入住日期"
              />
              {filters.moveInDate && (
                <button
                  onClick={() => onChange({ moveInDate: "" })}
                  className="ml-2 text-xs text-muted-foreground hover:text-destructive"
                >
                  清除
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 结果统计 */}
      <div className="border-t border-border px-4 py-2">
        <p className="text-xs text-muted-foreground">
          共找到 <span className="font-semibold text-foreground">{totalResults}</span> 套房源
        </p>
      </div>
    </div>
  );
}
