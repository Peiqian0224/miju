"use client";

// 收藏夹页面 - 展示用户保存的所有房源

import { useState, useEffect } from "react";
import { Heart, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  getFavoriteListings,
  getFavoriteIds,
  toggleFavorite,
  clearAllFavorites,
} from "@/lib/store";
import { ListingCard } from "@/components/listing-card";
import { DetailModal } from "@/components/detail-modal";
import type { Listing } from "@/types";

export default function SavedPage() {
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFavorites(getFavoriteListings());
    setFavoriteIds(getFavoriteIds());
  }, []);

  function handleToggleFavorite(listing: Listing) {
    toggleFavorite(listing);
    const newIds = getFavoriteIds();
    const newListings = getFavoriteListings();
    setFavoriteIds(newIds);
    setFavorites(newListings);
  }

  function handleClearAll() {
    if (confirm("确认清空所有收藏？")) {
      clearAllFavorites();
      setFavorites([]);
      setFavoriteIds([]);
    }
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              返回搜索
            </Link>
            <span className="text-muted-foreground">|</span>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
              <h1 className="text-lg font-bold">我的收藏</h1>
              {favorites.length > 0 && (
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-600">
                  {favorites.length}
                </span>
              )}
            </div>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              清空收藏
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-rose-50">
              <Heart className="h-10 w-10 text-rose-300" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">还没有收藏</h2>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              在搜索页面点击房源卡片上的心形图标，将心仪的房源保存到这里
            </p>
            <Link
              href="/search"
              className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
            >
              去找房
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((listing, i) => (
              <div
                key={listing.id}
                className="fade-in-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <ListingCard
                  listing={listing}
                  viewMode="grid"
                  isFavorite={favoriteIds.includes(listing.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenDetail={setSelectedListing}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedListing && (
        <DetailModal
          listing={selectedListing}
          isFavorite={favoriteIds.includes(selectedListing.id)}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </div>
  );
}
