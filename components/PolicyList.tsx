import Link from 'next/link';
import type { Policy } from '@/lib/types';
import { POLICY_CATEGORY_LABEL, formatDate, relativeTime } from '@/lib/format';
import { getCountry } from '@/lib/countries';

const CATEGORY_BADGE: Record<string, string> = {
  air:        'bg-sky-50 text-sky-700 ring-sky-200',
  water:      'bg-cyan-50 text-cyan-700 ring-cyan-200',
  waste:      'bg-stone-50 text-stone-700 ring-stone-200',
  biodiversity: 'bg-lime-50 text-lime-700 ring-lime-200',
  climate:    'bg-orange-50 text-orange-700 ring-orange-200',
  industrial: 'bg-rose-50 text-rose-700 ring-rose-200',
  monitoring: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  general:    'bg-ink-100 text-ink-700 ring-ink-200',
};

type Props = {
  policies: Policy[];
  emptyText?: string;
  showRegion?: boolean;
};

export function PolicyList({ policies, emptyText = '暂无数据', showRegion = false }: Props) {
  if (policies.length === 0) {
    return <div className="card text-sm text-ink-500">{emptyText}</div>;
  }
  return (
    <ul className="space-y-3">
      {policies.map((p) => {
        const country = getCountry(p.country);
        return (
          <li key={p.id} className="card">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`pill-accent ${CATEGORY_BADGE[p.category] ?? CATEGORY_BADGE.general}`}>
                    {POLICY_CATEGORY_LABEL[p.category].zh}
                  </span>
                  {country && (
                    <Link href={`/countries/${country.iso2.toLowerCase()}`} className="pill hover:bg-ink-100">
                      {country.name.zh}
                    </Link>
                  )}
                  {showRegion && (
                    <span className="pill">{p.region}</span>
                  )}
                  <time className="text-xs text-ink-500" dateTime={p.publishedAt}>
                    {formatDate(p.publishedAt, 'zh')} · <span title={p.publishedAt}>{relativeTime(p.publishedAt)}</span>
                  </time>
                </div>
                <h3 className="mt-2 text-base font-semibold leading-snug">
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:underline focus-ring rounded">
                    {p.title.zh}
                  </a>
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{p.summary.zh}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-500">
                  <span>来源 · {p.source}</span>
                  {p.tags.length > 0 && (
                    <span className="hidden md:inline">· {p.tags.map((t) => `#${t}`).join(' ')}</span>
                  )}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}