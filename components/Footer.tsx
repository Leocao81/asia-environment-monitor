export function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-200/70 bg-white">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span aria-hidden className="inline-block h-6 w-6 rounded-md bg-gradient-to-br from-sky-500 via-emerald-500 to-violet-500" />
            <span className="text-sm font-semibold">亚洲环境监测台</span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-500">
            聚合中亚、东南亚、南亚与中东国家环境监管政策和监测设备贸易数据，每日自动更新。
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500">区域</h3>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li><a href="/regions/central-asia" className="hover:text-sky-700">中亚</a></li>
            <li><a href="/regions/southeast-asia" className="hover:text-emerald-700">东南亚</a></li>
            <li><a href="/regions/south-asia" className="hover:text-amber-700">南亚</a></li>
            <li><a href="/regions/middle-east" className="hover:text-violet-700">中东</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500">数据</h3>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li><a href="/trade" className="hover:underline">监测设备进出口（可筛选导出）</a></li>
            <li><a href="/about" className="hover:underline">关于与数据来源</a></li>
            <li><a href="/about#methodology" className="hover:underline">采集方法</a></li>
            <li><a href="/about#license" className="hover:underline">许可与免责</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500">更新</h3>
          <p className="mt-3 text-xs text-ink-500">
            每天 UTC 02:00 由 GitHub Actions 自动抓取并重建页面。
          </p>
        </div>
      </div>
      <div className="border-t border-ink-200/70">
        <div className="container-page py-4 text-xs text-ink-500 flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Asia Environment Monitor · 仅供研究参考</span>
          <span>Built with Next.js · Deployed on Vercel</span>
        </div>
      </div>
    </footer>
  );
}