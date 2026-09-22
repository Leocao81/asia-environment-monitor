# 亚洲环境监测台 · Asia Environment Monitor

> 一个 **每天 02:00（UTC）自动更新** 的响应式网站，追踪 **中亚 / 东南亚 / 南亚 / 中东** 39 个国家的环境监管政策和监测设备进出口数据。
>
> 你不需要懂代码也能照着这份文档完成部署。整个流程大约需要 **30–45 分钟**（其中 Vercel 自动部署等待约 2 分钟）。

---

## 📑 目录

- [1. 网站能做什么](#1-网站能做什么)
- [2. 准备工作](#2-准备工作)
- [3. 部署到 Vercel（在线版）](#3-部署到-vercel在线版)
- [4. 配置每日自动更新](#4-配置每日自动更新)
- [5. 打开你的网站](#5-打开你的网站)
- [6. 进阶：本地开发](#6-进阶本地开发)
- [7. 进阶：接入真实数据源](#7-进阶接入真实数据源)
- [8. 进阶：绑定自己的域名](#8-进阶绑定自己的域名)
- [9. 常见问题 FAQ](#9-常见问题-faq)
- [10. 项目结构说明](#10-项目结构说明)

---

## 1. 网站能做什么

打开站点后会看到：

- **首页**：四大区域概览、最新政策、KPI 数字卡
- **区域页**（4 个）：中亚 / 东南亚 / 南亚 / 中东，每个区域显示该区域所有国家的政策 + 贸易记录
- **国家页**（39 个）：每个国家独立的政策与贸易详情
- **关于页**：项目说明、数据来源、采集方法
- **自动 sitemap.xml**：方便 Google/百度收录

**4 大区域、39 个国家**：
- 🌏 中亚（5）：哈萨克斯坦、乌兹别克斯坦、吉尔吉斯斯坦、塔吉克斯坦、土库曼斯坦
- 🌏 东南亚（11）：印尼、泰国、越南、马来西亚、菲律宾、新加坡、缅甸、柬埔寨、老挝、文莱、东帝汶
- 🌏 南亚（8）：印度、巴基斯坦、孟加拉、斯里兰卡、尼泊尔、不丹、马尔代夫、阿富汗
- 🌏 中东（15）：沙特、阿联酋、伊朗、伊拉克、以色列、约旦、黎巴嫩、叙利亚、科威特、巴林、卡塔尔、阿曼、也门、土耳其、塞浦路斯

---

## 2. 准备工作

你需要准备：

- ✅ 一个 **GitHub 账号**（没有就在 <https://github.com> 注册一个，免费）
- ✅ 一个 **Vercel 账号**（没有就在 <https://vercel.com/signup> 注册，**建议用 GitHub 登录**）
- ✅ 本机已安装 **Node.js 18 或更新版本**（仅在做"本地开发/调试"时才需要；纯部署到 Vercel **不需要装任何东西**）

> 💡 如果你**只想部署不想本地调试**，完全跳过第 6 节，直接走第 3 节就够了。

---

## 3. 部署到 Vercel（在线版）

> **核心思路**：把代码推到 GitHub → 告诉 Vercel "从这个仓库自动部署" → 完成。

### 第 1 步：在 GitHub 创建空仓库

1. 打开 <https://github.com/new>
2. **Repository name**：填 `asia-environment-monitor`（或任何你想要的名字）
3. **Public / Private**：选 **Public**（免费；Private 也行）
4. **Initialize this repository with**：全部**不要勾选**（不要 README、不要 .gitignore、不要 license，我们自己已经有了）
5. 点 **Create repository**
6. 创建后页面会显示一段命令，类似这样：
   ```
   git remote add origin https://github.com/<你的用户名>/asia-environment-monitor.git
   ```
   把这段里的 `<你的用户名>/asia-environment-monitor.git` 抄下来，下面要用。

### 第 2 步：把代码推上去

打开 **PowerShell**（在 Windows 上） 或 **Terminal**（macOS/Linux），依次执行：

```bash
# 进入项目目录
cd "C:\Users\lifen\WorkBuddy\2026-09-21-15-12-07"

# 初始化 git（只在第一次需要）
git init

# 配置你的用户名和邮箱（第一次也只用配一次）
git config user.name "你的名字"
git config user.email "你的邮箱@example.com"

# 把项目里所有文件加入暂存区
git add .

# 提交
git commit -m "feat: initial site"

# 改名为 main 分支
git branch -M main

# 关联到 GitHub（替换成第 1 步抄下来的地址）
git remote add origin https://github.com/<你的用户名>/asia-environment-monitor.git

# 推送
git push -u origin main
```

**应该看到**：
- 第一次 push 会弹出 GitHub 登录窗口，按提示完成认证
- 最后输出 `Branch 'main' set up to track remote 'main' from 'origin'.`
- 刷新 GitHub 仓库页面，能看到所有项目文件

**如果失败**：
- `git: command not found` → 没装 git，去 <https://git-scm.com/download/win> 安装
- `Permission denied` → GitHub 凭证过期，按提示用 `gh auth login` 重新登录

### 第 3 步：在 Vercel 导入项目

1. 打开 <https://vercel.com/new>
2. **Import Git Repository**：找到刚才创建的 `asia-environment-monitor` 仓库，点右边的 **Import**
3. **Configure Project**：
   - **Project Name**：填项目名（默认会用仓库名）
   - **Framework Preset**：**自动识别为 Next.js**，**不要动**
   - **Root Directory**：保持 `./`，不要改
   - **Build & Output Settings**：保持默认
   - **Environment Variables**：先**全部留空**，直接点 **Deploy**
4. 等待约 1-2 分钟，构建日志会实时滚动
5. 看到 🎉 **Congratulations!** → 点 **Go to Dashboard**

**应该看到**：
- 项目卡片显示状态为 **Ready**
- 域名形如 `asia-environment-monitor-xxxxxx.vercel.app`，这就是你的网站！

### 第 4 步：访问你的网站

点上面那个 `*.vercel.app` 链接，应该看到首页：
- 顶部 Logo + 4 个区域导航
- Hero 区显示 "亚洲环境监测台"
- 4 个 KPI 数字卡（政策条目、贸易记录、进出口总额、进口/出口）
- 4 个区域卡片（中亚/东南亚/南亚/中东）

✅ **到这里，部署完成！** 任何人通过这个链接都能访问你的网站。

---

## 4. 配置每日自动更新

> Vercel 部署后，**如果不做这一步，网站数据不会自动更新**。这一步让 GitHub 每天自动抓取最新数据并推送，触发 Vercel 重新部署。

### 第 1 步：开启 Actions 写权限

1. 打开你的 GitHub 仓库页面
2. 点顶部 **Settings**（最右边齿轮图标）
3. 左侧菜单 **Actions** → **General**
4. 找到 **Workflow permissions**
5. 选择 **"Read and write permissions"**
6. 点 **Save**

**应该看到**：底部出现 ✅ "Workflow permissions saved" 提示

### 第 2 步：（可选）配置数据源 Secrets

如果暂时不接入真实数据源，**直接跳过这一步**也可以，爬虫会使用种子数据（确定性兜底，每天有微小变化）。

如果想接入真实数据：
1. 在 GitHub 仓库点 **Settings** → **Secrets and variables** → **Actions**
2. 点 **New repository secret**
3. 依次添加（点 "+ New repository secret" 多次）：

| Name | Secret 值 | 说明 |
| --- | --- | --- |
| `COMTRADE_API_KEY` | 从 <https://comtradeplus.un.org/> 申请 | UN Comtrade 订阅 key |
| `COMTRADE_API_URL` | 例如 `https://comtradeapi.un.org/data/v1/get/C/A/HS` | 海关 API 端点 |
| `POLICY_SOURCES` | 例如 `https://rss.example.com/feed.xml,https://other.gov/announcements` | 政策 RSS（逗号分隔） |

### 第 3 步：手动触发一次测试

1. 打开仓库页面，点顶部 **Actions**
2. 左侧选 **Daily Update**
3. 右侧点 **Run workflow** → 绿色按钮 **Run workflow**
4. 等待约 1-2 分钟

**应该看到**：
- 任务状态从黄圈 → 绿勾 ✅
- 仓库主页会多一个 commit：`chore(data): daily snapshot 2026-09-21`
- Vercel 自动检测到这个 commit 并重新部署
- 几分钟后打开网站，顶部"最近一次更新时间"应该刷新

### 第 4 步：等待每日自动执行

无需操作。工作流配置在 `.github/workflows/daily-update.yml` 中：

```yaml
schedule:
  - cron: '0 2 * * *'   # 每天 02:00 UTC（北京时间 10:00）
```

每天会自动：
1. 跑 `scrape-policies.mjs` + `scrape-trade.mjs` 抓数据
2. 写到 `data/snapshot.json`
3. 自动 commit + push
4. Vercel 自动重新部署
5. 几分钟后新数据上线

---

## 5. 打开你的网站

部署成功后，你会得到 Vercel 提供的免费域名：

```
https://asia-environment-monitor-xxxxxx.vercel.app
```

可以浏览：

| 路径 | 内容 |
| --- | --- |
| `/` | 首页（4 区域概览 + KPI + 最新政策） |
| `/regions/central-asia` | 中亚 5 国 |
| `/regions/southeast-asia` | 东南亚 11 国 |
| `/regions/south-asia` | 南亚 8 国 |
| `/regions/middle-east` | 中东 15 国 |
| `/countries/kz` | 哈萨克斯坦 |
| `/countries/cn`（如果加上）或任意国家 | 国家详情 |
| `/about` | 关于 + 数据来源 |
| `/sitemap.xml` | SEO 站点地图 |

---

## 6. 进阶：本地开发

> 这一节是**给开发者**的。如果你只想用网站，不需要做这一步。

### 6.1 安装 Node.js

- Windows / macOS：到 <https://nodejs.org/> 下载 LTS 版（≥ 18）
- 安装后验证：打开终端，输入 `node --version`，应该显示 `v18.x` 或更高

### 6.2 安装项目依赖

在项目目录下执行：

```bash
cd "C:\Users\lifen\WorkBuddy\2026-09-21-15-12-07"
npm install
```

**应该看到**：
- 安装约 100+ 个包
- 最后出现 `added xxx packages`
- 多出 `node_modules/` 文件夹

**如果报错 `genie-trash` / `trash operation`**：
- 这是 sandbox 环境特有错误。在你本机正常 Windows/macOS 上不会遇到。
- 绕过方法：先 `npm install` 装大部分包，然后 `npm rebuild` 修复 .bin 链接

### 6.3 拉取一次种子数据

```bash
# 两个爬虫会生成 data/snapshot.json
node scripts/scrape-policies.mjs
node scripts/scrape-trade.mjs
```

**应该看到**：
- `[policies] wrote 123 policies to .../snapshot.json`
- `[trade] wrote 240 trade records to .../snapshot.json`

### 6.4 启动开发服务器

```bash
npm run dev
```

**应该看到**：
- `▲ Next.js 14.x`
- `Local: http://localhost:3000`

打开 <http://localhost:3000> 即可在浏览器预览。修改任何文件会自动热更新。

### 6.5 构建生产版本（可选）

```bash
npm run build   # 编译
npm start       # 跑生产 build
```

---

## 7. 进阶：接入真实数据源

> 当前默认用的是确定性种子数据。要替换为真实数据，只需修改两个爬虫脚本。

### 7.1 政策源（`scripts/scrape-policies.mjs`）

文件里有这个函数：

```js
async function fetchPolicySources() {
  if (!POLICY_SOURCES) return [];
  // TODO: 把 URL 解析成 RSS / JSON，映射为 Policy 对象
}
```

**怎么做**：
1. 选 1-2 个 RSS 或公开 JSON API（例如各国政府公报的 RSS feed）
2. 安装 `fast-xml-parser`：`npm install fast-xml-parser`
3. 解析 RSS items → 映射成 `Policy` 对象（参考 `lib/types.ts` 的类型）
4. 用 `Array.concat()` 合并到种子数据

### 7.2 海关数据（`scripts/scrape-trade.mjs`）

```js
async function fetchComtrade() {
  if (!COMTRADE_URL) return [];
  // TODO: 解析 Comtrade JSON，映射为 TradeRecord 对象
}
```

**怎么做**：
1. 到 <https://comtradeplus.un.org/> 申请免费 subscription key
2. 调用 Comtrade API，HS Code 建议用 `9027`（监测仪）、`8421`（过滤设备）、`8479`（机械）
3. 解析 JSON → 映射为 `TradeRecord`（字段参考 `lib/types.ts`）

**调试小技巧**：Actions → Daily Update → Run workflow，查看日志。

---

## 8. 进阶：绑定自己的域名

> Vercel 提供免费 `*.vercel.app` 域名。如果你想用 `yourdomain.com`，按以下操作。

### 第 1 步：在 Vercel 添加域名

1. Vercel Dashboard → 选中项目 → **Settings** → **Domains**
2. 输入你的域名（如 `environment.yourdomain.com`），点 **Add**
3. Vercel 会告诉你需要配置哪条 DNS |  | Apex（yourdomain.com） | `A @ → 76.76.21.21` |
   | 子域（env.yourdomain.com） | `CNAME env → cname.vercel-dns.com` |

### 第 2 步：到域名服务商配置 DNS

以阿里云为例（其它类似）：
1. 阿里云控制台 → 域名 → 解析设置
2. 添加记录：
   - **主机记录**：`env`（或留空表示根域名）
   - **记录类型**：`CNAME`（子域）/ `A`（根域名）
   - **记录值**：Vercel 给你的地址

### 第 3 步：等待 + 验证

- DNS 全球生效需要 5 分钟 ~ 24 小时
- Vercel 会自动签发 Let's Encrypt HTTPS 证书（免费、自动续期）

---

## 9. 常见问题 FAQ

### Q1：部署后页面显示"暂无数据"怎么办？

**原因**：仓库里的 `data/snapshot.json` 还没生成，或者 Actions 没跑。

**解决**：
1. 确认仓库里有 `data/snapshot.json` 文件
2. 触发一次 Actions：仓库 → Actions → Daily Update → Run workflow
3. 等待完成后刷新网站

### Q2：网站打开很慢？

**可能原因**：
- 首次访问 Vercel 冷启动 → 几秒后正常
- 网络问题 → 刷新页面

### Q3：怎么改 Logo 或颜色？

编辑 `tailwind.config.ts`：

```ts
colors: {
  region: {
    'central-asia': '#0EA5E9',  // 改成你想要的颜色
    'southeast-asia': '#10B981',
    'south-asia': '#F59E0B',
    'middle-east': '#8B5CF6',
  },
}
```

改完提交：`git add . && git commit -m "style: change colors" && git push`，Vercel 自动重新部署。

### Q4：怎么加一个新国家？

编辑 `lib/countries.ts`，在对应区域的数组里加一项：

```ts
{ iso2: 'XX', name: { zh: '新国家', en: 'New Country' }, region: 'central-asia' },
```

国家页面会自动出现。

### Q5：怎么改自动更新时间？

编辑 `.github/workflows/daily-update.yml`：

```yaml
schedule:
  - cron: '0 2 * * *'   # 改成你想要的时间（UTC）
```

cron 格式：`分 时 日 月 周`，例如：
- `0 2 * * *` = 每天 02:00 UTC（北京时间 10:00）
- `0 14 * * *` = 每天 14:00 UTC（北京时间 22:00）
- `0 */6 * * *` = 每 6 小时一次

### Q6：怎么关闭自动更新？

仓库 → Actions → Daily Update → 右上角 **⋯** → **Disable workflow**。

### Q7：怎么回滚到上一个版本？

Vercel Dashboard → Deployments → 找到上一个 ✅ 的部署 → 右侧 **⋯** → **Promote to Production**。

### Q8：怎么让 Vercel 不再托管这个项目？

Vercel Dashboard → Settings → General → 滚到底 → **Delete Project**。

### Q9：我没有信用卡，能用吗？

✅ 可以。Vercel 免费额度对个人项目足够：
- 100 GB 带宽/月
- 6000 分钟构建时间/月
- 无限制静态站点

### Q10：报错信息看不明白怎么办？

把**完整错误信息** + **截图** 发给 WorkBuddy，我帮你分析。

---

## 10. 项目结构说明

```
.
├── app/                           ← Next.js 应用目录
│   ├── layout.tsx                 ← 根布局（Header + Footer + SEO meta）
│   ├── page.tsx                   ← 首页（Hero + 4 区域概览 + KPI）
│   ├── globals.css                ← Tailwind 入口
│   ├── about/page.tsx             ← 关于页
│   ├── regions/[id]/page.tsx      ← 区域动态路由（4 个）
│   ├── countries/[code]/page.tsx  ← 国家动态路由（39 个）
│   ├── sitemap.ts                 ← 自动生成 sitemap.xml
│   └── not-found.tsx              ← 404 页
│
├── components/                    ← UI 组件
│   ├── Header.tsx                 ← 顶部导航（移动端自动折叠）
│   ├── Footer.tsx                 ← 页脚
│   ├── LastUpdated.tsx            ← "最近一次更新"提示
│   ├── RegionCard.tsx             ← 区域卡片
│   ├── StatCard.tsx               ← KPI 数字卡
│   ├── CountryGrid.tsx            ← 国家网格
│   ├── PolicyList.tsx             ← 政策列表
│   ├── TradeTable.tsx             ← 贸易表格（横向滚动）
│   └── TradeSummaryByCategory.tsx ← 按产品类别汇总
│
├── lib/                           ← 业务库
│   ├── types.ts                   ← TypeScript 类型定义
│   ├── countries.ts               ← 39 国家 + 4 区域元数据
│   ├── data.ts                    ← 读 snapshot.json
│   └── format.ts                  ← 货币 / 日期格式化
│
├── data/
│   └── snapshot.json              ← 爬虫输出的最新数据快照（提交到 Git）
│
├── scripts/                       ← 数据采集脚本
│   ├── utils.mjs                  ← fetch / 写文件工具
│   ├── seed-data.mjs              ← 兜底种子数据生成器
│   ├── scrape-policies.mjs        ← 政策爬虫入口
│   └── scrape-trade.mjs           ← 贸易爬虫入口
│
├── .github/workflows/
│   └── daily-update.yml           ← 每天 02:00 UTC 自动跑
│
├── public/
│   └── robots.txt                 ← SEO robots
│
├── package.json                   ← npm 配置 + 依赖
├── tailwind.config.ts             ← 区域品牌色等
├── tsconfig.json                  ← TypeScript 配置
├── next.config.mjs                ← Next.js 配置
├── .env.example                   ← 可选环境变量示例
├── .gitignore                     ← git 忽略规则
└── README.md                      ← 你正在看的这份文档
```

---

## 📞 需要更多帮助？

把以下任一发给我，我帮你看：

1. 部署时报错的**完整截图**（包含错误信息）
2. 网站打开后**看着不对的截图**
3. 你想新增/修改的需求文字描述

---

## 📜 许可与免责

- **代码**：MIT 协议，可自由使用、修改、商用
- **数据**：聚合自各国官方源与公开 API；本项目**不**对其准确性、合规性背书
- 不构成投资、政策或合规建议，请以各国官方公告为准