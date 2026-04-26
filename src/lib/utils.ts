import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { Platform, PlatformConfig, SearchFilters } from "@/types";

// Tailwind 类名合并工具
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 格式化月租金显示
export function formatPrice(price: number): string {
  if (price >= 10000) {
    return `${(price / 10000).toFixed(1)}万/月`;
  }
  return `${price.toLocaleString("zh-CN")}/月`;
}

// 格式化面积
export function formatArea(area: number): string {
  return `${area}㎡`;
}

// 相对时间（中文）
export function formatRelativeTime(isoDate: string): string {
  try {
    return formatDistanceToNow(parseISO(isoDate), { addSuffix: true, locale: zhCN });
  } catch {
    return "未知时间";
  }
}

// 平台配置信息（颜色、标签样式）
export const PLATFORM_CONFIG: Record<Platform, PlatformConfig> = {
  贝壳: {
    name: "贝壳",
    color: "#00AE66",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    icon: "🐚",
  },
  小红书: {
    name: "小红书",
    color: "#FF2442",
    bgColor: "bg-rose-50",
    textColor: "text-rose-700",
    icon: "📕",
  },
  自如: {
    name: "自如",
    color: "#FF6900",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    icon: "🏠",
  },
  链家: {
    name: "链家",
    color: "#0066FF",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    icon: "🔗",
  },
  安居客: {
    name: "安居客",
    color: "#F5A623",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    icon: "🏡",
  },
};

// 价格区间预设
export const PRICE_PRESETS = [
  { label: "不限", min: 0, max: 99999 },
  { label: "2000以下", min: 0, max: 2000 },
  { label: "2000-4000", min: 2000, max: 4000 },
  { label: "4000-6000", min: 4000, max: 6000 },
  { label: "6000-10000", min: 6000, max: 10000 },
  { label: "10000以上", min: 10000, max: 99999 },
];

// 北京主要行政区
export const BEIJING_DISTRICTS = [
  "全部",
  "朝阳区",
  "海淀区",
  "丰台区",
  "西城区",
  "东城区",
  "通州区",
  "昌平区",
  "大兴区",
  "顺义区",
  "石景山区",
  "门头沟区",
  "怀柔区",
  "平谷区",
  "密云区",
  "延庆区",
];

// 上海主要行政区
export const SHANGHAI_DISTRICTS = [
  "全部",
  "浦东新区",
  "徐汇区",
  "静安区",
  "黄浦区",
  "长宁区",
  "普陀区",
  "虹口区",
  "杨浦区",
  "闵行区",
  "宝山区",
  "嘉定区",
  "松江区",
  "青浦区",
  "奉贤区",
  "金山区",
  "崇明区",
];

// 将过滤条件序列化为可读标签（用于搜索历史）
export function filtersToLabel(filters: SearchFilters): string {
  const parts: string[] = [];

  if (filters.keyword) parts.push(filters.keyword);
  if (filters.district && filters.district !== "全部") parts.push(filters.district);
  if (filters.roomType !== "全部") parts.push(filters.roomType);

  const priceLabel = buildPriceLabel(filters.priceMin, filters.priceMax);
  if (priceLabel) parts.push(priceLabel);

  if (filters.platforms.length > 0 && filters.platforms.length < 5) {
    parts.push(filters.platforms.join("/"));
  }

  return parts.join(" · ") || "全部房源";
}

function buildPriceLabel(min: number, max: number): string {
  if (min === 0 && max === 99999) return "";
  if (min === 0) return `${max}以下`;
  if (max === 99999) return `${min}以上`;
  return `${min}-${max}元`;
}

// 生成唯一 ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// 防抖函数
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// 截断文本
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}
