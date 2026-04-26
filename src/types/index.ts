// 核心类型定义 - 觅居平台统一数据模型

export type Platform = "贝壳" | "小红书" | "自如" | "链家" | "安居客";

export type RoomType = "整租" | "合租" | "1室" | "2室" | "3室+";

export type SortOption = "price_asc" | "price_desc" | "date_desc" | "area_asc";

// 核心房源数据模型 - 所有平台统一格式
export interface Listing {
  id: string;
  title: string;
  platform: Platform;
  price: number; // 月租金（元/月）
  area: number; // 面积（平方米）
  roomType: RoomType;
  location: string; // 区域 + 街道
  district: string; // 行政区
  subwayLines?: string[]; // 附近地铁线
  subwayDistance?: number; // 距最近地铁（分钟步行）
  tags: string[]; // 如：近地铁、押一付一、拎包入住
  description: string;
  amenities: string[]; // 设施列表
  images: string[]; // 图片URL（MVP阶段使用占位图）
  originalUrl: string; // 跳转原平台的链接
  publishedAt: string; // ISO 日期字符串
  isFavorite: boolean;
  floor?: string; // 楼层信息
  totalFloors?: number;
  orientation?: string; // 朝向
  decoration?: string; // 装修情况
  landlordType?: "个人" | "中介" | "品牌公寓";
}

// 搜索过滤条件
export interface SearchFilters {
  keyword: string; // 关键词（位置/地铁站/小区）
  district: string; // 行政区
  roomType: RoomType | "全部";
  priceMin: number;
  priceMax: number;
  platforms: Platform[]; // 空数组 = 全部平台
  moveInDate: string; // YYYY-MM-DD or ''
  sortBy: SortOption;
}

// 分页结果
export interface PaginatedListings {
  listings: Listing[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// API 请求参数
export interface ListingsQueryParams extends SearchFilters {
  page: number;
  pageSize: number;
}

// 搜索历史记录
export interface SearchHistoryItem {
  id: string;
  filters: SearchFilters;
  label: string; // 可读描述，如 "朝阳 2室 5000-8000"
  timestamp: string;
}

// 数据适配器接口 - 支持切换真实/模拟数据源
export interface DataAdapter {
  getListings(params: ListingsQueryParams): Promise<PaginatedListings>;
  getListingById(id: string): Promise<Listing | null>;
}

// 平台配置信息
export interface PlatformConfig {
  name: Platform;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
}

// UI 视图模式
export type ViewMode = "grid" | "list";

// LocalStorage 收藏数据
export interface FavoritesStore {
  ids: string[];
  listings: Listing[];
}
