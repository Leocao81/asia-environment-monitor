import type { TradeRecord } from '@/lib/types';
import { PRODUCT_CATEGORY_LABEL, formatUSD } from '@/lib/format';

export function TradeSummaryByCategory({ records }: { records: TradeRecord[] }) {
  const byCat = new Map<string, { value: number; count: number }>();
  for (const r of records) {
    const cur = byCat.get(r.productCategory) ?? { value: 0, count: 0 };
    cur.value += r.value;
    cur.count += 1;
    byCat.set(r.productCategory, cur);
  }
  const items = Array.from(byCat.entries()).sort((a, b) => b[1].value - a[1].value);
  if (items.length === 0) return null;
  const top = items[0][1].value || 1;
  return (
    <div className="card">
      <h3 className="text-sm font-semibold">按产品类别汇总</h3>
      <ul className="mt-3 space-y-2.5">
        {items.map(([cat, agg]) => {
          const pct = Math.round((agg.value / top) * 100);
          return (
            <li key={cat}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{PRODUCT_CATEGORY_LABEL[cat as keyof typeof PRODUCT_CATEGORY_LABEL]?.zh ?? cat}</span>
                <span className="tabular-nums text-ink-700">{formatUSD(agg.value)} · {agg.count} 条</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 to-violet-400"
                  style={{ width: `${pct}%` }}
                  aria-hidden
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}