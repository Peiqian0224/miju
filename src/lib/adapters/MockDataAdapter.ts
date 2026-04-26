// MockDataAdapter - 实现 DataAdapter 接口，使用虚构数据供MVP演示

import type { DataAdapter, Listing, ListingsQueryParams, PaginatedListings } from "@/types";
import { getCachedMockListings } from "./mock-data";

export class MockDataAdapter implements DataAdapter {
  async getListings(params: ListingsQueryParams): Promise<PaginatedListings> {
    // 模拟网络延迟（50-200ms）
    await sleep(50 + Math.random() * 150);

    let listings = getCachedMockListings();

    // ── 过滤逻辑 ─────────────────────────────────────────────

    // 关键词过滤（匹配标题、位置、区域）
    if (params.keyword.trim()) {
      const kw = params.keyword.trim().toLowerCase();
      listings = listings.filter(
        (l) =>
          l.title.toLowerCase().includes(kw) ||
          l.location.toLowerCase().includes(kw) ||
          l.district.toLowerCase().includes(kw) ||
          l.subwayLines?.some((line) => line.includes(kw))
      );
    }

    // 行政区过滤
    if (params.district && params.district !== "全部") {
      listings = listings.filter((l) => l.district === params.district);
    }

    // 房型过滤
    if (params.roomType !== "全部") {
      listings = listings.filter((l) => l.roomType === params.roomType);
    }

    // 价格区间过滤
    if (params.priceMin > 0) {
      listings = listings.filter((l) => l.price >= params.priceMin);
    }
    if (params.priceMax < 99999) {
      listings = listings.filter((l) => l.price <= params.priceMax);
    }

    // 平台过滤
    if (params.platforms.length > 0) {
      listings = listings.filter((l) => params.platforms.includes(l.platform));
    }

    // ── 排序逻辑 ─────────────────────────────────────────────

    listings = sortListings(listings, params.sortBy);

    // ── 分页 ─────────────────────────────────────────────────

    const total = listings.length;
    const totalPages = Math.ceil(total / params.pageSize);
    const start = (params.page - 1) * params.pageSize;
    const paginated = listings.slice(start, start + params.pageSize);

    return {
      listings: paginated,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages,
    };
  }

  async getListingById(id: string): Promise<Listing | null> {
    await sleep(30);
    const listing = getCachedMockListings().find((l) => l.id === id);
    return listing ?? null;
  }
}

// ── 排序辅助 ───────────────────────────────────────────────────

function sortListings(listings: Listing[], sortBy: string): Listing[] {
  return [...listings].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "date_desc":
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      case "area_asc":
        return a.area - b.area;
      default:
        return 0;
    }
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
