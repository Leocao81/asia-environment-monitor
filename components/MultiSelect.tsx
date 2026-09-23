'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export type Option = {
  value: string;
  label: string;
  hint?: string;
};

type Props = {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  /** Optional search box inside the dropdown (useful for long lists). */
  searchable?: boolean;
};

/**
 * Accessible multi-select dropdown built with plain React (no dependencies).
 * Closes on outside click / Escape.
 */
export function MultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder = '全部',
  searchable = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const visible = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const summary =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? (options.find((o) => o.value === selected[0])?.label ?? selected[0])
        : `已选 ${selected.length} 项`;

  function toggle(value: string) {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <label className="mb-1 block text-xs font-medium text-ink-500">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2 text-left text-sm focus-ring ${
          selected.length > 0 ? 'border-sky-300 text-ink-900' : 'border-ink-200 text-ink-500'
        }`}
      >
        <span className="truncate">{summary}</span>
        <span aria-hidden className="shrink-0 text-ink-300">
          {selected.length > 0 ? '●' : '▾'}
        </span>
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full min-w-[220px] rounded-xl border border-ink-200 bg-white p-2 shadow-lg">
          {searchable && (
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索…"
              className="mb-2 w-full rounded-md border border-ink-200 px-2 py-1.5 text-sm focus-ring"
            />
          )}

          <div className="max-h-60 overflow-y-auto" role="listbox" aria-multiselectable="true">
            {visible.length === 0 && (
              <div className="px-2 py-3 text-xs text-ink-500">无匹配项</div>
            )}
            {visible.map((o) => {
              const checked = selected.includes(o.value);
              return (
                <button
                  key={o.value}
                  type="button"
                  role="option"
                  aria-selected={checked}
                  onClick={() => toggle(o.value)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-ink-50"
                >
                  <span
                    aria-hidden
                    className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] ${
                      checked ? 'border-sky-500 bg-sky-500 text-white' : 'border-ink-300 bg-white'
                    }`}
                  >
                    {checked ? '✓' : ''}
                  </span>
                  <span className="flex-1 truncate">{o.label}</span>
                  {o.hint && <span className="shrink-0 text-xs text-ink-500">{o.hint}</span>}
                </button>
              );
            })}
          </div>

          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="mt-2 w-full rounded-md bg-ink-50 px-2 py-1.5 text-xs text-ink-700 hover:bg-ink-100"
            >
              清空该项
            </button>
          )}
        </div>
      )}
    </div>
  );
}