// 首页 - 引导用户进入搜索

import Link from "next/link";
import { MapPin, Search, Heart, Shield, ArrowRight, Building2 } from "lucide-react";

const FEATURES = [
  {
    icon: <Search className="h-6 w-6" />,
    title: "多平台聚合",
    desc: "整合贝壳、小红书、自如等主流平台，一站找房不错过",
  },
  {
    icon: <Building2 className="h-6 w-6" />,
    title: "精准过滤",
    desc: "按区域、房型、价格、地铁距离多维度筛选，精准匹配需求",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "本地收藏",
    desc: "收藏心仪房源、保存搜索历史，随时回顾不遗忘",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "合规透明",
    desc: "仅展示合规渠道数据，清晰标注来源，点击跳转原平台核实",
  },
];

const POPULAR_SEARCHES = [
  { label: "朝阳 · 整租 · 5000以下", href: "/search?district=朝阳区&roomType=整租&priceMax=5000" },
  { label: "海淀 · 近地铁 · 2室", href: "/search?district=海淀区&roomType=2室&keyword=近地铁" },
  { label: "自如 · 1室 · 押一付一", href: "/search?platforms=自如&roomType=1室&keyword=押一付一" },
  { label: "徐汇 · 合租 · 3000以下", href: "/search?district=徐汇区&roomType=合租&priceMax=3000" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* 导航栏 */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight">觅居</span>
              <span className="text-[10px] text-muted-foreground">租房聚合搜索</span>
            </div>
          </div>
          <Link
            href="/search"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            开始找房
          </Link>
        </div>
      </header>

      {/* 英雄区 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 sm:py-28">
        {/* 装饰背景圆 */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/8" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-jade/8" />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            MVP 演示版 · 数据为模拟生成
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            觅居 —— 一站式
            <span className="text-primary">租房搜索</span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground">
            聚合贝壳、小红书、自如等多平台房源，精准筛选，高效找到理想住所
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/search"
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:opacity-90 hover:shadow-xl hover:shadow-primary/30"
            >
              <Search className="h-5 w-5" />
              立即搜索房源
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/saved"
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Heart className="h-4 w-4" />
              我的收藏
            </Link>
          </div>
        </div>
      </section>

      {/* 热门搜索 */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h2 className="mb-4 text-sm font-medium text-muted-foreground">热门搜索</h2>
        <div className="flex flex-wrap gap-2">
          {POPULAR_SEARCHES.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            >
              <Search className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      {/* 功能特色 */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground">为什么选择觅居</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feat) => (
            <div
              key={feat.title}
              className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {feat.icon}
              </div>
              <h3 className="mb-1.5 font-semibold text-foreground">{feat.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl bg-primary/8 border border-primary/20 p-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-foreground">准备好找房了吗？</h2>
          <p className="mb-6 text-muted-foreground">浏览 60+ 模拟房源，体验觅居的筛选与收藏功能</p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90"
          >
            立即开始
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="text-center text-xs text-muted-foreground">
            © 2024 觅居 RentAggregator · MVP 演示版 · 所有数据均为模拟生成，不构成真实房源信息 ·{" "}
            <a href="/COMPLIANCE.md" className="underline hover:text-foreground" target="_blank">
              数据合规声明
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
