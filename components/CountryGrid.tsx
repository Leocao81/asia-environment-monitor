import Link from 'next/link';
import type { Country } from '@/lib/countries';

type Props = {
  countries: Country[];
  policyCountByCountry: Record<string, number>;
  tradeValueByCountry: Record<string, number>;
};

export function CountryGrid({ countries, policyCountByCountry, tradeValueByCountry }: Props) {
  return (
    <ul className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {countries.map((c) => {
        const pc = policyCountByCountry[c.iso2] ?? 0;
        const tv = tradeValueByCountry[c.iso2] ?? 0;
        return (
          <li key={c.iso2}>
            <Link href={`/countries/${c.iso2.toLowerCase()}`} className="card-link block">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-base font-semibold">{c.name.zh}</div>
                  <div className="text-xs text-ink-500">{c.name.en} · {c.iso2}</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-ink-500">政策</div>
                  <div className="font-semibold">{pc}</div>
                </div>
                <div>
                  <div className="text-ink-500">进出口</div>
                  <div className="font-semibold tabular-nums">{tv >= 1_000_000 ? `$${(tv / 1_000_000).toFixed(1)}M` : tv >= 1000 ? `$${(tv/1000).toFixed(0)}K` : `$${tv}`}</div>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}