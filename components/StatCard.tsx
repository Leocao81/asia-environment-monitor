type Props = {
  label: string;
  value: string;
  hint?: string;
  accent?: 'sky' | 'emerald' | 'amber' | 'violet';
};

const ACCENT: Record<NonNullable<Props['accent']>, string> = {
  sky: 'from-sky-500/10 to-sky-500/0 text-sky-900',
  emerald: 'from-emerald-500/10 to-emerald-500/0 text-emerald-900',
  amber: 'from-amber-500/10 to-amber-500/0 text-amber-900',
  violet: 'from-violet-500/10 to-violet-500/0 text-violet-900',
};

export function StatCard({ label, value, hint, accent = 'sky' }: Props) {
  return (
    <div className={`card bg-gradient-to-br ${ACCENT[accent]}`}>
      <div className="text-xs uppercase tracking-wider text-ink-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {hint && <div className="mt-1 text-xs text-ink-500">{hint}</div>}
    </div>
  );
}