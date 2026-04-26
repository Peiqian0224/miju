// LocalStorage 持久化工具 - 收藏夹 & 搜索历史

import type { Listing, SearchHistoryItem, SearchFilters } from "@/types";
import { generateId, filtersToLabel } from "@/lib/utils";

const FAVORITES_KEY = "miju_favorites";
const HISTORY_KEY = "miju_search_history";
const MAX_HISTORY = 10;

// ─── 收藏夹操作 ───────────────────────────────────────────────

export function getFavoriteIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function isFavorite(id: string): boolean {
  return getFavoriteIds().includes(id);
}

export function toggleFavorite(listing: Listing): boolean {
  const ids = getFavoriteIds();
  const listings = getFavoriteListings();
  const index = ids.indexOf(listing.id);

  if (index > -1) {
    // 取消收藏
    ids.splice(index, 1);
    const updatedListings = listings.filter((l) => l.id !== listing.id);
    persistFavorites(ids, updatedListings);
    return false;
  } else {
    // 添加收藏
    ids.unshift(listing.id);
    listings.unshift({ ...listing, isFavorite: true });
    persistFavorites(ids, listings);
    return true;
  }
}

export function getFavoriteListings(): Listing[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${FAVORITES_KEY}_listings`);
    return raw ? (JSON.parse(raw) as Listing[]) : [];
  } catch {
    return [];
  }
}

function persistFavorites(ids: string[], listings: Listing[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  localStorage.setItem(`${FAVORITES_KEY}_listings`, JSON.stringify(listings));
}

export function clearAllFavorites(): void {
  localStorage.removeItem(FAVORITES_KEY);
  localStorage.removeItem(`${FAVORITES_KEY}_listings`);
}

// ─── 搜索历史操作 ──────────────────────────────────────────────

export function getSearchHistory(): SearchHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as SearchHistoryItem[]) : [];
  } catch {
    return [];
  }
}

export function saveSearchHistory(filters: SearchFilters): void {
  const history = getSearchHistory();
  const label = filtersToLabel(filters);

  // 删除重复项
  const deduped = history.filter((h) => h.label !== label);

  const newItem: SearchHistoryItem = {
    id: generateId(),
    filters,
    label,
    timestamp: new Date().toISOString(),
  };

  const updated = [newItem, ...deduped].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function removeSearchHistoryItem(id: string): void {
  const history = getSearchHistory().filter((h) => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearSearchHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}
