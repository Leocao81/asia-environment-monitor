// scripts/seed-data.mjs — Deterministic, country-aware seed data.
// Used when live scrapers cannot reach external sources (sandbox / CI / offline).
// Output is shaped exactly like real data so the rest of the pipeline does not
// care whether records came from a live source or seed.
//
// Countries are duplicated here (instead of importing lib/countries.ts) so the
// scraper runs in plain Node without a TS loader.

import { TODAY, srandom, pickRandom } from './utils.mjs';

const COUNTRIES = [
  { iso2: 'KZ', name: { zh: '哈萨克斯坦', en: 'Kazakhstan' }, region: 'central-asia' },
  { iso2: 'UZ', name: { zh: '乌兹别克斯坦', en: 'Uzbekistan' }, region: 'central-asia' },
  { iso2: 'KG', name: { zh: '吉尔吉斯斯坦', en: 'Kyrgyzstan' }, region: 'central-asia' },
  { iso2: 'TJ', name: { zh: '塔吉克斯坦', en: 'Tajikistan' }, region: 'central-asia' },
  { iso2: 'TM', name: { zh: '土库曼斯坦', en: 'Turkmenistan' }, region: 'central-asia' },

  { iso2: 'ID', name: { zh: '印度尼西亚', en: 'Indonesia' }, region: 'southeast-asia' },
  { iso2: 'TH', name: { zh: '泰国', en: 'Thailand' }, region: 'southeast-asia' },
  { iso2: 'VN', name: { zh: '越南', en: 'Vietnam' }, region: 'southeast-asia' },
  { iso2: 'MY', name: { zh: '马来西亚', en: 'Malaysia' }, region: 'southeast-asia' },
  { iso2: 'PH', name: { zh: '菲律宾', en: 'Philippines' }, region: 'southeast-asia' },
  { iso2: 'SG', name: { zh: '新加坡', en: 'Singapore' }, region: 'southeast-asia' },
  { iso2: 'MM', name: { zh: '缅甸', en: 'Myanmar' }, region: 'southeast-asia' },
  { iso2: 'KH', name: { zh: '柬埔寨', en: 'Cambodia' }, region: 'southeast-asia' },
  { iso2: 'LA', name: { zh: '老挝', en: 'Laos' }, region: 'southeast-asia' },
  { iso2: 'BN', name: { zh: '文莱', en: 'Brunei' }, region: 'southeast-asia' },
  { iso2: 'TL', name: { zh: '东帝汶', en: 'Timor-Leste' }, region: 'southeast-asia' },

  { iso2: 'IN', name: { zh: '印度', en: 'India' }, region: 'south-asia' },
  { iso2: 'PK', name: { zh: '巴基斯坦', en: 'Pakistan' }, region: 'south-asia' },
  { iso2: 'BD', name: { zh: '孟加拉国', en: 'Bangladesh' }, region: 'south-asia' },
  { iso2: 'LK', name: { zh: '斯里兰卡', en: 'Sri Lanka' }, region: 'south-asia' },
  { iso2: 'NP', name: { zh: '尼泊尔', en: 'Nepal' }, region: 'south-asia' },
  { iso2: 'BT', name: { zh: '不丹', en: 'Bhutan' }, region: 'south-asia' },
  { iso2: 'MV', name: { zh: '马尔代夫', en: 'Maldives' }, region: 'south-asia' },
  { iso2: 'AF', name: { zh: '阿富汗', en: 'Afghanistan' }, region: 'south-asia' },

  { iso2: 'SA', name: { zh: '沙特阿拉伯', en: 'Saudi Arabia' }, region: 'middle-east' },
  { iso2: 'AE', name: { zh: '阿联酋', en: 'United Arab Emirates' }, region: 'middle-east' },
  { iso2: 'IR', name: { zh: '伊朗', en: 'Iran' }, region: 'middle-east' },
  { iso2: 'IQ', name: { zh: '伊拉克', en: 'Iraq' }, region: 'middle-east' },
  { iso2: 'IL', name: { zh: '以色列', en: 'Israel' }, region: 'middle-east' },
  { iso2: 'JO', name: { zh: '约旦', en: 'Jordan' }, region: 'middle-east' },
  { iso2: 'LB', name: { zh: '黎巴嫩', en: 'Lebanon' }, region: 'middle-east' },
  { iso2: 'SY', name: { zh: '叙利亚', en: 'Syria' }, region: 'middle-east' },
  { iso2: 'KW', name: { zh: '科威特', en: 'Kuwait' }, region: 'middle-east' },
  { iso2: 'BH', name: { zh: '巴林', en: 'Bahrain' }, region: 'middle-east' },
  { iso2: 'QA', name: { zh: '卡塔尔', en: 'Qatar' }, region: 'middle-east' },
  { iso2: 'OM', name: { zh: '阿曼', en: 'Oman' }, region: 'middle-east' },
  { iso2: 'YE', name: { zh: '也门', en: 'Yemen' }, region: 'middle-east' },
  { iso2: 'TR', name: { zh: '土耳其', en: 'Türkiye' }, region: 'middle-east' },
  { iso2: 'CY', name: { zh: '塞浦路斯', en: 'Cyprus' }, region: 'middle-east' },
];

const POLICY_TEMPLATES = {
  air: {
    title: {
      zh: ['修订大气污染物排放标准', '发布 PM2.5 与臭氧协同控制路线图', '工业锅炉超低排放限值更新'],
      en: ['Updates ambient air pollutant emission standards', 'Releases PM2.5 & ozone coordinated control roadmap', 'Tightens ultra-low emission limits for industrial boilers'],
    },
    summary: {
      zh: '新规覆盖颗粒物、SO₂、NOx 与 VOCs 排放限值，要求重点排放源安装连续在线监测系统并接入国家平台。',
      en: 'New rules tighten PM, SO₂, NOx and VOC limits; major emitters must install continuous emission monitoring systems (CEMS) connected to the national data platform.',
    },
    tags: ['air-quality', 'emissions', 'CEMS'],
  },
  water: {
    title: {
      zh: ['更新地表水环境质量标准', '工业园区废水集中处理新规', '饮用水水源地保护条例修订'],
      en: ['Updates surface water environmental quality standards', 'New centralized wastewater rules for industrial parks', 'Amends drinking-water source protection regulations'],
    },
    summary: {
      zh: '进一步收紧化学需氧量、氨氮与总磷排放限值，要求重点行业安装在线水质监测仪并实时上报。',
      en: 'Tightens COD, ammonia and total-phosphorus limits; key industries must deploy online water-quality analyzers with real-time reporting.',
    },
    tags: ['water-quality', 'wastewater', 'monitoring'],
  },
  waste: {
    title: {
      zh: ['危险废物跨省转移审批办法', '电子废弃物生产者责任延伸方案', '塑料污染治理行动方案'],
      en: ['Approval process for transboundary hazardous-waste transfer', 'EPR scheme for e-waste producers', 'Action plan for plastic pollution control'],
    },
    summary: {
      zh: '明确危废分类、追溯与处置责任，鼓励企业使用智能称重与 RFID 跟踪系统提升监管透明度。',
      en: 'Clarifies hazardous-waste classification, traceability and disposal; encourages smart weighing and RFID tracking for better oversight.',
    },
    tags: ['hazardous-waste', 'EPR', 'circular-economy'],
  },
  biodiversity: {
    title: {
      zh: ['国家生物多样性保护战略与行动计划', '新建自然保护区管理办法', '打击野生动植物非法贸易新规'],
      en: ['National biodiversity strategy and action plan', 'New rules for establishing nature reserves', 'Crackdown on illegal wildlife trade'],
    },
    summary: {
      zh: '强调生态系统完整性保护、栖息地连通性及跨境执法联动，要求建立生物多样性监测网络。',
      en: 'Emphasizes ecosystem integrity, habitat connectivity and cross-border enforcement; mandates a national biodiversity monitoring network.',
    },
    tags: ['biodiversity', 'protected-area', 'wildlife'],
  },
  climate: {
    title: {
      zh: ['新一轮国家自主贡献方案', '碳排放权交易管理办法修订', '重点行业温室气体核算指南'],
      en: ['Updated Nationally Determined Contribution', 'Amended carbon emissions trading rules', 'GHG accounting guidelines for key industries'],
    },
    summary: {
      zh: '扩大碳市场覆盖行业范围，引入 CCER 抵消机制，推动排放数据 MRV 体系建设。',
      en: 'Expands ETS sector coverage, introduces CCER offset mechanism, and accelerates MRV systems for emission data.',
    },
    tags: ['climate', 'NDC', 'carbon-market', 'MRV'],
  },
  industrial: {
    title: {
      zh: ['重点行业清洁生产审核办法', '重金属污染防控方案', '化工行业 VOCs 综合治理通知'],
      en: ['Cleaner-production audit rules for key industries', 'Heavy-metal pollution prevention plan', 'Integrated VOCs control for the chemicals sector'],
    },
    summary: {
      zh: '推动源头减排与全过程控制，要求企业定期提交排放清单并接受第三方核查。',
      en: 'Promotes source reduction and end-to-end control; companies must report emission inventories and undergo third-party verification.',
    },
    tags: ['industrial', 'cleaner-production', 'VOC'],
  },
  monitoring: {
    title: {
      zh: ['生态环境监测网络建设规划', '社会化生态环境监测机构监督办法', '环境质量排名与信息公开办法'],
      en: ['Plan for eco-environment monitoring network', 'Supervision rules for third-party monitoring institutions', 'Rules on environmental quality ranking & disclosure'],
    },
    summary: {
      zh: '完善天空地海一体化监测体系，鼓励国产高精度监测仪器应用，建立数据质量追溯制度。',
      en: 'Builds a sky-air-ground-sea integrated monitoring system; encourages domestic high-precision instruments and data-quality traceability.',
    },
    tags: ['monitoring-network', 'QA-QC', 'disclosure'],
  },
  general: {
    title: {
      zh: ['生态环境法典编纂工作进展', '环境信息依法披露制度改革', '生态环境保护督察整改方案'],
      en: ['Progress on the eco-environment code', 'Reform of statutory environmental information disclosure', 'Central inspection rectification plan'],
    },
    summary: {
      zh: '强化企业环境信息依法披露要求，扩大督察范围，推动生态环境治理体系现代化。',
      en: 'Strengthens mandatory disclosure of corporate environmental information, broadens central inspections, and modernizes eco-environment governance.',
    },
    tags: ['governance', 'disclosure', 'inspection'],
  },
};

const PRODUCTS = [
  { cat: 'air-monitor',     hs: '9027.20', zh: '大气污染物在线监测仪',         en: 'Continuous ambient air pollutant monitor' },
  { cat: 'air-monitor',     hs: '9027.30', zh: '烟气在线监测系统 (CEMS)',      en: 'Continuous emission monitoring system (CEMS)' },
  { cat: 'water-monitor',   hs: '9027.80', zh: '水质在线分析仪 (COD/氨氮/总磷)', en: 'Online water-quality analyzer (COD/NH3-N/TP)' },
  { cat: 'water-monitor',   hs: '9027.80', zh: '重金属在线监测仪',               en: 'Online heavy-metal water monitor' },
  { cat: 'soil-monitor',    hs: '9027.80', zh: '土壤重金属检测仪',               en: 'Soil heavy-metal detector' },
  { cat: 'noise-monitor',   hs: '9027.80', zh: '噪声自动监测仪',                 en: 'Automatic noise monitor' },
  { cat: 'lab-equipment',   hs: '9027.20', zh: '气相色谱-质谱联用仪 (GC-MS)',    en: 'Gas chromatograph–mass spectrometer (GC-MS)' },
  { cat: 'emissions-control', hs: '8421.39', zh: '工业除尘设备',                  en: 'Industrial dust collector' },
  { cat: 'emissions-control', hs: '8421.99', zh: '脱硫脱硝装置',                  en: 'Flue-gas desulfurization & denitrification unit' },
  { cat: 'waste-treatment', hs: '8479.89', zh: '危废处置成套设备',               en: 'Hazardous-waste treatment equipment' },
  { cat: 'waste-treatment', hs: '8479.89', zh: '污水处理一体化装置',             en: 'Integrated wastewater treatment unit' },
];

const PARTNERS = ['CN', 'DE', 'JP', 'US', 'KR', 'SG', 'GB', 'FR', 'IT', 'NL', 'IN', 'AE'];

export function buildSeedPolicies() {
  const out = [];
  const rng = srandom('policy-' + TODAY);
  for (const c of COUNTRIES) {
    const n = 2 + Math.floor(rng() * 3); // 2-4 per country
    for (let i = 0; i < n; i++) {
      const cats = Object.keys(POLICY_TEMPLATES);
      const cat = pickRandom(cats, rng);
      const tpl = POLICY_TEMPLATES[cat];
      const titleZh = pickRandom(tpl.title.zh, rng);
      const titleEn = pickRandom(tpl.title.en, rng);
      const daysAgo = Math.floor(rng() * 30);
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - daysAgo);
      const isoDate = d.toISOString().slice(0, 10);
      out.push({
        id: `${c.iso2}-${i}-${isoDate}`,
        country: c.iso2,
        countryName: c.name,
        region: c.region,
        title: { zh: titleZh, en: titleEn },
        summary: { zh: tpl.summary.zh, en: tpl.summary.en },
        source: `${c.name.en} Ministry of Ecology / Environment Authority`,
        url: `https://example.gov/${c.iso2.toLowerCase()}/policy/${i}`,
        publishedAt: isoDate,
        category: cat,
        tags: tpl.tags,
      });
    }
  }
  return out;
}

export function buildSeedTrade() {
  const out = [];
  const rng = srandom('trade-' + TODAY);
  const period = new Date();
  period.setUTCMonth(period.getUTCMonth() - 1);
  const periodStr = `${period.getUTCFullYear()}-${String(period.getUTCMonth() + 1).padStart(2, '0')}`;
  for (const c of COUNTRIES) {
    const n = 4 + Math.floor(rng() * 5); // 4-8 per country per month
    for (let i = 0; i < n; i++) {
      const p = pickRandom(PRODUCTS, rng);
      const flow = rng() > 0.35 ? 'import' : 'export';
      const partner = pickRandom(PARTNERS.filter((x) => x !== c.iso2), rng);
      const quantity = 5 + Math.floor(rng() * 480);
      const unitPrice = 1500 + Math.floor(rng() * 45000);
      const value = quantity * unitPrice;
      out.push({
        id: `${c.iso2}-${p.cat}-${flow}-${periodStr}-${i}`,
        country: c.iso2,
        countryName: c.name,
        region: c.region,
        hsCode: p.hs,
        productCategory: p.cat,
        productName: { zh: p.zh, en: p.en },
        flow,
        value,
        quantity,
        unitName: p.cat === 'lab-equipment' ? 'set' : 'unit',
        partner,
        period: periodStr,
      });
    }
  }
  return out;
}