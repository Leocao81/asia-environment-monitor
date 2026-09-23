import type { Metadata } from 'next';
import Link from 'next/link';
import { readSnapshot } from '@/lib/data';
import { COUNTRIES, REGIONS } from '@/lib/countries';
import { TradeExplorer } from '@/components/TradeExplorer';
import { TradeSummaryByCategory } from '@/components/TradeSummaryByCategory';
import { LastUpdated } from '@/components/LastUpdated';
import { StatCard } from '@/components/StatCard';
import { formatUSD } from '@/lib/format';

export const revalidate = 21600;

export const metadata: Metadata = {
  title: '监测设备进出口数据 · 多维筛选与导出',
  description:
    '中亚、东南亚、南亚、中东 39 国环境监测设备进出口记录，支持按点位、设备类型、国家、时间、流向、贸易伙伴筛选，并可导出 Excel。',
};

export default function TradePage() {
  const snapshot = readSnapshot();
  const trade = snapshot.trade;

  const totalValue = trade.reduce((s, t) => s + t.value, 0);
  const importValue = trade.filter((t) => t.flow === 'import').reduce((s, t) => s + t.value, 0);
  const exportValue = trade.filter((t) => t.flow === 'export').reduce((s, t) => s + t.value, 0);
  const quantity = trade.reduce((s, t) => s + t.quantity, 0);
  const countriesN = new Set(trade.map((t) => t.country)).size;
  const sitesN = new Set(trade.map((t) => t.siteName)).size;
  const periods = Array.from(new Set(trade.map((t) => t.period))).sort();
  const range = periods.length ? `${periods[0]} ~ ${periods[periods.length - 1]}` : '—';

  // per-region rollup
  const regionRollup = REGIONS.map((r) => {
    const rows = trade.filter((t) => t.region === r.id);
    return {
      region: r,
      count: rows.length,
      value: rows.reduce((s, t) => s + t.value, 0),
      sites: new Set(rows.map((t) => t.siteName)).size,
    };
  }).filter((x) => x.count > 0);

  return (
    <div className="space-y-8">
      <section className="container-page pt-8 sm:pt-12">
        <nav aria-label="面包屑" className="mb-3 text-xs text-ink-500">
          <Link href="/" className="hover:underline">首页</Link>
          <span className="mx-1.5">/</span>
          <span>监测设备进出口</span>
        </nav>

        <div className="card bg-gradient-to-br from-emerald-50 via-white to-sky-50">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="pill-accent bg-emerald-50 text-emerald-700 ring-emerald-200">贸易数据</span>
                <span className="pill">{trade.length.toLocaleString()} 条记录</span>
                <span className="pill">时间范围 {range}</span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                监测设备进出口数据
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">
                覆盖 {COUNTRIES.length} 个国家的空气质量、水质、土壤、噪声监测仪与排放控制、废物处理装备的进出口记录。
                支持按<strong>监测点位</strong>、<strong>设备类型</strong>、<strong>国家</strong>、<strong>时间</strong>、
                <strong>流向</strong>与<strong>贸易伙伴</strong>多维筛选，并可将筛选结果导出为 Excel 可直接打开的 CSV 文件。
              </p>
            </div>
            <LastUpdated iso={snapshot.generatedAt} />
          </div>
        </div>
      </section>

      <section className="container-page">
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <StatCard label="进出口总额" value={formatUSD(totalValue)} hint={`进口 ${formatUSD(importValue)} · 出口 ${formatUSD(exportValue)}`} accent="emerald" />
          <StatCard label="设备总数量" value={quantity.toLocaleString()} hint="台 / 套" accent="sky" />
          <StatCard label="覆盖国家" value={`${countriesN}`} hint={`共 ${COUNTRIES.length} 国`} accent="amber" />
          <StatCard label="监测点位" value={`${sitesN}`} hint="去重点位数量" accent="violet" />
        </div>
      </section>

      {/* region rollup */}
      <section className="container-page">
        <h2 className="mb-3 text-lg font-semibold">按区域汇总</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {regionRollup.map((x) => (
            <Link
              key={x.region.id}
              href={`/regions/${x.region.id}`}
              className="card hover:shadow-sm transition-shadow"
            >
              <div className="text-sm font-semibold">{x.region.name.zh}</div>
              <div className="mt-1 text-xs text-ink-500">{x.region.name.en}</div>
              <div className="mt-3 text-xl font-semibold tabular-nums">{formatUSD(x.value)}</div>
              <div className="mt-1 text-xs text-ink-500">
                {x.count.toLocaleString()} 条记录 · {x.sites} 个点位
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* main explorer */}
      <section className="container-page">
        <TradeExplorer records={trade} showRegionFilter showCountryFilter heading="全部监测设备进出口记录" />
      </section>

      <section className="container-page">
        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
          <TradeSummaryByCategory records={trade} />
          <div className="card">
            <h3 className="text-sm font-semibold">使用提示</h3>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-ink-700 list-disc pl-4">
              <li>「监测点位」指设备最终部署或服务的场景，如城市空气站、工业园区、流域断面、饮用水源地、声环境点位、港口口岸、实验室等。</li>
              <li>筛选条件可组合使用；点击「重置筛选」一键清空。</li>
              <li>导出的是<strong>当前筛选结果的全部记录</strong>，不受分页影响。</li>
              <li>导出文件为 UTF-8 BOM 编码 CSV，Excel / WPS 双击打开中文不乱码。</li>
              <li>数据每日自动更新，历史归档在仓库的 <code>data/history/</code> 目录。</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}