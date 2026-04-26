// 模拟数据生成器 - 生成真实感的中国租房数据（仅用于MVP演示）
// 所有数据完全虚构，不包含真实用户或平台信息

import type { Listing, Platform, RoomType } from "@/types";

const PLATFORMS: Platform[] = ["贝壳", "小红书", "自如", "链家", "安居客"];

const ROOM_TYPES: RoomType[] = ["整租", "合租", "1室", "2室", "3室+"];

// 北京真实区域和地铁站数据
const BEIJING_LOCATIONS = [
  { district: "朝阳区", location: "三里屯", subwayLines: ["10号线"], subwayDistance: 8 },
  { district: "朝阳区", location: "国贸CBD", subwayLines: ["1号线", "10号线"], subwayDistance: 5 },
  { district: "朝阳区", location: "望京", subwayLines: ["14号线", "15号线"], subwayDistance: 12 },
  { district: "朝阳区", location: "酒仙桥", subwayLines: ["14号线"], subwayDistance: 15 },
  { district: "朝阳区", location: "劲松", subwayLines: ["10号线"], subwayDistance: 6 },
  { district: "海淀区", location: "中关村", subwayLines: ["4号线", "10号线"], subwayDistance: 7 },
  { district: "海淀区", location: "五道口", subwayLines: ["13号线"], subwayDistance: 3 },
  { district: "海淀区", location: "西二旗", subwayLines: ["13号线"], subwayDistance: 10 },
  { district: "海淀区", location: "上地", subwayLines: ["13号线"], subwayDistance: 8 },
  { district: "海淀区", location: "知春路", subwayLines: ["10号线", "13号线"], subwayDistance: 5 },
  { district: "丰台区", location: "马家堡", subwayLines: ["4号线"], subwayDistance: 9 },
  { district: "丰台区", location: "方庄", subwayLines: ["5号线"], subwayDistance: 14 },
  { district: "西城区", location: "西单", subwayLines: ["1号线", "4号线"], subwayDistance: 4 },
  { district: "西城区", location: "德胜门", subwayLines: ["2号线"], subwayDistance: 11 },
  { district: "东城区", location: "东直门", subwayLines: ["2号线", "13号线"], subwayDistance: 6 },
  { district: "东城区", location: "北新桥", subwayLines: ["5号线"], subwayDistance: 8 },
  { district: "通州区", location: "北苑", subwayLines: ["6号线"], subwayDistance: 18 },
  { district: "昌平区", location: "回龙观", subwayLines: ["13号线"], subwayDistance: 20 },
  { district: "大兴区", location: "天宫院", subwayLines: ["4号线"], subwayDistance: 25 },
  { district: "顺义区", location: "顺义城区", subwayLines: [], subwayDistance: undefined },
];

// 上海真实区域数据
const SHANGHAI_LOCATIONS = [
  { district: "浦东新区", location: "陆家嘴", subwayLines: ["2号线"], subwayDistance: 6 },
  { district: "浦东新区", location: "张江高科", subwayLines: ["2号线"], subwayDistance: 8 },
  { district: "徐汇区", location: "徐家汇", subwayLines: ["1号线", "9号线", "11号线"], subwayDistance: 5 },
  { district: "静安区", location: "静安寺", subwayLines: ["2号线", "7号线"], subwayDistance: 7 },
  { district: "黄浦区", location: "人民广场", subwayLines: ["1号线", "2号线", "8号线"], subwayDistance: 4 },
  { district: "长宁区", location: "中山公园", subwayLines: ["2号线", "3号线", "4号线"], subwayDistance: 9 },
  { district: "普陀区", location: "曹杨路", subwayLines: ["3号线", "4号线"], subwayDistance: 12 },
  { district: "闵行区", location: "莘庄", subwayLines: ["1号线", "5号线"], subwayDistance: 15 },
];

const ALL_LOCATIONS = [...BEIJING_LOCATIONS, ...SHANGHAI_LOCATIONS];

// 常见标签池
const TAG_POOL = [
  "近地铁", "押一付一", "拎包入住", "独立卫浴", "朝南",
  "精装修", "有电梯", "近商圈", "24小时热水", "可养宠物",
  "押二付一", "配套齐全", "采光好", "隔音好", "随时看房",
  "品牌公寓", "集中式公寓", "近大学", "近学校", "无中介费",
  "可短租", "独立厨房", "有阳台", "近医院", "停车方便",
];

// 设施池
const AMENITY_POOL = [
  "空调", "洗衣机", "冰箱", "热水器", "宽带", "天然气",
  "床", "衣柜", "书桌", "沙发", "电视", "微波炉",
  "烟机灶具", "暖气（集体供暖）", "地暖", "中央空调",
  "洗碗机", "烘干机", "咖啡机", "投影仪",
];

// 朝向选项
const ORIENTATIONS = ["南", "北", "东", "西", "南北通透", "东南", "西南"];

// 装修情况
const DECORATIONS = ["精装修", "简装修", "豪华装修", "毛坯（带基础家具）", "拎包入住"];

// 房东类型
const LANDLORD_TYPES: Array<"个人" | "中介" | "品牌公寓"> = ["个人", "中介", "品牌公寓"];

// 根据区域和房型生成合理价格范围
function generatePrice(
  district: string,
  roomType: RoomType,
  platform: Platform
): number {
  // 基础价格矩阵（元/月）
  const basePrice: Record<string, number> = {
    国贸CBD: 7000, 三里屯: 6500, 西单: 5500, 陆家嘴: 7500,
    徐家汇: 6000, 静安寺: 7000, 中关村: 5500, 望京: 5000,
    五道口: 5800, 回龙观: 2800, 天宫院: 2500, 顺义城区: 2600,
    马家堡: 4000, 方庄: 3800, 北新桥: 4200, 东直门: 5200,
    德胜门: 4800, 知春路: 5000, 上地: 5200, 西二旗: 4800,
  };

  const locationName = district.split(",")[0];
  let base = basePrice[locationName] || 3500;

  // 房型倍数
  const roomMultiplier: Record<RoomType, number> = {
    合租: 0.45, "1室": 1.0, 整租: 1.1, "2室": 1.7, "3室+": 2.5,
  };
  base *= roomMultiplier[roomType];

  // 平台差异（品牌公寓略贵）
  if (platform === "自如") base *= 1.08;
  if (platform === "小红书") base *= 0.95;

  // 随机浮动 ±15%
  const variation = 0.85 + Math.random() * 0.3;
  const price = Math.round((base * variation) / 100) * 100;
  return Math.max(1200, price);
}

// 生成面积（平方米）
function generateArea(roomType: RoomType): number {
  const ranges: Record<RoomType, [number, number]> = {
    合租: [10, 20],
    "1室": [30, 55],
    整租: [40, 80],
    "2室": [55, 90],
    "3室+": [80, 140],
  };
  const [min, max] = ranges[roomType];
  return Math.round(min + Math.random() * (max - min));
}

// 生成房源标题
function generateTitle(
  roomType: RoomType,
  location: string,
  district: string,
  tags: string[]
): string {
  const templates = [
    `${location}精品${roomType}·${tags[0] || "随时入住"}`,
    `${district}${location}附近 ${roomType} 诚意出租`,
    `【${roomType}】${location}核心位置 ${tags[0] || "采光佳"}`,
    `${location}周边 ${roomType}出租 ${tags.slice(0, 2).join(" ")}`,
    `整洁温馨${roomType} · ${location}步行可达商圈`,
    `${district}${roomType}房源直租 ${tags[0] || "押一付一"}`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

// 生成房源描述
function generateDescription(
  roomType: RoomType,
  location: string,
  area: number,
  amenities: string[]
): string {
  return `本房源位于${location}核心地段，交通便利，生活配套完善。房屋面积${area}平方米，${roomType}出租。` +
    `室内装修精良，配备${amenities.slice(0, 4).join("、")}等完善设施。` +
    `小区环境优美，物业管理规范，安全有保障。` +
    `周边有超市、餐厅、银行等生活配套，生活十分便利。` +
    `诚意出租，价格面议，欢迎实地看房。`;
}

// 生成楼层信息
function generateFloor(): { floor: string; totalFloors: number } {
  const total = Math.floor(6 + Math.random() * 28);
  const current = Math.floor(1 + Math.random() * total);
  return {
    floor: `${current}层`,
    totalFloors: total,
  };
}

// 随机取数组中的 n 个不重复元素
function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// 生成随机日期（过去90天内）
function randomRecentDate(): string {
  const days = Math.floor(Math.random() * 90);
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

// 占位图 URL（使用公开 placeholder 服务）
function generateImageUrls(count: number): string[] {
  const seeds = ["room1", "apartment", "living", "bedroom", "kitchen"];
  return Array.from({ length: count }, (_, i) => {
    const width = 800 + i * 100;
    const height = 500 + i * 50;
    const seed = seeds[i % seeds.length];
    // 使用 picsum 图片占位（随机建筑/室内照片）
    return `https://picsum.photos/seed/${seed}${i}/800/500`;
  });
}

// ─── 主生成函数 ───────────────────────────────────────────────

export function generateMockListings(count: number = 60): Listing[] {
  return Array.from({ length: count }, (_, index) => {
    const locationData = ALL_LOCATIONS[index % ALL_LOCATIONS.length];
    const platform = PLATFORMS[index % PLATFORMS.length];
    const roomType = ROOM_TYPES[Math.floor(Math.random() * ROOM_TYPES.length)];
    const price = generatePrice(locationData.location, roomType, platform);
    const area = generateArea(roomType);
    const tags = pickRandom(TAG_POOL, 3 + Math.floor(Math.random() * 3));
    const amenities = pickRandom(AMENITY_POOL, 6 + Math.floor(Math.random() * 6));
    const { floor, totalFloors } = generateFloor();
    const title = generateTitle(roomType, locationData.location, locationData.district, tags);
    const description = generateDescription(roomType, locationData.location, area, amenities);

    // 添加近地铁标签
    if (locationData.subwayDistance && locationData.subwayDistance <= 15 && !tags.includes("近地铁")) {
      tags.unshift("近地铁");
    }

    return {
      id: `listing_${(index + 1).toString().padStart(4, "0")}`,
      title,
      platform,
      price,
      area,
      roomType,
      location: `${locationData.district} · ${locationData.location}`,
      district: locationData.district,
      subwayLines: locationData.subwayLines,
      subwayDistance: locationData.subwayDistance,
      tags: tags.slice(0, 5),
      description,
      amenities,
      images: generateImageUrls(3 + Math.floor(Math.random() * 3)),
      // MVP原始链接指向平台首页（合规：不伪造具体房源URL）
      originalUrl: getplatformUrl(platform),
      publishedAt: randomRecentDate(),
      isFavorite: false,
      floor,
      totalFloors,
      orientation: ORIENTATIONS[Math.floor(Math.random() * ORIENTATIONS.length)],
      decoration: DECORATIONS[Math.floor(Math.random() * DECORATIONS.length)],
      landlordType: LANDLORD_TYPES[Math.floor(Math.random() * LANDLORD_TYPES.length)],
    } satisfies Listing;
  });
}

function getplatformUrl(platform: Platform): string {
  const urls: Record<Platform, string> = {
    贝壳: "https://www.ke.com",
    小红书: "https://www.xiaohongshu.com",
    自如: "https://www.ziroom.com",
    链家: "https://www.lianjia.com",
    安居客: "https://www.anjuke.com",
  };
  return urls[platform];
}

// 导出单例（缓存，避免每次请求重新生成）
let _cachedListings: Listing[] | null = null;

export function getCachedMockListings(): Listing[] {
  if (!_cachedListings) {
    _cachedListings = generateMockListings(60);
  }
  return _cachedListings;
}
