"use client";

// 搜索主页面 - 集成搜索栏、过滤面板、结果展示、详情弹窗、收藏夹

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LayoutGrid, List, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { FilterPanel } from "@/components/filter-panel";
import { ListingCard } from "@/components/listing-card";
import { DetailModal } from "@/components/detail-modal";
import { FavoritesDrawer } from "@/components/favorites-drawer";
import { Pagination } from "@/components/pagination";
import { ListingSkeletons } from "@/components/listing-skeleton";
import { EmptyState, ErrorState } from "@/components/empty-state";
import { cn } from "@/lib/utils";
import {
  getFavoriteIds,
  getFavoriteListings,
  toggleFavorite,
  clearAllFavorites,
  saveSearchHistory,
} from "@/lib/store";
import type { Listing, SearchFilters, PaginatedListings, ViewMode, SearchHistoryItem } from "@/types";

// 默认过滤条件
const DEFAULT_FILTERS: SearchFilters = {
  keyword: "",
  district: "全部",
  roomType: "全部",
  priceMin: 0,
  priceMax: 99999,
  platforms: [],
  moveInDate: "",
  sortBy: "date_desc",
};

const PAGE_SIZE = 12;

// ── 内部逻辑组件（使用 useSearchParams） ─────────────────────

function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 从 URL 参数初始化过滤条件
  const initFilters = (): SearchFilters => ({
    keyword: searchParams.get("keyword") ?? "",
    district: searchParams.get("district") ?? "全部",
    roomType: (searchParams.get("roomType") as SearchFilters["roomType"]) ?? "全部",
    priceMin: Number(searchParams.get("priceMin") ?? 0),
    priceMax: Number(searchParams.get("priceMax") ?? 99999),
    platforms: searchParams.get("platforms")
      ? (searchParams.get("platforms")!.split(",") as SearchFilters["platforms"])
      : [],
    moveInDate: searchParams.get("moveInDate") ?? "",
    sortBy: (searchParams.get("sortBy") as SearchFilters["sortBy"]) ?? "date_desc",
  });

  const [filters, setFilters] = useState<SearchFilters>(initFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [result, setResult] = useState<PaginatedListings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 收藏状态
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 详情弹窗
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // 初始化收藏数据
  useEffect(() => {
    setFavoriteIds(getFavoriteIds());
    setFavoriteListings(getFavoriteListings());
  }, []);

  // 获取房源数据
  const fetchListings = useCallback(async (f: SearchFilters, page: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        keyword: f.keyword,
        district: f.district,
        roomType: f.roomType,
        priceMin: String(f.priceMin),
        priceMax: String(f.priceMax),
        platforms: f.platforms.join(","),
        moveInDate: f.moveInDate,
        sortBy: f.sortBy,
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });

      const res = await fetch(`/api/listings?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: PaginatedListings = await res.json();
      setResult(data);
    } catch (err) {
      console.error("获取房源失败:", err);
      setError("加载房源失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 过滤条件或页码变化时重新请求
  useEffect(() => {
    fetchListings(filters, currentPage);
  }, [filters, currentPage, fetchListings]);

  // 过滤条件变化时重置到第1页
  const handleFiltersChange = (partial: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
    setCurrentPage(1);
    // 保存搜索历史
    const updated = { ...filters, ...partial };
    saveSearchHistory(updated);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  // 从搜索历史恢复过滤条件
  const handleHistorySelect = (item: SearchHistoryItem) => {
    setFilters(item.filters);
    setCurrentPage(1);
  };

  // 收藏/取消收藏
  const handleToggleFavorite = (listing: Listing) => {
    const nowFavorite = toggleFavorite(listing);
    setFavoriteIds(getFavoriteIds());
    setFavoriteListings(getFavoriteListings());
    // 更新详情弹窗状态
    if (selectedListing?.id === listing.id) {
      setSelectedListing((prev) => prev ? { ...prev, isFavorite: nowFavorite } : null);
    }
  };

  const handleClearFavorites = () => {
    clearAllFavorites();
    setFavoriteIds([]);
    setFavoriteListings([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <Navbar
        favoritesCount={favoriteIds.length}
        onOpenFavorites={() => setIsDrawerOpen(true)}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* 搜索栏 */}
        <div className="mb-4">
          <SearchBar
            value={filters.keyword}
            onChange={(keyword) => handleFiltersChange({ keyword })}
            onHistorySelect={handleHistorySelect}
          />
        </div>

        {/* 过滤面板 */}
        <div className="mb-6">
          <FilterPanel
            filters={filters}
            onChange={handleFiltersChange}
            onReset={handleReset}
            totalResults={result?.total ?? 0}
          />
        </div>

        {/* 结果头部 */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {!isLoading && result && (
              <span>
                第 <strong className="text-foreground">{(currentPage - 1) * PAGE_SIZE + 1}</strong>
                {" "}–{" "}
                <strong className="text-foreground">
                  {Math.min(currentPage * PAGE_SIZE, result.total)}
                </strong>
                {" "}条，共{" "}
                <strong className="text-foreground">{result.total}</strong> 套
              </span>
            )}
          </div>

          {/* 视图切换 */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md transition-all",
                viewMode === "grid"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="网格视图"
              aria-pressed={viewMode === "grid"}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md transition-all",
                viewMode === "list"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="列表视图"
              aria-pressed={viewMode === "list"}
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 房源列表 */}
        {isLoading ? (
          <ListingSkeletons viewMode={viewMode} count={PAGE_SIZE} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchListings(filters, currentPage)} />
        ) : !result || result.listings.length === 0 ? (
          <EmptyState keyword={filters.keyword} onReset={handleReset} />
        ) : (
          <>
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "flex flex-col gap-3"
              )}
            >
              {result.listings.map((listing, index) => (
                <div
                  key={listing.id}
                  className="fade-in-up"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <ListingCard
                    listing={listing}
                    viewMode={viewMode}
                    isFavorite={favoriteIds.includes(listing.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onOpenDetail={setSelectedListing}
                  />
                </div>
              ))}
            </div>

            {/* 分页 */}
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={result.totalPages}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          </>
        )}

        {/* 底部免责声明 */}
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-center text-xs text-muted-foreground">
            ⚠️ 本平台所有数据均为模拟生成，仅用于产品功能演示，不代表真实房源信息。
            接入真实合规数据请参阅{" "}
            <a href="/COMPLIANCE.md" target="_blank" className="underline hover:text-foreground">
              数据合规声明
            </a>
            。
          </p>
        </div>
      </main>

      {/* 房源详情弹窗 */}
      <DetailModal
        listing={selectedListing}
        isFavorite={selectedListing ? favoriteIds.includes(selectedListing.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onClose={() => setSelectedListing(null)}
      />

      {/* 收藏夹抽屉 */}
      <FavoritesDrawer
        isOpen={isDrawerOpen}
        favorites={favoriteListings}
        onClose={() => setIsDrawerOpen(false)}
        onRemove={handleToggleFavorite}
        onOpenDetail={(listing) => {
          setIsDrawerOpen(false);
          setSelectedListing(listing);
        }}
        onClearAll={handleClearFavorites}
      />
    </div>
  );
}

// ── 页面包裹（Suspense for useSearchParams） ─────────────────

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
            <div className="mb-4 h-12 rounded-xl bg-muted shimmer" />
            <div className="mb-6 h-16 rounded-xl bg-muted shimmer" />
            <ListingSkeletons viewMode="grid" count={12} />
          </div>
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}
