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

/**
 * 监测点位 / 应用场景 —— 设备最终部署的场景类型。
 * 用于回答"这批设备进了哪些类型的点位"。
 */
export type SiteType =
  | 'urban-air-station'      // 城市环境空气自动监测站
  | 'industrial-park'        // 工业园区 / 厂界
  | 'watershed-section'      // 流域断面 / 地表水
  | 'drinking-water-source'  // 饮用水水源地
  | 'soil-site'              // 土壤 / 农田监测点
  | 'noise-site'             // 声环境功能区 / 交通噪声点
  | 'port-customs'           // 港口 / 口岸监测点
  | 'vehicle-emission'       // 机动车尾气检测站
  | 'laboratory';            // 实验室 / 检测机构

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
  /** Partner country ISO code, e.g. "CN" */
  partner: string;
  /** Partner country localized name */
  partnerName: LocalizedText;
  /** 监测点位 / 应用场景类型 */
  siteType: SiteType;
  /** 具体点位名称，例如 "Almaty Air Quality Station #3" */
  siteName: string;
  /** 报关口岸 / 关区（可选，进出口实际发生地） */
  customsPort: string;
  /** Year-month, e.g. "2026-07" */
  period: string;
};

export type Snapshot = {
  generatedAt: string;
  sourceNote: string;
  policies: Policy[];
  trade: TradeRecord[];
};