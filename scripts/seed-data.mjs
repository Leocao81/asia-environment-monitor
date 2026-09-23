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

// ---------------------------------------------------------------------------
// Trade reference data
// ---------------------------------------------------------------------------

/** Products with HS codes, product category and the site types they serve. */
const PRODUCTS = [
  { cat: 'air-monitor',       hs: '9027.10', zh: '环境空气气态污染物分析仪',     en: 'Ambient air gaseous pollutant analyzer',      sites: ['urban-air-station', 'industrial-park'] },
  { cat: 'air-monitor',       hs: '9027.20', zh: 'PM2.5/PM10 颗粒物监测仪',      en: 'PM2.5 / PM10 particulate monitor',            sites: ['urban-air-station', 'port-customs'] },
  { cat: 'air-monitor',       hs: '9027.30', zh: '烟气连续排放监测系统 (CEMS)',   en: 'Continuous emission monitoring system (CEMS)', sites: ['industrial-park'] },
  { cat: 'air-monitor',       hs: '9027.10', zh: 'VOCs 在线监测系统',             en: 'Online VOC monitoring system',                sites: ['industrial-park', 'urban-air-station'] },
  { cat: 'water-monitor',     hs: '9027.80', zh: '水质 COD/氨氮在线分析仪',       en: 'Online COD / ammonia analyzer',               sites: ['watershed-section', 'industrial-park'] },
  { cat: 'water-monitor',     hs: '9027.80', zh: '水质重金属在线监测仪',           en: 'Online heavy-metal water monitor',            sites: ['watershed-section', 'drinking-water-source'] },
  { cat: 'water-monitor',     hs: '9027.80', zh: '多参数水质监测浮标',             en: 'Multi-parameter water quality buoy',          sites: ['watershed-section', 'drinking-water-source'] },
  { cat: 'water-monitor',     hs: '9027.80', zh: '总磷总氮在线分析仪',             en: 'Online total-P / total-N analyzer',           sites: ['watershed-section'] },
  { cat: 'soil-monitor',      hs: '9027.80', zh: '土壤重金属检测仪',               en: 'Soil heavy-metal detector',                   sites: ['soil-site'] },
  { cat: 'soil-monitor',      hs: '9027.80', zh: '土壤墒情与盐分监测系统',         en: 'Soil moisture & salinity monitoring system',  sites: ['soil-site'] },
  { cat: 'noise-monitor',     hs: '9027.80', zh: '环境噪声自动监测仪',             en: 'Automatic ambient noise monitor',             sites: ['noise-site'] },
  { cat: 'noise-monitor',     hs: '9027.80', zh: '交通噪声在线监测终端',           en: 'Traffic noise monitoring terminal',           sites: ['noise-site', 'port-customs'] },
  { cat: 'lab-equipment',     hs: '9027.20', zh: '气相色谱-质谱联用仪 (GC-MS)',    en: 'Gas chromatograph–mass spectrometer (GC-MS)', sites: ['laboratory'] },
  { cat: 'lab-equipment',     hs: '9027.10', zh: '电感耦合等离子体质谱仪 (ICP-MS)', en: 'ICP-MS spectrometer',                        sites: ['laboratory'] },
  { cat: 'lab-equipment',     hs: '9027.30', zh: '紫外可见分光光度计',             en: 'UV-Vis spectrophotometer',                    sites: ['laboratory'] },
  { cat: 'emissions-control', hs: '8421.39', zh: '工业烟气除尘设备',               en: 'Industrial flue-gas dust collector',          sites: ['industrial-park'] },
  { cat: 'emissions-control', hs: '8421.99', zh: '脱硫脱硝成套装置',               en: 'Flue-gas desulfurization & denitrification unit', sites: ['industrial-park'] },
  { cat: 'emissions-control', hs: '8414.59', zh: '工业废气收集与风机系统',         en: 'Industrial waste-gas collection & blower system', sites: ['industrial-park'] },
  { cat: 'emissions-control', hs: '8421.39', zh: '机动车尾气遥感检测设备',         en: 'Vehicle exhaust remote-sensing device',       sites: ['vehicle-emission'] },
  { cat: 'waste-treatment',   hs: '8479.89', zh: '危险废物处置成套设备',           en: 'Hazardous-waste treatment equipment',         sites: ['industrial-park'] },
  { cat: 'waste-treatment',   hs: '8479.89', zh: '一体化污水处理装置',             en: 'Integrated wastewater treatment unit',        sites: ['industrial-park', 'watershed-section'] },
  { cat: 'waste-treatment',   hs: '8419.89', zh: '医疗废物高温蒸煮设备',           en: 'Medical-waste autoclave system',              sites: ['laboratory', 'industrial-park'] },
];

/** Trade partners with localized names (ISO 3166-1 alpha-2). */
const PARTNERS = [
  { iso2: 'CN', name: { zh: '中国',       en: 'China' } },
  { iso2: 'DE', name: { zh: '德国',       en: 'Germany' } },
  { iso2: 'JP', name: { zh: '日本',       en: 'Japan' } },
  { iso2: 'US', name: { zh: '美国',       en: 'United States' } },
  { iso2: 'KR', name: { zh: '韩国',       en: 'South Korea' } },
  { iso2: 'SG', name: { zh: '新加坡',     en: 'Singapore' } },
  { iso2: 'GB', name: { zh: '英国',       en: 'United Kingdom' } },
  { iso2: 'FR', name: { zh: '法国',       en: 'France' } },
  { iso2: 'IT', name: { zh: '意大利',     en: 'Italy' } },
  { iso2: 'NL', name: { zh: '荷兰',       en: 'Netherlands' } },
  { iso2: 'CH', name: { zh: '瑞士',       en: 'Switzerland' } },
  { iso2: 'SE', name: { zh: '瑞典',       en: 'Sweden' } },
  { iso2: 'FI', name: { zh: '芬兰',       en: 'Finland' } },
  { iso2: 'DK', name: { zh: '丹麦',       en: 'Denmark' } },
  { iso2: 'PL', name: { zh: '波兰',       en: 'Poland' } },
  { iso2: 'CZ', name: { zh: '捷克',       en: 'Czechia' } },
  { iso2: 'AT', name: { zh: '奥地利',     en: 'Austria' } },
  { iso2: 'ES', name: { zh: '西班牙',     en: 'Spain' } },
  { iso2: 'IN', name: { zh: '印度',       en: 'India' } },
  { iso2: 'TR', name: { zh: '土耳其',     en: 'Türkiye' } },
  { iso2: 'RU', name: { zh: '俄罗斯',     en: 'Russia' } },
  { iso2: 'AE', name: { zh: '阿联酋',     en: 'United Arab Emirates' } },
  { iso2: 'MY', name: { zh: '马来西亚',   en: 'Malaysia' } },
  { iso2: 'TH', name: { zh: '泰国',       en: 'Thailand' } },
  { iso2: 'VN', name: { zh: '越南',       en: 'Vietnam' } },
  { iso2: 'CA', name: { zh: '加拿大',     en: 'Canada' } },
  { iso2: 'AU', name: { zh: '澳大利亚',   en: 'Australia' } },
  { iso2: 'IL', name: { zh: '以色列',     en: 'Israel' } },
  { iso2: 'SA', name: { zh: '沙特阿拉伯', en: 'Saudi Arabia' } },
];

/** Cities + customs districts per country, used to build realistic 点位 names. */
const GEO = {
  KZ: { cities: [['阿拉木图', 'Almaty'], ['阿斯塔纳', 'Astana'], ['奇姆肯特', 'Shymkent']], ports: [['霍尔果斯口岸', 'Khorgos Port'], ['阿拉木图关区', 'Almaty Customs']] },
  UZ: { cities: [['塔什干', 'Tashkent'], ['撒马尔罕', 'Samarkand'], ['布哈拉', 'Bukhara']], ports: [['塔什干关区', 'Tashkent Customs']] },
  KG: { cities: [['比什凯克', 'Bishkek'], ['奥什', 'Osh']], ports: [['比什凯克关区', 'Bishkek Customs']] },
  TJ: { cities: [['杜尚别', 'Dushanbe'], ['苦盏', 'Khujand']], ports: [['杜尚别关区', 'Dushanbe Customs']] },
  TM: { cities: [['阿什哈巴德', 'Ashgabat'], ['土库曼纳巴德', 'Turkmenabat']], ports: [['阿什哈巴德关区', 'Ashgabat Customs']] },

  ID: { cities: [['雅加达', 'Jakarta'], ['泗水', 'Surabaya'], ['万隆', 'Bandung'], ['棉兰', 'Medan']], ports: [['丹戎不碌港', 'Tanjung Priok Port'], ['泗水港', 'Tanjung Perak Port']] },
  TH: { cities: [['曼谷', 'Bangkok'], ['清迈', 'Chiang Mai'], ['罗勇', 'Rayong']], ports: [['林查班港', 'Laem Chabang Port'], ['曼谷关区', 'Bangkok Customs']] },
  VN: { cities: [['河内', 'Hanoi'], ['胡志明市', 'Ho Chi Minh City'], ['岘港', 'Da Nang']], ports: [['海防港', 'Hai Phong Port'], ['盖梅港', 'Cai Mep Port']] },
  MY: { cities: [['吉隆坡', 'Kuala Lumpur'], ['槟城', 'Penang'], ['柔佛', 'Johor']], ports: [['巴生港', 'Port Klang'], ['槟城港', 'Penang Port']] },
  PH: { cities: [['马尼拉', 'Manila'], ['宿务', 'Cebu'], ['达沃', 'Davao']], ports: [['马尼拉港', 'Port of Manila'], ['苏比克湾', 'Subic Bay']] },
  SG: { cities: [['新加坡', 'Singapore'], ['裕廊', 'Jurong']], ports: [['新加坡港', 'Port of Singapore']] },
  MM: { cities: [['仰光', 'Yangon'], ['曼德勒', 'Mandalay']], ports: [['仰光港', 'Yangon Port']] },
  KH: { cities: [['金边', 'Phnom Penh'], ['西哈努克', 'Sihanoukville']], ports: [['西哈努克港', 'Sihanoukville Port']] },
  LA: { cities: [['万象', 'Vientiane'], ['琅勃拉邦', 'Luang Prabang']], ports: [['万象关区', 'Vientiane Customs']] },
  BN: { cities: [['斯里巴加湾', 'Bandar Seri Begawan']], ports: [['穆阿拉港', 'Muara Port']] },
  TL: { cities: [['帝力', 'Dili']], ports: [['帝力港', 'Port of Dili']] },

  IN: { cities: [['新德里', 'New Delhi'], ['孟买', 'Mumbai'], ['钦奈', 'Chennai'], ['班加罗尔', 'Bengaluru']], ports: [['那瓦舍瓦港', 'Nhava Sheva Port'], ['金奈港', 'Chennai Port']] },
  PK: { cities: [['卡拉奇', 'Karachi'], ['拉合尔', 'Lahore'], ['伊斯兰堡', 'Islamabad']], ports: [['卡拉奇港', 'Port of Karachi'], ['卡西姆港', 'Port Qasim']] },
  BD: { cities: [['达卡', 'Dhaka'], ['吉大港', 'Chattogram']], ports: [['吉大港', 'Chattogram Port']] },
  LK: { cities: [['科伦坡', 'Colombo'], ['康提', 'Kandy']], ports: [['科伦坡港', 'Port of Colombo']] },
  NP: { cities: [['加德满都', 'Kathmandu'], ['博卡拉', 'Pokhara']], ports: [['加德满都关区', 'Kathmandu Customs']] },
  BT: { cities: [['廷布', 'Thimphu']], ports: [['廷布关区', 'Thimphu Customs']] },
  MV: { cities: [['马累', 'Malé']], ports: [['马累港', 'Port of Malé']] },
  AF: { cities: [['喀布尔', 'Kabul'], ['坎大哈', 'Kandahar']], ports: [['喀布尔关区', 'Kabul Customs']] },

  SA: { cities: [['利雅得', 'Riyadh'], ['吉达', 'Jeddah'], ['达曼', 'Dammam']], ports: [['吉达伊斯兰港', 'Jeddah Islamic Port'], ['达曼港', 'King Abdulaziz Port']] },
  AE: { cities: [['迪拜', 'Dubai'], ['阿布扎比', 'Abu Dhabi'], ['沙迦', 'Sharjah']], ports: [['杰贝阿里港', 'Jebel Ali Port'], ['哈利法港', 'Khalifa Port']] },
  IR: { cities: [['德黑兰', 'Tehran'], ['伊斯法罕', 'Isfahan'], ['阿巴斯港', 'Bandar Abbas']], ports: [['阿巴斯港', 'Shahid Rajaee Port']] },
  IQ: { cities: [['巴格达', 'Baghdad'], ['巴士拉', 'Basra']], ports: [['乌姆盖斯尔港', 'Umm Qasr Port']] },
  IL: { cities: [['特拉维夫', 'Tel Aviv'], ['海法', 'Haifa']], ports: [['海法港', 'Port of Haifa'], ['阿什杜德港', 'Ashdod Port']] },
  JO: { cities: [['安曼', 'Amman'], ['亚喀巴', 'Aqaba']], ports: [['亚喀巴港', 'Port of Aqaba']] },
  LB: { cities: [['贝鲁特', 'Beirut']], ports: [['贝鲁特港', 'Port of Beirut']] },
  SY: { cities: [['大马士革', 'Damascus'], ['阿勒颇', 'Aleppo']], ports: [['拉塔基亚港', 'Latakia Port']] },
  KW: { cities: [['科威特城', 'Kuwait City']], ports: [['舒瓦伊赫港', 'Shuwaikh Port']] },
  BH: { cities: [['麦纳麦', 'Manama']], ports: [['哈利法本萨勒曼港', 'Khalifa Bin Salman Port']] },
  QA: { cities: [['多哈', 'Doha']], ports: [['哈马德港', 'Hamad Port']] },
  OM: { cities: [['马斯喀特', 'Muscat'], ['塞拉莱', 'Salalah']], ports: [['塞拉莱港', 'Port of Salalah'], ['苏哈尔港', 'Sohar Port']] },
  YE: { cities: [['萨那', 'Sanaa'], ['亚丁', 'Aden']], ports: [['亚丁港', 'Port of Aden']] },
  TR: { cities: [['伊斯坦布尔', 'Istanbul'], ['安卡拉', 'Ankara'], ['伊兹密尔', 'Izmir']], ports: [['安巴利港', 'Ambarli Port'], ['梅尔辛港', 'Mersin Port']] },
  CY: { cities: [['尼科西亚', 'Nicosia'], ['利马索尔', 'Limassol']], ports: [['利马索尔港', 'Port of Limassol']] },
};

const SITE_NAME_SUFFIX = {
  'urban-air-station':     { zh: '环境空气自动监测站', en: 'Air Quality Monitoring Station' },
  'industrial-park':       { zh: '工业园区监测点',     en: 'Industrial Park Monitoring Point' },
  'watershed-section':     { zh: '流域断面监测站',     en: 'Watershed Section Station' },
  'drinking-water-source': { zh: '饮用水水源地监测点', en: 'Drinking Water Source Point' },
  'soil-site':             { zh: '土壤环境监测点',     en: 'Soil Monitoring Site' },
  'noise-site':            { zh: '声环境功能区监测点', en: 'Noise Functional Area Point' },
  'port-customs':          { zh: '港区环境监测点',     en: 'Port Area Monitoring Point' },
  'vehicle-emission':      { zh: '机动车尾气检测站',   en: 'Vehicle Emission Testing Station' },
  laboratory:              { zh: '环境检测实验室',     en: 'Environmental Testing Laboratory' },
};

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

/**
 * How many months of trade history to generate (including the current month).
 */
const TRADE_MONTHS = 6;

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

function monthString(offset) {
  const d = new Date();
  d.setUTCDate(1); // avoid month-end overflow
  d.setUTCMonth(d.getUTCMonth() - offset);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function buildSeedTrade() {
  const out = [];
  const rng = srandom('trade-' + TODAY);

  for (const c of COUNTRIES) {
    const geo = GEO[c.iso2] ?? {
      cities: [[c.name.zh, c.name.en]],
      ports: [[`${c.name.zh}关区`, `${c.name.en} Customs`]],
    };

    for (let m = 0; m < TRADE_MONTHS; m++) {
      const period = monthString(m);
      // 4-7 records per country per month → ~6 months × 39 countries × ~5.5 ≈ 1300
      const n = 4 + Math.floor(rng() * 4);

      for (let i = 0; i < n; i++) {
        const product = pickRandom(PRODUCTS, rng);
        const siteType = pickRandom(product.sites, rng);
        const [cityZh, cityEn] = pickRandom(geo.cities, rng);
        const [portZh, portEn] = pickRandom(geo.ports, rng);
        const partner = pickRandom(PARTNERS.filter((x) => x.iso2 !== c.iso2), rng);

        // Imports dominate for monitoring equipment in these regions.
        const flow = rng() > 0.3 ? 'import' : 'export';

        const suffix = SITE_NAME_SUFFIX[siteType];
        const seq = 1 + Math.floor(rng() * 9);
        const quantity = 2 + Math.floor(rng() * 320);
        const unitPrice = 1200 + Math.floor(rng() * 52000);
        const value = quantity * unitPrice;

        out.push({
          id: `${c.iso2}-${period}-${product.cat}-${flow}-${i}`,
          country: c.iso2,
          countryName: c.name,
          region: c.region,
          hsCode: product.hs,
          productCategory: product.cat,
          productName: { zh: product.zh, en: product.en },
          flow,
          value,
          quantity,
          unitName: product.cat === 'lab-equipment' ? 'set' : 'unit',
          partner: partner.iso2,
          partnerName: partner.name,
          siteType,
          siteName: `${cityZh}${suffix.zh} #${seq} / ${cityEn} ${suffix.en} #${seq}`,
          customsPort: `${portZh} / ${portEn}`,
          period,
        });
      }
    }
  }
  return out;
}