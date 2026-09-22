import Link from 'next/link';
import { REGIONS } from '@/lib/countries';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/70 bg-white/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 focus-ring rounded">
          <span aria-hidden className="inline-block h-7 w-7 rounded-lg bg-gradient-to-br from-sky-500 via-emerald-500 to-violet-500" />
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-wide">亚洲环境监测台</span>
            <span className="text-[11px] text-ink-500">Asia Environment Monitor</span>
          </span>
        </Link>

        <nav aria-label="主导航" className="hidden md:flex items-center gap-1">
          {REGIONS.map((r) => (
            <Link
              key={r.id}
              href={`/regions/${r.id}`}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-100 focus-ring"
            >
              {r.name.zh}
            </Link>
          ))}
          <Link href="/about" className="rounded-md px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-100 focus-ring">
            关于
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/"
            className="hidden sm:inline-flex btn-secondary text-xs"
            aria-label="GitHub 仓库"
          >
            GitHub
          </a>
          <Link href="/" className="btn-primary text-xs">订阅</Link>
        </div>
      </div>

      {/* Mobile region nav */}
      <nav aria-label="区域导航（移动）" className="md:hidden border-t border-ink-200/70 bg-white">
        <ul className="container-page flex gap-1 overflow-x-auto py-2 text-sm">
          {REGIONS.map((r) => (
            <li key={r.id}>
              <Link href={`/regions/${r.id}`} className="whitespace-nowrap rounded-md px-3 py-1.5 text-ink-700 hover:bg-ink-100 focus-ring">
                {r.name.zh}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}