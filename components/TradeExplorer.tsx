'use client';

import { useEffect, useMemo, useState } from 'react';
import type { TradeRecord } from '@/lib/types';
import {
  PRODUCT_CATEGORY_LABEL,
  SITE_TYPE_LABEL,
  TRADE_FLOW_LABEL,
  formatUSD,
} from '@/lib/format';
import { REGIONS, getCountry } from '@/lib/countries';
import { MultiSelect, type Option } from '@/components/MultiSelect';

type Props = {
  records: TradeRecord[];
  /** Show the region filter (used on the global /trade page). */
  showRegionFilter?: boolean;
  /** Hide the country filter (used on the country detail page). */
  showCountryFilter?: boolean;
  /** Rows per page on first render. */
  initialPageSize?: number;
  heading?: string;
};

type SortKey = 'period-desc' | 'period-asc' | 'value-desc' | 'value-asc' | 'quantity-desc';

const SORT_LABEL: Record<SortKey, string> = {
  'period-desc': '时间（新→旧）',
  'period-asc': '时间（旧→新）',
  'value-desc': '金额（高→低）',
  'value-asc': '金额（低→高）',
  'quantity-desc': '数量（多→少）',
};

/** RFC4180-ish CSV escaping. */
function csvCell(value: string | number): string {
  const s = String(value ?? '');
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows: TradeRecord[]): string {
  const header = [
    '序号', '周期', '区域', '国家', '流向', '设备类型', '产品名称', 'HS编码',
    '监测点位', '点位类型', '报关口岸', '贸易伙伴', '数量', '单位', '金额(USD)',
  ];
  const lines = [header.map(csvCell).join(',')];
  rows.forEach((r, i) => {
    const region = REGIONS.find((x) => x.id === r.region);
    lines.push(
      [
        i + 1,
        r.period,
        region?.name.zh ?? r.region,
        r.countryName?.zh ?? getCountry(r.country)?.name.zh ?? r.country,
        TRADE_FLOW_LABEL[r.flow]?.zh ?? r.flow,
        PRODUCT_CATEGORY_LABEL[r.productCategory]?.zh ?? r.productCategory,
        r.productName?.zh ?? '',
        r.hsCode,
        r.siteName ?? '',
        SITE_TYPE_LABEL[r.siteType]?.zh ?? r.siteType ?? '',
        r.customsPort ?? '',
        r.partnerName?.zh ?? r.partner,
        r.quantity,
        r.unitName,
        r.value,
      ]
        .map(csvCell)
        .join(','),
    );
  });
  return lines.join('\r\n');
}

function downloadCsv(rows: TradeRecord[]) {
  // \uFEFF (BOM) makes Excel open UTF-8 CSVs without garbled Chinese.
  const csv = '\uFEFF' + toCsv(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const stamp = new Date();
  const name = `环境监测设备进出口_${stamp.getFullYear()}${String(stamp.getMonth() + 1).padStart(2, '0')}${String(stamp.getDate()).padStart(2, '0')}_${String(stamp.getHours()).padStart(2, '0')}${String(stamp.getMinutes()).padStart(2, '0')}.csv`;
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function TradeExplorer({
  records,
  showRegionFilter = true,
  showCountryFilter = true,
  initialPageSize = 25,
  heading = '监测设备进出口数据',
}: Props) {
  // --- filter state -------------------------------------------------------
  const [q, setQ] = useState('');
  const [regions, setRegions] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [siteTypes, setSiteTypes] = useState<string[]>([]);
  const [flows, setFlows] = useState<string[]>([]);
  const [partners, setPartners] = useState<string[]>([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sort, setSort] = useState<SortKey>('period-desc');

  // --- paging ------------------------------------------------------------
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // --- derived option lists (with counts) --------------------------------
  const periodOptions = useMemo(
    () => Array.from(new Set(records.map((r) => r.period))).sort(),
    [records],
  );

  function countBy<T extends string>(pick: (r: TradeRecord) => T) {
    const m = new Map<T, number>();
    for (const r of records) m.set(pick(r), (m.get(pick(r)) ?? 0) + 1);
    return m;
  }

  const regionCounts = useMemo(() => countBy((r) => r.region), [records]);
  const countryCounts = useMemo(() => countBy((r) => r.country), [records]);
  const productCounts = useMemo(() => countBy((r) => r.productCategory), [records]);
  const siteCounts = useMemo(() => countBy((r) => r.siteType), [records]);
  const flowCounts = useMemo(() => countBy((r) => r.flow), [records]);
  const partnerCounts = useMemo(() => countBy((r) => r.partner), [records]);

  const regionOptions: Option[] = useMemo(
    () =>
      REGIONS.filter((rg) => (regionCounts.get(rg.id) ?? 0) > 0).map((rg) => ({
        value: rg.id,
        label: rg.name.zh,
        hint: `${regionCounts.get(rg.id) ?? 0}`,
      })),
    [regionCounts],
  );

  const countryOptions: Option[] = useMemo(
    () =>
      Array.from(countryCounts.entries())
        .map(([iso2, n]) => ({
          value: iso2,
          label: getCountry(iso2)?.name.zh ?? iso2,
          hint: `${n}`,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, 'zh')),
    [countryCounts],
  );

  const productOptions: Option[] = useMemo(
    () =>
      Array.from(productCounts.entries())
        .map(([k, n]) => ({
          value: k,
          label: PRODUCT_CATEGORY_LABEL[k as keyof typeof PRODUCT_CATEGORY_LABEL]?.zh ?? k,
          hint: `${n}`,
        }))
        .sort((a, b) => Number(b.hint) - Number(a.hint)),
    [productCounts],
  );

  const siteOptions: Option[] = useMemo(
    () =>
      Array.from(siteCounts.entries())
        .map(([k, n]) => ({
          value: k,
          label: SITE_TYPE_LABEL[k as keyof typeof SITE_TYPE_LABEL]?.zh ?? k,
          hint: `${n}`,
        }))
        .sort((a, b) => Number(b.hint) - Number(a.hint)),
    [siteCounts],
  );

  const flowOptions: Option[] = useMemo(
    () =>
      (['import', 'export'] as const)
        .filter((f) => (flowCounts.get(f) ?? 0) > 0)
        .map((f) => ({
          value: f,
          label: TRADE_FLOW_LABEL[f].zh,
          hint: `${flowCounts.get(f) ?? 0}`,
        })),
    [flowCounts],
  );

  const partnerOptions: Option[] = useMemo(
    () =>
      Array.from(partnerCounts.entries())
        .map(([iso2, n]) => ({
          value: iso2,
          // partnerName is carried on the record, but a plain ISO map is enough here
          label:
            records.find((r) => r.partner === iso2)?.partnerName?.zh ?? iso2,
          hint: `${n}`,
        }))
        .sort((a, b) => Number(b.hint) - Number(a.hint)),
    [partnerCounts, records],
  );

  // --- filtering ---------------------------------------------------------
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const out = records.filter((r) => {
      if (regions.length && !regions.includes(r.region)) return false;
      if (countries.length && !countries.includes(r.country)) return false;
      if (products.length && !products.includes(r.productCategory)) return false;
      if (siteTypes.length && !siteTypes.includes(r.siteType)) return false;
      if (flows.length && !flows.includes(r.flow)) return false;
      if (partners.length && !partners.includes(r.partner)) return false;
      if (from && r.period < from) return false;
      if (to && r.period > to) return false;
      if (needle) {
        const hay = [
          r.siteName,
          r.productName?.zh,
          r.productName?.en,
          r.hsCode,
          r.customsPort,
          r.countryName?.zh,
          r.partnerName?.zh,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });

    out.sort((a, b) => {
      switch (sort) {
        case 'period-asc':
          return a.period < b.period ? -1 : a.period > b.period ? 1 : 0;
        case 'value-desc':
          return b.value - a.value;
        case 'value-asc':
          return a.value - b.value;
        case 'quantity-desc':
          return b.quantity - a.quantity;
        case 'period-desc':
        default:
          return a.period < b.period ? 1 : a.period > b.period ? -1 : 0;
      }
    });
    return out;
  }, [records, q, regions, countries, products, siteTypes, flows, partners, from, to, sort]);

  // Reset to first page whenever the result set changes shape.
  useEffect(() => {
    setPage(1);
  }, [q, regions, countries, products, siteTypes, flows, partners, from, to, sort, pageSize]);

  const stats = useMemo(() => {
    const total = filtered.reduce((s, r) => s + r.value, 0);
    const imp = filtered.filter((r) => r.flow === 'import').reduce((s, r) => s + r.value, 0);
    const exp = filtered.filter((r) => r.flow === 'export').reduce((s, r) => s + r.value, 0);
    const qty = filtered.reduce((s, r) => s + r.quantity, 0);
    const countriesN = new Set(filtered.map((r) => r.country)).size;
    const sitesN = new Set(filtered.map((r) => r.siteName)).size;
    return { total, imp, exp, qty, countriesN, sitesN };
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, totalPages);
  const pageRows = useMemo(
    () => filtered.slice((current - 1) * pageSize, current * pageSize),
    [filtered, current, pageSize],
  );

  const activeFilterCount =
    (q.trim() ? 1 : 0) +
    regions.length + countries.length + products.length +
    siteTypes.length + flows.length + partners.length +
    (from ? 1 : 0) + (to ? 1 : 0);

  function resetAll() {
    setQ('');
    setRegions([]);
    setCountries([]);
    setProducts([]);
    setSiteTypes([]);
    setFlows([]);
    setPartners([]);
    setFrom('');
    setTo('');
    setSort('period-desc');
  }

  return (
    <div className="space-y-4">
      {/* ---------------- Filters ---------------- */}
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">{heading}</h3>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button type="button" onClick={resetAll} className="btn-secondary text-xs">
                重置筛选 ({activeFilterCount})
              </button>
            )}
            <button
              type="button"
              onClick={() => downloadCsv(filtered)}
              disabled={filtered.length === 0}
              className="btn-primary text-xs disabled:cursor-not-allowed disabled:opacity-50"
            >
              导出 Excel（{filtered.length} 条）
            </button>
          </div>
        </div>

        {/* keyword */}
        <div className="mt-3">
          <label htmlFor="trade-q" className="mb-1 block text-xs font-medium text-ink-500">
            关键词
          </label>
          <input
            id="trade-q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索点位名称 / 产品 / HS 编码 / 口岸 / 国家…"
            className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus-ring"
          />
        </div>

        {/* dimension filters */}
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {showRegionFilter && (
            <MultiSelect label="区域" options={regionOptions} selected={regions} onChange={setRegions} />
          )}
          {showCountryFilter && (
            <MultiSelect
              label="国家"
              options={countryOptions}
              selected={countries}
              onChange={setCountries}
              searchable
            />
          )}
          <MultiSelect label="设备类型" options={productOptions} selected={products} onChange={setProducts} />
          <MultiSelect label="监测点位" options={siteOptions} selected={siteTypes} onChange={setSiteTypes} />
          <MultiSelect label="流向" options={flowOptions} selected={flows} onChange={setFlows} />
          <MultiSelect
            label="贸易伙伴"
            options={partnerOptions}
            selected={partners}
            onChange={setPartners}
            searchable
          />

          {/* period range */}
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-500">起始月份</label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus-ring"
            >
              <option value="">不限</option>
              {periodOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-500">结束月份</label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus-ring"
            >
              <option value="">不限</option>
              {periodOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-ink-500">排序</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus-ring"
            >
              {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => (
                <option key={k} value={k}>{SORT_LABEL[k]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* live result summary */}
        <dl className="mt-4 grid gap-3 grid-cols-2 lg:grid-cols-4 border-t border-ink-100 pt-4">
          <div>
            <dt className="text-xs text-ink-500">匹配记录</dt>
            <dd className="text-lg font-semibold tabular-nums">{filtered.length.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-500">进出口总额</dt>
            <dd className="text-lg font-semibold tabular-nums">{formatUSD(stats.total)}</dd>
            <p className="text-[11px] text-ink-500">
              进口 {formatUSD(stats.imp)} · 出口 {formatUSD(stats.exp)}
            </p>
          </div>
          <div>
            <dt className="text-xs text-ink-500">设备总数量</dt>
            <dd className="text-lg font-semibold tabular-nums">{stats.qty.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-500">覆盖国家 / 点位</dt>
            <dd className="text-lg font-semibold tabular-nums">
              {stats.countriesN} / {stats.sitesN}
            </dd>
          </div>
        </dl>
      </div>

      {/* ---------------- Table ---------------- */}
      <div className="overflow-hidden rounded-2xl ring-1 ring-ink-200/70 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500">
              <tr>
                <th scope="col" className="px-3 py-2.5 whitespace-nowrap">周期</th>
                <th scope="col" className="px-3 py-2.5 whitespace-nowrap">国家</th>
                <th scope="col" className="px-3 py-2.5">设备 / 产品</th>
                <th scope="col" className="px-3 py-2.5">监测点位</th>
                <th scope="col" className="px-3 py-2.5 whitespace-nowrap hidden md:table-cell">口岸</th>
                <th scope="col" className="px-3 py-2.5 whitespace-nowrap">流向</th>
                <th scope="col" className="px-3 py-2.5 text-right whitespace-nowrap">数量</th>
                <th scope="col" className="px-3 py-2.5 text-right whitespace-nowrap">金额</th>
                <th scope="col" className="px-3 py-2.5 whitespace-nowrap hidden lg:table-cell">伙伴</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {pageRows.map((r) => (
                <tr key={r.id} className="hover:bg-ink-50/60">
                  <td className="px-3 py-2 whitespace-nowrap text-ink-700 tabular-nums">{r.period}</td>
                  <td className="px-3 py-2 whitespace-nowrap font-medium">
                    {r.countryName?.zh ?? getCountry(r.country)?.name.zh ?? r.country}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-col">
                      <span>{r.productName?.zh}</span>
                      <span className="text-xs text-ink-500">
                        {PRODUCT_CATEGORY_LABEL[r.productCategory]?.zh} · HS {r.hsCode}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-col">
                      <span className="max-w-[22rem] truncate" title={r.siteName}>{r.siteName}</span>
                      <span className="text-xs text-ink-500">
                        {SITE_TYPE_LABEL[r.siteType]?.zh ?? r.siteType}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs text-ink-700 hidden md:table-cell">
                    <span className="block max-w-[12rem] truncate" title={r.customsPort}>
                      {r.customsPort}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`pill-accent ${
                        r.flow === 'import'
                          ? 'bg-amber-50 text-amber-700 ring-amber-200'
                          : 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                      }`}
                    >
                      {TRADE_FLOW_LABEL[r.flow].zh}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums whitespace-nowrap">
                    {r.quantity.toLocaleString()} {r.unitName}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums font-semibold whitespace-nowrap">
                    {formatUSD(r.value)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap hidden lg:table-cell">
                    {r.partnerName?.zh ?? r.partner}
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-10 text-center text-sm text-ink-500">
                    没有符合条件的数据，试试放宽筛选条件。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 px-3 py-2.5 text-xs text-ink-500">
          <div className="flex items-center gap-2">
            <span>每页</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-md border border-ink-200 bg-white px-2 py-1 focus-ring"
              aria-label="每页条数"
            >
              {[25, 50, 100, 200].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <span>条</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage(1)}
              disabled={current === 1}
              className="rounded-md border border-ink-200 px-2 py-1 disabled:opacity-40"
            >
              首页
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={current === 1}
              className="rounded-md border border-ink-200 px-2 py-1 disabled:opacity-40"
            >
              上一页
            </button>
            <span className="px-2 tabular-nums">
              {current} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={current === totalPages}
              className="rounded-md border border-ink-200 px-2 py-1 disabled:opacity-40"
            >
              下一页
            </button>
            <button
              type="button"
              onClick={() => setPage(totalPages)}
              disabled={current === totalPages}
              className="rounded-md border border-ink-200 px-2 py-1 disabled:opacity-40"
            >
              末页
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-ink-500">
        导出文件为 <strong>UTF-8 BOM 编码的 CSV</strong>，Excel / WPS 双击即可打开，中文不会乱码。
        导出范围是<strong>当前筛选结果的全部 {filtered.length.toLocaleString()} 条</strong>（不受分页限制）。
      </p>
    </div>
  );
}