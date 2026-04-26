# COMPLIANCE.md — 觅居 (RentAggregator) 数据合规策略

## ⚖️ 重要声明 / Important Legal Notice

觅居 (RentAggregator) 是一个聚合搜索工具，**不直接抓取或镜像任何第三方平台的内容**。
RentAggregator is an aggregation search tool that **does NOT directly scrape or mirror content from any third-party platform**.

---

## 🚫 禁止的数据获取方式

以下方式在技术和法律层面均存在严重风险，本项目**明确禁止**：

| 方式 | 风险 |
|------|------|
| Puppeteer/Playwright 绕过反爬 | 违反平台 ToS，涉嫌计算机欺诈 |
| 未授权接口爬取 | 违反《网络安全法》《数据安全法》 |
| 镜像第三方完整数据 | 版权侵权，著作权法第 47 条 |
| 绕过 CAPTCHA / 登录验证 | 违反《计算机信息网络国际联网安全保护管理办法》 |

---

## ✅ 合规的数据获取路径

### 1. 官方开放 API（推荐）
- **贝壳找房**：联系 ke.com 商务合作，申请经纪人/开发商 API 接入
- **链家**：lianjia.com 开放平台（需签署数据使用协议）
- **安居客**：anjuke.com 官方数据服务合作

### 2. RSS / Atom 公开内容订阅
部分平台提供公开 RSS 或 sitemap，可依据其使用条款解析非个人信息字段。

### 3. 用户主动提交
- 提供房源录入表单，用户将自己的房源信息上传至平台
- 满足"信息发布平台"定性，规避聚合抓取风险

### 4. 授权数据服务商
- 合法数据中间商（如万得资讯、同策研究）提供经过授权的房产数据集
- 与持牌房产信息服务商签署数据许可协议

### 5. 用户授权 OAuth 整合
- 用户通过平台官方 OAuth 授权本应用访问其个人收藏/已看房源
- 仅处理用户自己的数据，不汇聚平台全量数据

---

## 🏗️ 代码架构合规设计

```
lib/adapters/
├── types.ts          # DataAdapter 接口定义
├── mock-data.ts      # 开发/演示用模拟数据（不含真实平台数据）
├── index.ts          # 适配器工厂，通过环境变量切换
└── [real-adapter].ts # 接入真实合规 API 时实现此文件
```

切换真实数据源只需：
```bash
NEXT_PUBLIC_DATA_SOURCE=real  # 环境变量控制
```

并实现 `RealDataAdapter` 类（对接已获授权的 API）。

---

## 📋 UI 必须展示的免责声明

在搜索结果页面底部、关于页面，以及首次使用弹窗中，必须包含以下文字（可调整措辞）：

> **免责声明**：本平台展示的房源信息仅供参考，数据来源于用户自主上传或合规授权渠道。
> 本平台不对信息的准确性、完整性及时效性作出保证。查看原始房源请点击"查看原始链接"跳转至对应平台。
> 本平台与贝壳找房、小红书、自如等平台不存在官方关联关系。

> **Disclaimer**: Listings shown are for reference only, sourced from user submissions or licensed data channels.
> We make no guarantees as to accuracy, completeness, or timeliness. Click "View on [Platform]" to see the original listing.
> This platform has no official affiliation with Beike, Xiaohongshu, Ziroom, or any other listed platform.

---

## 🔄 MVP 阶段数据说明

当前 MVP 使用 `MockDataAdapter` 生成完全虚构的演示数据：
- 所有房源 ID、价格、地址均为程序随机生成
- 不包含任何真实用户信息或平台数据
- 仅用于产品功能验证，不对外发布

---

## 📞 法律联系

如对数据使用有异议，请联系：legal@miju-example.com（示例，请替换为真实联系方式）

---

*最后更新：2024 年 | 适用法域：中华人民共和国*
