import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getSiteUrl } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: '亚洲环境监测台 | Asia Environment Monitor',
    template: '%s · 亚洲环境监测台',
  },
  description:
    '覆盖中亚、东南亚、南亚、中东的环境监管政策动态与环境监测设备进出口数据。每日自动更新。',
  keywords: [
    '环境监管', '环境政策', '监测设备', '进出口', '中亚', '东南亚', '南亚', '中东',
    'environmental regulation', 'Asia', 'monitoring equipment', 'trade',
  ],
  openGraph: {
    title: '亚洲环境监测台',
    description: '中亚 · 东南亚 · 南亚 · 中东 环境监管与监测设备进出口每日更新。',
    type: 'website',
    locale: 'zh_CN',
    alternateLocale: 'en_US',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:p-2 focus:ring-2 focus:ring-sky-500">
          跳到主要内容
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}