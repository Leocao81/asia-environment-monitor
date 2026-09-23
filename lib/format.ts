import type { PolicyCategory, ProductCategory, SiteType, TradeFlow } from './types';

export const POLICY_CATEGORY_LABEL: Record<PolicyCategory, { zh: string; en: string }> = {
  air: { zh: '大气', en: 'Air' },
  water: { zh: '水', en: 'Water' },
  waste: { zh: '固废/危废', en: 'Waste' },
  biodiversity: { zh: '生物多样性', en: 'Biodiversity' },
  climate: { zh: '气候/碳', en: 'Climate' },
  industrial: { zh: '工业排放', en: 'Industrial' },
  monitoring: { zh: '监测体系', en: 'Monitoring' },
  general: { zh: '综合', en: 'General' },
};

export const PRODUCT_CATEGORY_LABEL: Record<ProductCategory, { zh: string; en: string }> = {
  'air-monitor': { zh: '大气监测仪', en: 'Air monitor' },
  'water-monitor': { zh: '水质监测仪', en: 'Water monitor' },
  'soil-monitor': { zh: '土壤监测仪', en: 'Soil monitor' },
  'noise-monitor': { zh: '噪声监测仪', en: 'Noise monitor' },
  'lab-equipment': { zh: '实验室分析仪器', en: 'Lab equipment' },
  'emissions-control': { zh: '排放控制设备', en: 'Emissions control' },
  'waste-treatment': { zh: '废物处理设备', en: 'Waste treatment' },
};

export const TRADE_FLOW_LABEL: Record<TradeFlow, { zh: string; en: string }> = {
  import: { zh: '进口', en: 'Import' },
  export: { zh: '出口', en: 'Export' },
};

export const SITE_TYPE_LABEL: Record<SiteType, { zh: string; en: string }> = {
  'urban-air-station': { zh: '城市空气站', en: 'Urban air station' },
  'industrial-park': { zh: '工业园区/厂界', en: 'Industrial park' },
  'watershed-section': { zh: '流域断面', en: 'Watershed section' },
  'drinking-water-source': { zh: '饮用水源地', en: 'Drinking-water source' },
  'soil-site': { zh: '土壤监测点', en: 'Soil site' },
  'noise-site': { zh: '声环境点位', en: 'Noise site' },
  'port-customs': { zh: '港口/口岸', en: 'Port / customs' },
  'vehicle-emission': { zh: '机动车尾气站', en: 'Vehicle emission station' },
  laboratory: { zh: '实验室/检测机构', en: 'Laboratory' },
};

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function formatUSD(value: number): string {
  if (!Number.isFinite(value)) return '—';
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return usdFormatter.format(value);
}

export function formatDate(iso: string, locale: 'zh' | 'en' = 'zh'): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  if (locale === 'zh') {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export function relativeTime(iso: string, now: Date = new Date()): string {
  if (!iso) return '—';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '—';
  const diff = now.getTime() - then;
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days <= 0) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(days / 365);
  return `${years} years ago`;
}