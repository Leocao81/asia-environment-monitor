import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { COUNTRIES, getCountry, getRegion } from '@/lib/countries';
import { readSnapshot, policiesForCountry, tradeForCountry } from '@/lib/data';
import { PolicyList } from '@/components/PolicyList';
import { TradeExplorer } from '@/components/TradeExplorer';
import { LastUpdated } from '@/components/LastUpdated';
import { StatCard } from '@/components/StatCard';
import { formatUSD } from '@/lib/format';

export const revalidate = 21600;

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ code: c.iso2.toLowerCase() }));
}

export async function generateMetadata(
  { params }: { params: { code: string } },
): Promise<Metadata> {
  const country = getCountry(params.code.toUpperCase());
  if (!country) return { title: '国家不存在' };
  return {
    title: `${country.name.zh} · 环境政策与监测设备贸易`,
    description: `${country.name.en} 环境监管政策与监测设备进出口数据。`,
  };
}

const REGION_ACCENT: Record<string, 'sky' | 'emerald' | 'amber' | 'violet'> = {
  'central-asia': 'sky',
  'southeast-asia': 'emerald',
  'south-asia': 'amber',
  'middle-east': 'violet',
};

export default function CountryPage({ params }: { params: { code: string } }) {
  const country = getCountry(params.code.toUpperCase());
  if (!country) notFound();

  const region = getRegion(country.region);
  const snapshot = readSnapshot();
  const policies = policiesForCountry(snapshot, country.iso2);
  const trade = tradeForCountry(snapshot, country.iso2);
  const accent = REGION_ACCENT[country.region];

  const totalValue = trade.reduce((s, t) => s + t.value, 0);
  const importValue = trade.filter((t) => t.flow === 'import').reduce((s, t) => s + t.value, 0);
  const exportValue = trade.filter((t) => t.flow === 'export').reduce((s, t) => s + t.value, 0);

  return (
    <div className="space-y-8">
      <section className="container-page pt-8">
        <nav aria-label="面包屑" className="mb-3 text-xs text-ink-500">
          <Link href="/" className="hover:underline">首页</Link>
          <span className="mx-1.5">/</span>
          {region && (
            <>
              <Link href={`/regions/${region.id}`} className="hover:underline">{region.name.zh}</Link>
              <span className="mx-1.5">/</span>
            </>
          )}
          <span>{country.name.zh}</span>
        </nav>
        <div className="card">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="pill-accent bg-ink-100 text-ink-700 ring-ink-200">{country.iso2} · {country.iso3}</span>
                {region && (
                  <Link href={`/regions/${region.id}`} className="pill hover:bg-ink-100">{region.name.zh}</Link>
                )}
                <span className="pill">{country.currency}</span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{country.name.zh}</h1>
              <p className="text-sm text-ink-500">{country.name.en}</p>
              <p className="mt-3 text-sm text-ink-700">首都 · {country.capital.zh} ({country.capital.en})</p>
            </div>
            <LastUpdated iso={snapshot.generatedAt} />
          </div>
        </div>
      </section>

      <section className="container-page">
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <StatCard label="政策条目" value={`${policies.length}`} accent={accent} />
          <StatCard label="贸易记录" value={`${trade.length}`} accent={accent} />
          <StatCard label="进出口总额" value={formatUSD(totalValue)} accent={accent} />
          <StatCard label="进口 / 出口" value={`${formatUSD(importValue)} / ${formatUSD(exportValue)}`} accent={accent} />
        </div>
      </section>

      <section className="container-page">
        <h2 className="mb-3 text-lg font-semibold">环境监管政策</h2>
        <PolicyList policies={policies} emptyText="该国暂未抓到政策" />
      </section>

      <section className="container-page">
        <TradeExplorer
          records={trade}
          showRegionFilter={false}
          showCountryFilter={false}
          heading={`${country.name.zh}监测设备进出口记录`}
        />
      </section>
    </div>
  );
}