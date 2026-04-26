// /api/listings - 房源搜索 API 路由
// 接受过滤参数，返回分页房源列表

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDataAdapter } from "@/lib/adapters";
import type { ListingsQueryParams, Platform, RoomType, SortOption } from "@/types";

// 请求参数校验 Schema
const QuerySchema = z.object({
  keyword: z.string().default(""),
  district: z.string().default("全部"),
  roomType: z.enum(["全部", "整租", "合租", "1室", "2室", "3室+"]).default("全部"),
  priceMin: z.coerce.number().min(0).default(0),
  priceMax: z.coerce.number().max(999999).default(99999),
  platforms: z
    .string()
    .optional()
    .transform((v) => (v ? (v.split(",") as Platform[]) : [])),
  moveInDate: z.string().default(""),
  sortBy: z
    .enum(["price_asc", "price_desc", "date_desc", "area_asc"])
    .default("date_desc"),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(50).default(12),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const raw = Object.fromEntries(searchParams.entries());

    const parsed = QuerySchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const params: ListingsQueryParams = {
      keyword: parsed.data.keyword,
      district: parsed.data.district,
      roomType: parsed.data.roomType as RoomType | "全部",
      priceMin: parsed.data.priceMin,
      priceMax: parsed.data.priceMax,
      platforms: parsed.data.platforms,
      moveInDate: parsed.data.moveInDate,
      sortBy: parsed.data.sortBy as SortOption,
      page: parsed.data.page,
      pageSize: parsed.data.pageSize,
    };

    const adapter = getDataAdapter();
    const result = await adapter.getListings(params);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store", // 过滤结果不缓存
      },
    });
  } catch (error) {
    console.error("[API /listings] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// 获取单个房源详情
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { id?: string };
    const { id } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Missing listing id" }, { status: 400 });
    }

    const adapter = getDataAdapter();
    const listing = await adapter.getListingById(id);

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error("[API /listings POST] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
