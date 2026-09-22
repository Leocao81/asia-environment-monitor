import { LastUpdated } from '@/components/LastUpdated';
import { readSnapshot } from '@/lib/data';

export const revalidate = 21600;

export const metadata = {
  title: '关于本项目 · 数据来源与采集方法',
  description: '亚洲环境监测台的数据来源、采集方法、技术架构与免责说明。',
};

export default function AboutPage() {
  const snap = readSnapshot();
  return (
    <div className="container-page py-10 sm:py-14">
      <article className="prose max-w-3xl">
        <h1>关于本项目</h1>
        <p>
          <strong>亚洲环境监测台 (Asia Environment Monitor)</strong> 是一个面向研究者、出口企业、政策分析师和环境合规团队的每日自动更新站点，
          覆盖中亚、东南亚、南亚与中东 39 个国家的环境监管政策与监测设备贸易数据。
        </p>

        <h2 id="methodology">数据采集方法</h2>
        <p>本项目的更新链路包含 3 个阶段：</p>
        <ol>
          <li>
            <strong>采集（Crawl）</strong>：GitHub Actions 每天 <code>02:00</code> 触发，
            <code>scripts/scrape-policies.mjs</code> 与 <code>scripts/scrape-trade.mjs</code> 并行运行，
            抓取公开政策源与海关公开数据。任一源失败都不会阻断流程 —— 失败的国家会用确定性种子数据补齐。
          </li>
          <li>
            <strong>存储（Commit）</strong>：抓取结果写入 <code>data/snapshot.json</code>，并把每日归档备份到 <code>data/history/</code>。
            脚本会自动 commit &amp; push 到主分支，触发 Vercel 重新部署。
          </li>
          <li>
            <strong>发布（Build）</strong>：Next.js ISR 每 6 小时增量再生缓存（<code>export const revalidate = 21600</code>），
            既能享受静态站点的速度，也能保证在 GitHub Actions 之外仍有兜底更新。
          </li>
        </ol>

        <h2>当前数据来源</h2>
        <ul>
          <li>各国家生态环境部、环境保护署、统计局官方公告（占位接入，待生产替换）</li>
          <li>UN Comtrade API（HS 9027 / 8421 / 8479 类目：监测仪、排放控制、废物处理设备）</li>
          <li>RSS / Atom 订阅（如各国政府公报、环境 NGO 摘要）</li>
          <li>缺失国家：使用确定性种子数据填充，保证站点始终呈现可比较框架</li>
        </ul>

        <h2 id="license">数据使用与免责</h2>
        <ul>
          <li>本项目仅做信息聚合与索引，不构成任何投资、合规或政策建议。</li>
          <li>所有政策原文版权归原作者所有，链接指向官方源。</li>
          <li>贸易数据可能与官方海关存在统计口径差异，使用前请以各国海关公布数据为准。</li>
        </ul>

        <h2>技术栈</h2>
        <p>
          Next.js 14 (App Router) + TypeScript + Tailwind CSS，托管在 Vercel。
          数据采集用 Node.js 18+ 自带 <code>fetch</code>，无第三方依赖，便于 fork &amp; 自定义。
        </p>
      </article>

      <aside className="mt-8 max-w-3xl">
        <LastUpdated iso={snap.generatedAt} note={snap.sourceNote} />
      </aside>
    </div>
  );
}