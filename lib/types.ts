/**
 * Shared domain types for the Asia Environment Monitor site.
 */

export type RegionId =
  | 'central-asia'
  | 'southeast-asia'
  | 'south-asia'
  | 'middle-east';

export type LocalizedText = {
  zh: string;
  en: string;
};

export type PolicyCategory =
  | 'air'
  | 'water'
  | 'waste'
  | 'biodiversity'
  | 'climate'
  | 'industrial'
  | 'monitoring'
  | 'general';

export type Policy = {
  id: string;
  /** ISO 3166-1 alpha-2 country code, e.g. "KZ" */
  country: string;
  countryName: LocalizedText;
  region: RegionId;
  title: LocalizedText;
  summary: LocalizedText;
  source: string;
  url: string;
  /** ISO 8601 publication date, e.g. "2026-09-12" */
  publishedAt: string;
  category: PolicyCategory;
  tags: string[];
};

export type TradeFlow = 'import' | 'export';

export type ProductCategory =
  | 'air-monitor'
  | 'water-monitor'
  | 'soil-monitor'
  | 'noise-monitor'
  | 'lab-equipment'
  | 'emissions-control'
  | 'waste-treatment';

export type TradeRecord = {
  id: string;
  /** Reporter country, ISO 3166-1 alpha-2 */
  country: string;
  countryName: LocalizedText;
  region: RegionId;
  /** HS code for environmental monitoring equipment */
  hsCode: string;
  productCategory: ProductCategory;
  productName: LocalizedText;
  flow: TradeFlow;
  /** Trade value in USD */
  value: number;
  quantity: number;
  unitName: string;
  partner: string;
  /** Year-month, e.g. "2026-07" */
  period: string;
};

export type Snapshot = {
  generatedAt: string;
  sourceNote: string;
  policies: Policy[];
  trade: TradeRecord[];
};