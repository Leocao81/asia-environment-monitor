import type { TradeRecord } from '@/lib/types';
import { PRODUCT_CATEGORY_LABEL, TRADE_FLOW_LABEL, formatUSD } from '@/lib/format';

type Props = {
  records: TradeRecord[];
  /** Show partner country column */
  showPartner?: boolean;
  emptyText?: string;
};

export function TradeTable({ records, showPartner = true, emptyText = '暂无数据' }: Props) {
  if (records.length === 0) {
    return <div className="card text-sm text-ink-500">{emptyText}</div>;
  }
  return (
    <div className="overflow-x-auto rounded-2xl ring-1 ring-ink-200/70 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500">
          <tr>
            <th scope="col" className="px-4 py-2.5">周期</th>
            <th scope="col" className="px-4 py-2.5">国家</th>
            <th scope="col" className="px-4 py-2.5">产品</th>
            <th scope="col" className="px-4 py-2.5">HS</th>
            <th scope="col" className="px-4 py-2.5">流向</th>
            <th scope="col" className="px-4 py-2.5 text-right">数量</th>
            <th scope="col" className="px-4 py-2.5 text-right">金额 (USD)</th>
            {showPartner && <th scope="col" className="px-4 py-2.5">伙伴</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {records.map((r) => (
            <tr key={r.id} className="hover:bg-ink-50/60">
              <td className="px-4 py-2 whitespace-nowrap text-ink-700">{r.period}</td>
              <td className="px-4 py-2 font-medium">{r.countryName.zh}</td>
              <td className="px-4 py-2">
                <div className="flex flex-col">
                  <span>{r.productName.zh}</span>
                  <span className="text-xs text-ink-500">
                    {PRODUCT_CATEGORY_LABEL[r.productCategory].zh} · {r.productName.en}
                  </span>
                </div>
              </td>
              <td className="px-4 py-2 font-mono text-xs text-ink-700">{r.hsCode}</td>
              <td className="px-4 py-2">
                <span className={`pill-accent ${r.flow === 'import' ? 'bg-amber-50 text-amber-700 ring-amber-200' : 'bg-emerald-50 text-emerald-700 ring-emerald-200'}`}>
                  {TRADE_FLOW_LABEL[r.flow].zh}
                </span>
              </td>
              <td className="px-4 py-2 text-right tabular-nums">{r.quantity.toLocaleString()} {r.unitName}</td>
              <td className="px-4 py-2 text-right tabular-nums font-semibold">{formatUSD(r.value)}</td>
              {showPartner && <td className="px-4 py-2 text-ink-700">{r.partner}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}