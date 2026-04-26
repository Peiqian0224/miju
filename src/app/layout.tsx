import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "觅居 · 一站式租房搜索",
  description: "聚合贝壳、小红书、自如等主流平台房源，一键找到理想住所",
  keywords: ["租房", "找房", "北京租房", "上海租房", "贝壳", "自如", "小红书租房"],
  authors: [{ name: "觅居团队" }],
  robots: "index, follow",
  openGraph: {
    title: "觅居 · 一站式租房搜索",
    description: "聚合多平台房源，精准找到理想住所",
    locale: "zh_CN",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f04d13" },
    { media: "(prefers-color-scheme: dark)", color: "#e13509" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased"
        )}
      >
        {children}
      </body>
    </html>
  );
}
