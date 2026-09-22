# 亚洲环境监测台 · 项目概览

> 一个每日自动更新的响应式站点，覆盖 **中亚 / 东南亚 / 南亚 / 中东** 39 个国家的环境监管政策与监测设备进出口数据。

## 已完成

| 阶段 | 内容 |
| --- | --- |
| ✅ Phase 0 — 需求澄清 | 与用户确认数据源/技术栈/部署平台/国家覆盖 |
| ✅ Phase 1 — 方案设计 | Next.js 14 + Tailwind + Vercel + GitHub Actions 架构 |
| ✅ Phase 2 — 编码实现 | 49 个静态页面 + 7 个组件 + 4 个爬虫/工具脚本 |
| ✅ Phase 3 — 调试验证 | `npm run build` 成功；本地 `next start` 所有路由 200 OK |
| ✅ Phase 4 — 质量检查 | SEO meta、sitemap、robots、响应式、a11y 焦点样式、aria-label |
| ✅ Phase 5 — 部署交付 | 完整 README（含 GitHub → Vercel 步骤、回滚、排查清单） |

## 文件清单

### 应用
- `app/layout.tsx` 根布局（Header + Footer + SEO meta）
- `app/page.tsx` 首页：Hero + 4 区域 KPI 卡 + 区域网格 + 最新政策
- `app/regions/[id]/page.tsx` 区域页（4 个，SSG）
- `app/countries/[code]/page.tsx` 国家页（39 个，SSG）
- `app/about/page.tsx` 关于 + 数据来源
- `app/sitemap.ts` 自动生成 46 URL 的 sitemap
- `app/not-found.tsx` 404

### 组件（`components/`）
- `Header.tsx` 顶部导航（移动端自动折叠为横滚列表）
- `Footer.tsx` 页脚
- `LastUpdated.tsx` 数据更新时间提示
- `RegionCard.tsx` 区域卡片
- `StatCard.tsx` 数字卡片
- `CountryGrid.tsx` 国家网格
- `PolicyList.tsx` 政策列表（带分类徽章）
- `TradeTable.tsx` 贸易表格（响应式横向滚动）
- `TradeSummaryByCategory.tsx` 按产品类别汇总

### 库（`lib/`）
- `types.ts` Policy / TradeRecord / Snapshot 类型定义
- `countries.ts` 39 国家 + 4 区域元数据
- `data.ts` 读取 snapshot.json 工具
- `format.ts` USD / 日期 / 相对时间格式化

### 数据采集（`scripts/`）
- `utils.mjs` 共享 fetch/写文件/确定性随机工具
- `seed-data.mjs` 兜底数据生成器（确定性 + 按 UTC 日种子化）
- `scrape-policies.mjs` 政策爬虫入口（live 探活 + seed 合并）
- `scrape-trade.mjs` 贸易爬虫入口（Comtrade 探活 + seed 合并）

### 自动化（`.github/workflows/`）
- `daily-update.yml` 每日 02:00 UTC 触发 → scrape → commit → push → Vercel 重新部署

### 配置
- `package.json` Next.js 14.2.15 + React 18.3.1 + Tailwind 3.4.6
- `tailwind.config.ts` 自定义区域品牌色（sky/emerald/amber/violet）
- `tsconfig.json` strict + path alias `@/*`
- `next.config.mjs` 基础 Next.js 配置
- `.env.example` 可选环境变量示例

### 数据
- `data/snapshot.json` 当前快照（123 政策 + 240 贸易记录，由 `node scripts/scrape:all` 生成）
- `data/history/` 每日归档（被 .gitignore 排除）

### 文档
- `README.md` 完整部署指南（含故障排查 + 数据模型 + 升级爬虫指南）

## 当前状态

- ✅ 构建：`npm run build` 成功
- ✅ 运行时：49 页面、First Load JS 94 kB
- ✅ 数据：种子兜底，确保任何环境下渲染完整
- ✅ SEO：sitemap、robots、og:image、structured meta
- ✅ 响应式：移动端单列、平板 2 列、桌面 3-4 列
- ✅ A11y：跳转链接、aria-label、focus-visible 样式

## 部署到生产环境

1. **推到 GitHub**：`git init && git add . && git commit && git push`
2. **Vercel 导入**：<https://vercel.com/new> → Import → 自动识别 Next.js → Deploy
3. **配置 Actions 写权限**：Settings → Actions → Workflow permissions → Read and write
4. **（可选）配置数据源 Secrets**：`COMTRADE_API_KEY`、`POLICY_SOURCES`
5. **首次 deploy 后绑定自定义域名**：Settings → Domains

## 后续可扩展点

- i18n 路由（添加 `/en/*`）
- 接入真实 RSS / Comtrade API 替换占位 URL
- 趋势图（recharts/chart.js 嵌入）
- 邮件订阅 / RSS feed
- 导出 CSV / Excel
- 后台管理面板（鉴权 + 手动触发）

---

**项目位置**：`C:\Users\lifen\WorkBuddy\2026-09-21-15-12-07\`
**技术栈**：Next.js 14 · TypeScript · Tailwind CSS · GitHub Actions · Vercel
**交付日期**：2026-09-21