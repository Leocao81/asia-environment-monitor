import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { REGIONS, getRegion, countriesByRegion } from '@/lib/countries';
import { readSnapshot, policiesForRegion, tradeForRegion } from '@/lib/data';
import { PolicyList } from '@/components/PolicyList';
import { TradeTable } from '@/components/TradeTable';
import { CountryGrid } from '@/components/CountryGrid';
import { LastUpdated } from '@/components/LastUpdated';
import { StatCard } from '@/components/StatCard';
import { TradeSummaryByCategory } from '@/components/TradeSummaryByCategory';
import { formatUSD } from '@/lib/format';

export const revalidate = 21600;

export function generateStaticParams() {
  return REGIONS.map((r) => ({ id: r.id }));
}

const TONE: Record<string, { text: string; dot: string; chip: string }> = {
  'central-asia':    { text: 'text-sky-700',     dot: 'bg-sky-500',     chip: 'bg-sky-50 text-sky-700 ring-sky-200' },
  'southeast-asia':  { text: 'text-emerald-700', dot: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  'south-asia':      { text: 'text-amber-700',   dot: 'bg-amber-500',   chip: 'bg-amber-50 text-amber-700 ring-amber-200' },
  'middle-east':     { text: 'text-violet-700',  dot: 'bg-violet-500',  chip: 'bg-violet-50 text-violet-700 ring-violet-200' },
};

export async function generateMetadata(
  { params }: { params: { id: string } },
): Promise<Metadata> {
  const region = getRegion(params.id as any);
  if (!region) return { title: '区域不存在' };
  return {
    title: `${region.name.zh} · 环境政策与监测设备贸易`,
    description: region.description.zh,
  };
}

export default function RegionPage({ params }: { params: { id: string } }) {
  const region = getRegion(params.id as any);
  if (!region) notFound();

  const snapshot = readSnapshot();
  const policies = policiesForRegion(snapshot, region.id);
  const trade = tradeForRegion(snapshot, region.id);
  const countries = countriesByRegion(region.id);
  const tone = TONE[region.id];

  // Per-country aggregates
  const policyCountByCountry: Record<string, number> = {};
  const tradeValueByCountry: Record<string, number> = {};
  for (const p of policies) policyCountByCountry[p.country] = (policyCountByCountry[p.country] ?? 0) + 1;
  for (const t of trade) tradeValueByCountry[t.country] = (tradeValueByCountry[t.country] ?? 0) + t.value;

  const totalValue = trade.reduce((s, t) => s + t.value, 0);
  const importValue = trade.filter((t) => t.flow === 'import').reduce((s, t) => s + t.value, 0);
  const exportValue = trade.filter((t) => t.flow === 'export').reduce((s, t) => s + t.value, 0);

  return (
    <div className="space-y-10">
      {/* Region hero */}
      <section className="container-page pt-8 sm:pt-12">
        <nav aria-label="面包屑" className="mb-3 text-xs text-ink-500">
          <Link href="/" className="hover:underline">首页</Link>
          <span className="mx-1.5">/</span>
          <span>{region.name.zh}</span>
        </nav>
        <div className={`card bg-gradient-to-br ${region.id === 'central-asia' ? 'from-sky-50' : region.id === 'southeast-asia' ? 'from-emerald-50' : region.id === 'south-asia' ? 'from-amber-50' : 'from-violet-50'} to-white`}>
          <div className="flex items-start gap-3">
            <span aria-hidden className={`mt-2 inline-block h-3 w-3 rounded-full ${tone.dot}`} />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`pill-accent ${tone.chip}`}>{region.short.zh} · {region.short.en}</span>
                <span className="pill">{countries.length} 个国家</span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{region.name.zh}</h1>
              <p className="mt-1 text-sm text-ink-500">{region.name.en}</p>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-700">{region.description.zh}</p>
            </div>
          </div>
          <div className="mt-5">
            <LastUpdated iso={snapshot.generatedAt} note={snapshot.sourceNote} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-page">
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <StatCard label="政策条目" value={`${policies.length}`} accent={region.id === 'central-asia' ? 'sky' : region.id === 'southeast-asia' ? 'emerald' : region.id === 'south-asia' ? 'amber' : 'violet'} />
          <StatCard label="贸易记录" value={`${trade.length}`} accent={region.id === 'central-asia' ? 'sky' : region.id === 'southeast-asia' ? 'emerald' : region.id === 'south-asia' ? 'amber' : 'violet'} />
          <StatCard label="进出口总额" value={formatUSD(totalValue)} hint={`进口 ${formatUSD(importValue)} · 出口 ${formatUSD(exportValue)}`} accent={region.id === 'central-asia' ? 'sky' : region.id === 'southeast-asia' ? 'emerald' : region.id === 'south-asia' ? 'amber' : 'violet'} />
          <StatCard label="覆盖国家" value={`${countries.length}`} hint={`${region.short.en}`} accent={region.id === 'central-asia' ? 'sky' : region.id === 'southeast-asia' ? 'emerald' : region.id === 'south-asia' ? 'amber' : 'violet'} />
        </div>
      </section>

      {/* Country grid */}
      <section className="container-page">
        <h2 className="mb-3 text-lg font-semibold">{region.name.zh}国家</h2>
        <CountryGrid
          countries={countries}
          policyCountByCountry={policyCountByCountry}
          tradeValueByCountry={tradeValueByCountry}
        />
      </section>

      {/* Policies */}
      <section className="container-page">
        <h2 className="mb-3 text-lg font-semibold">环境监管政策</h2>
        <PolicyList policies={policies} emptyText="该区域暂未抓到政策" />
      </section>

      {/* Trade */}
      <section className="container-page">
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="mb-3 text-lg font-semibold">监测设备进出口</h2>
            <TradeTable records={trade} emptyText="该区域暂未抓到贸易数据" />
          </div>
          <TradeSummaryByCategory records={trade} />
        </div>
      </section>
    </div>
  );
}