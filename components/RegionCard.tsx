import Link from 'next/link';
import type { Region } from '@/lib/countries';

type Props = {
  region: Region;
  policyCount: number;
  tradeCount: number;
  totalValueUSD: number;
  countryCount: number;
};

const TONE: Record<Region['id'], { ring: string; text: string; soft: string }> = {
  'central-asia':    { ring: 'hover:ring-sky-400',     text: 'text-sky-700',     soft: 'bg-sky-50' },
  'southeast-asia':  { ring: 'hover:ring-emerald-400', text: 'text-emerald-700', soft: 'bg-emerald-50' },
  'south-asia':      { ring: 'hover:ring-amber-400',   text: 'text-amber-700',   soft: 'bg-amber-50' },
  'middle-east':     { ring: 'hover:ring-violet-400',  text: 'text-violet-700',  soft: 'bg-violet-50' },
};

const DOT: Record<Region['id'], string> = {
  'central-asia':    'bg-sky-500',
  'southeast-asia':  'bg-emerald-500',
  'south-asia':      'bg-amber-500',
  'middle-east':     'bg-violet-500',
};

import { formatUSD } from '@/lib/format';

export function RegionCard({ region, policyCount, tradeCount, totalValueUSD, countryCount }: Props) {
  const tone = TONE[region.id];
  return (
    <Link href={`/regions/${region.id}`} className={`card-link flex flex-col gap-4 ${tone.ring}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span aria-hidden className={`inline-block h-2.5 w-2.5 rounded-full ${DOT[region.id]}`} />
            <h3 className="text-lg font-semibold tracking-tight">{region.name.zh}</h3>
            <span className="text-xs text-ink-500">{region.name.en}</span>
          </div>
          <p className="mt-1 text-sm text-ink-700 line-clamp-2">{region.description.zh}</p>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-2 text-center">
        <div className={`rounded-lg ${tone.soft} py-2`}>
          <dt className="text-[11px] uppercase tracking-wider text-ink-500">国家</dt>
          <dd className="text-base font-semibold">{countryCount}</dd>
        </div>
        <div className={`rounded-lg ${tone.soft} py-2`}>
          <dt className="text-[11px] uppercase tracking-wider text-ink-500">政策</dt>
          <dd className="text-base font-semibold">{policyCount}</dd>
        </div>
        <div className={`rounded-lg ${tone.soft} py-2`}>
          <dt className="text-[11px] uppercase tracking-wider text-ink-500">贸易</dt>
          <dd className="text-base font-semibold">{tradeCount}</dd>
        </div>
      </dl>

      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-500">进出口总金额</span>
        <span className={`font-semibold ${tone.text}`}>{formatUSD(totalValueUSD)}</span>
      </div>
    </Link>
  );
}