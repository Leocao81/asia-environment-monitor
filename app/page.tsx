import Link from 'next/link';
import { REGIONS, COUNTRIES, countriesByRegion } from '@/lib/countries';
import { readSnapshot, policiesForRegion, tradeForRegion } from '@/lib/data';
import { RegionCard } from '@/components/RegionCard';
import { PolicyList } from '@/components/PolicyList';
import { LastUpdated } from '@/components/LastUpdated';
import { StatCard } from '@/components/StatCard';
import { formatUSD } from '@/lib/format';

// ISR — revalidate every 6 hours so the page stays fresh between GH Actions runs.
export const revalidate = 21600;

export default function HomePage() {
  const snapshot = readSnapshot();

  // Per-region aggregates
  const regionStats = REGIONS.map((region) => {
    const policies = policiesForRegion(snapshot, region.id);
    const trade = tradeForRegion(snapshot, region.id);
    const totalValueUSD = trade.reduce((s, t) => s + t.value, 0);
    const countries = countriesByRegion(region.id);
    return {
      region,
      policyCount: policies.length,
      tradeCount: trade.length,
      totalValueUSD,
      countryCount: countries.length,
    };
  });

  const totalPolicies = regionStats.reduce((s, r) => s + r.policyCount, 0);
  const totalTrade = regionStats.reduce((s, r) => s + r.tradeCount, 0);
  const totalValue = regionStats.reduce((s, r) => s + r.totalValueUSD, 0);
  const importValue = snapshot.trade.filter((t) => t.flow === 'import').reduce((s, t) => s + t.value, 0);
  const exportValue = snapshot.trade.filter((t) => t.flow === 'export').reduce((s, t) => s + t.value, 0);

  // Trade explorer highlights
  const siteTypesN = new Set(snapshot.trade.map((t) => t.siteType)).size;
  const uniqueSites = new Set(snapshot.trade.map((t) => t.siteName)).size;

  // Show top 6 most-recent policies across all regions
  const latestPolicies = [...snapshot.policies]
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, 6);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="container-page pt-10 sm:pt-14">
        <div className="card border-0 bg-gradient-to-br from-sky-50 via-white to-violet-50 p-6 sm:p-10 ring-0 shadow-none">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-ink-500">
                Daily Auto-Updated · 每日自动更新
              </p>
              <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
                亚洲环境监测台
                <span className="block text-lg font-normal text-ink-500 sm:text-xl">
                  Asia Environment Monitor
                </span>
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-ink-700 sm:text-base">
                一站式追踪中亚、东南亚、南亚与中东 39 个国家的环境监管政策动态，以及空气、水、土壤、噪声监测设备与排放控制装备的进出口数据。每天 UTC 02:00 由 GitHub Actions 自动采集并发布。
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/regions/central-asia" className="btn-primary">浏览区域</Link>
                <Link href="/about" className="btn-secondary">关于数据来源</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:min-w-[260px]">
              <StatCard label="覆盖国家" value={`${COUNTRIES.length}`} hint="中亚 5 · 东南亚 11 · 南亚 8 · 中东 15" />
            </div>
          </div>
          <div className="mt-6">
            <LastUpdated iso={snapshot.generatedAt} note={snapshot.sourceNote} />
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="container-page">
        <h2 className="sr-only">关键指标</h2>
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <StatCard label="政策条目" value={`${totalPolicies}`} hint="过去 30 天滚动" accent="sky" />
          <StatCard label="贸易记录" value={`${totalTrade}`} hint="上一个月滚动" accent="emerald" />
          <StatCard label="进出口总额" value={formatUSD(totalValue)} hint="USD · 滚动月度" accent="amber" />
          <StatCard label="进口 / 出口" value={`${formatUSD(importValue)} / ${formatUSD(exportValue)}`} accent="violet" />
        </div>
      </section>

      {/* Region grid */}
      <section className="container-page">
        <header className="flex items-end justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">四大区域概览</h2>
            <p className="text-sm text-ink-500">点击区域卡片查看该区域的政策与进出口数据</p>
          </div>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {regionStats.map((s) => (
            <RegionCard
              key={s.region.id}
              region={s.region}
              policyCount={s.policyCount}
              tradeCount={s.tradeCount}
              totalValueUSD={s.totalValueUSD}
              countryCount={s.countryCount}
            />
          ))}
        </div>
      </section>

      {/* Trade explorer CTA */}
      <section className="container-page">
        <div className="card bg-gradient-to-br from-emerald-50 via-white to-sky-50">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold sm:text-2xl">监测设备进出口数据</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                共 <strong>{totalTrade.toLocaleString()}</strong> 条记录、覆盖 {COUNTRIES.length} 个国家、
                <strong>{siteTypesN}</strong> 类监测点位。支持按
                <strong>点位</strong>、<strong>设备类型</strong>、<strong>国家</strong>、<strong>时间</strong>、
                <strong>流向</strong>、<strong>贸易伙伴</strong>多维筛选，并可导出 Excel。
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/trade" className="btn-primary">打开筛选项与导出</Link>
                <Link href="/regions/southeast-asia" className="btn-secondary">从区域进入</Link>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-3 lg:w-[340px]">
              <StatCard label="进出口总额" value={formatUSD(totalValue)} accent="emerald" />
              <StatCard label="监测点位" value={`${siteTypesN} 类`} hint={`${uniqueSites} 个具体点位`} accent="sky" />
            </dl>
          </div>
        </div>
      </section>

      {/* Latest policies */}
      <section className="container-page">
        <header className="flex items-end justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">最新环境政策</h2>
            <p className="text-sm text-ink-500">跨区域最近 30 天滚动更新</p>
          </div>
          <Link href="/regions/central-asia" className="text-sm text-sky-700 hover:underline">查看全部 →</Link>
        </header>
        <PolicyList policies={latestPolicies} emptyText="暂未抓到任何政策，详见“关于”页" showRegion />
      </section>
    </div>
  );
}