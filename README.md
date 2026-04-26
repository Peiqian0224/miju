# 觅居 (RentAggregator) — MVP

一站式租房聚合搜索平台，整合贝壳、小红书、自如等多平台房源。

> ⚠️ **当前为 MVP 演示版**：所有房源数据均为程序随机生成，不包含真实平台数据。  
> 接入真实数据请参阅 [COMPLIANCE.md](./COMPLIANCE.md)。

---

## 🚀 快速启动

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 访问应用
open http://localhost:3000
```

---

## 📁 项目结构

```
src/
├── app/
│   ├── layout.tsx              # 根布局（元数据、字体）
│   ├── page.tsx                # 首页（引导 + 功能介绍）
│   ├── search/
│   │   └── page.tsx            # 搜索主页面（核心功能）
│   ├── saved/
│   │   └── page.tsx            # 收藏夹页面
│   └── api/
│       └── listings/
│           └── route.ts        # 房源搜索 API（GET + POST）
├── components/
│   ├── navbar.tsx              # 顶部导航栏
│   ├── search-bar.tsx          # 关键词搜索（防抖 + 历史）
│   ├── filter-panel.tsx        # 多维度过滤面板
│   ├── listing-card.tsx        # 房源卡片（网格 + 列表双模式）
│   ├── detail-modal.tsx        # 房源详情弹窗（图片轮播 + 设施）
│   ├── favorites-drawer.tsx    # 收藏夹侧边抽屉
│   ├── listing-skeleton.tsx    # 骨架屏加载占位
│   ├── pagination.tsx          # 分页组件
│   ├── platform-badge.tsx      # 平台标签（贝壳/小红书/自如等）
│   └── empty-state.tsx         # 空状态 & 错误状态
├── lib/
│   ├── adapters/
│   │   ├── index.ts            # 适配器工厂（环境变量切换）
│   │   ├── mock-data.ts        # 60 条模拟数据生成器
│   │   └── MockDataAdapter.ts  # 模拟数据适配器（过滤/排序/分页）
│   ├── store/
│   │   └── index.ts            # LocalStorage（收藏 + 搜索历史）
│   └── utils.ts                # 工具函数（格式化、防抖、平台配置）
├── types/
│   └── index.ts                # 全局 TypeScript 类型定义
└── styles/
    └── globals.css             # 全局样式（设计令牌、动画）
```

---

## ✨ 功能列表

| 功能 | 说明 |
|------|------|
| 🔍 统一搜索 | 关键词搜索（位置/地铁站/小区），300ms 防抖 |
| 🗂️ 多维过滤 | 行政区、房型、价格区间、平台、入住日期 |
| 📊 排序 | 最新发布、价格从低/高、面积 |
| 🖼️ 双视图 | 网格卡片 / 列表行 自由切换 |
| 📋 详情弹窗 | 图片轮播、设施清单、地铁信息、跳转原平台 |
| ❤️ 收藏夹 | 侧边抽屉 + 独立页面，LocalStorage 持久化 |
| 🕐 搜索历史 | 最近 10 条搜索记录，一键重新执行 |
| 📱 响应式 | 移动端优先，兼容平板/桌面 |
| ♿ 无障碍 | ARIA 标签、键盘导航、焦点管理 |
| ⚡ 骨架屏 | 加载期间显示 shimmer 占位动效 |

---

## 🔧 环境变量

```bash
# .env.local
NEXT_PUBLIC_DATA_SOURCE=mock   # 使用模拟数据（默认）
# NEXT_PUBLIC_DATA_SOURCE=real  # 切换至真实 API（需实现 RealDataAdapter）
```

---

## 🔌 接入真实数据

1. 在 `src/lib/adapters/` 新建 `RealDataAdapter.ts`，实现 `DataAdapter` 接口：

```typescript
import type { DataAdapter, ListingsQueryParams, PaginatedListings, Listing } from "@/types";

export class RealDataAdapter implements DataAdapter {
  async getListings(params: ListingsQueryParams): Promise<PaginatedListings> {
    // 调用已授权的合规 API
    const res = await fetch(`https://your-api.com/listings?...`);
    return res.json();
  }

  async getListingById(id: string): Promise<Listing | null> {
    const res = await fetch(`https://your-api.com/listings/${id}`);
    return res.json();
  }
}
```

2. 在 `src/lib/adapters/index.ts` 中启用：

```typescript
case "real":
  return new RealDataAdapter();
```

3. 设置环境变量 `NEXT_PUBLIC_DATA_SOURCE=real`

---

## 📦 生产构建

```bash
npm run build
npm start
```

---

## 🧹 代码质量

```bash
npm run lint      # ESLint 检查
npm run format    # Prettier 格式化
```

---

## ⚖️ 数据合规

请阅读 [COMPLIANCE.md](./COMPLIANCE.md) 了解：
- 禁止的数据获取方式
- 合规的 API 接入路径
- UI 必须展示的免责声明模板

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict)
- **UI**: Tailwind CSS + Radix UI primitives + Lucide icons
- **Forms/Validation**: React Hook Form + Zod
- **Storage**: LocalStorage (MVP)
- **Data**: MockDataAdapter → swap to RealDataAdapter

---

*觅居 MVP · 仅供产品演示，所有数据虚构*
