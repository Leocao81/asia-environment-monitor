import { formatDate } from '@/lib/format';

export function LastUpdated({ iso, note }: { iso: string; note?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 ring-1 ring-emerald-200">
        <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
        已自动更新
      </span>
      <span>最近一次：{formatDate(iso, 'zh')} {new Date(iso).toTimeString().slice(0, 8)} UTC</span>
      {note && <span title={note} className="hidden md:inline opacity-70">· {note}</span>}
    </div>
  );
}