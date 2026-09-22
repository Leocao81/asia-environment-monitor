import type { LocalizedText, RegionId } from './types';

export type Region = {
  id: RegionId;
  name: LocalizedText;
  short: LocalizedText;
  description: LocalizedText;
  /** Accent color class (Tailwind) */
  accent: string;
  /** Soft accent background class */
  accentSoft: string;
};

export const REGIONS: Region[] = [
  {
    id: 'central-asia',
    name: { zh: '中亚', en: 'Central Asia' },
    short: { zh: '中亚', en: 'CA' },
    description: {
      zh: '哈萨克斯坦、乌兹别克斯坦、吉尔吉斯斯坦、塔吉克斯坦、土库曼斯坦五国的环境监管政策动态与监测设备贸易数据。',
      en: 'Environmental regulatory updates and monitoring equipment trade data for Kazakhstan, Uzbekistan, Kyrgyzstan, Tajikistan and Turkmenistan.',
    },
    accent: 'bg-region-central-asia',
    accentSoft: 'bg-sky-50',
  },
  {
    id: 'southeast-asia',
    name: { zh: '东南亚', en: 'Southeast Asia' },
    short: { zh: '东南亚', en: 'SEA' },
    description: {
      zh: '覆盖东盟 11 国：印度尼西亚、泰国、越南、马来西亚、菲律宾、新加坡、缅甸、柬埔寨、老挝、文莱、东帝汶。',
      en: 'Covering ASEAN-11: Indonesia, Thailand, Vietnam, Malaysia, Philippines, Singapore, Myanmar, Cambodia, Laos, Brunei and Timor-Leste.',
    },
    accent: 'bg-region-southeast-asia',
    accentSoft: 'bg-emerald-50',
  },
  {
    id: 'south-asia',
    name: { zh: '南亚', en: 'South Asia' },
    short: { zh: '南亚', en: 'SA' },
    description: {
      zh: '印度、巴基斯坦、孟加拉国、斯里兰卡、尼泊尔、不丹、马尔代夫、阿富汗八国环境治理与监测设备进出口。',
      en: 'India, Pakistan, Bangladesh, Sri Lanka, Nepal, Bhutan, Maldives and Afghanistan environmental governance & monitoring equipment trade.',
    },
    accent: 'bg-region-south-asia',
    accentSoft: 'bg-amber-50',
  },
  {
    id: 'middle-east',
    name: { zh: '中东', en: 'Middle East' },
    short: { zh: '中东', en: 'ME' },
    description: {
      zh: '沙特、阿联酋、伊朗、伊拉克、以色列、约旦、黎巴嫩、叙利亚、科威特、巴林、卡塔尔、阿曼、也门、土耳其、塞浦路斯。',
      en: 'Saudi Arabia, UAE, Iran, Iraq, Israel, Jordan, Lebanon, Syria, Kuwait, Bahrain, Qatar, Oman, Yemen, Türkiye and Cyprus.',
    },
    accent: 'bg-region-middle-east',
    accentSoft: 'bg-violet-50',
  },
];

export const getRegion = (id: RegionId): Region | undefined =>
  REGIONS.find((r) => r.id === id);

export type Country = {
  iso2: string;
  iso3: string;
  name: LocalizedText;
  capital: LocalizedText;
  region: RegionId;
  /** Currency ISO 4217 */
  currency: string;
};

export const COUNTRIES: Country[] = [
  // Central Asia
  { iso2: 'KZ', iso3: 'KAZ', name: { zh: '哈萨克斯坦', en: 'Kazakhstan' }, capital: { zh: '阿斯塔纳', en: 'Astana' }, region: 'central-asia', currency: 'KZT' },
  { iso2: 'UZ', iso3: 'UZB', name: { zh: '乌兹别克斯坦', en: 'Uzbekistan' }, capital: { zh: '塔什干', en: 'Tashkent' }, region: 'central-asia', currency: 'UZS' },
  { iso2: 'KG', iso3: 'KGZ', name: { zh: '吉尔吉斯斯坦', en: 'Kyrgyzstan' }, capital: { zh: '比什凯克', en: 'Bishkek' }, region: 'central-asia', currency: 'KGS' },
  { iso2: 'TJ', iso3: 'TJK', name: { zh: '塔吉克斯坦', en: 'Tajikistan' }, capital: { zh: '杜尚别', en: 'Dushanbe' }, region: 'central-asia', currency: 'TJS' },
  { iso2: 'TM', iso3: 'TKM', name: { zh: '土库曼斯坦', en: 'Turkmenistan' }, capital: { zh: '阿什哈巴德', en: 'Ashgabat' }, region: 'central-asia', currency: 'TMT' },

  // Southeast Asia
  { iso2: 'ID', iso3: 'IDN', name: { zh: '印度尼西亚', en: 'Indonesia' }, capital: { zh: '雅加达', en: 'Jakarta' }, region: 'southeast-asia', currency: 'IDR' },
  { iso2: 'TH', iso3: 'THA', name: { zh: '泰国', en: 'Thailand' }, capital: { zh: '曼谷', en: 'Bangkok' }, region: 'southeast-asia', currency: 'THB' },
  { iso2: 'VN', iso3: 'VNM', name: { zh: '越南', en: 'Vietnam' }, capital: { zh: '河内', en: 'Hanoi' }, region: 'southeast-asia', currency: 'VND' },
  { iso2: 'MY', iso3: 'MYS', name: { zh: '马来西亚', en: 'Malaysia' }, capital: { zh: '吉隆坡', en: 'Kuala Lumpur' }, region: 'southeast-asia', currency: 'MYR' },
  { iso2: 'PH', iso3: 'PHL', name: { zh: '菲律宾', en: 'Philippines' }, capital: { zh: '马尼拉', en: 'Manila' }, region: 'southeast-asia', currency: 'PHP' },
  { iso2: 'SG', iso3: 'SGP', name: { zh: '新加坡', en: 'Singapore' }, capital: { zh: '新加坡', en: 'Singapore' }, region: 'southeast-asia', currency: 'SGD' },
  { iso2: 'MM', iso3: 'MMR', name: { zh: '缅甸', en: 'Myanmar' }, capital: { zh: '内比都', en: 'Naypyidaw' }, region: 'southeast-asia', currency: 'MMK' },
  { iso2: 'KH', iso3: 'KHM', name: { zh: '柬埔寨', en: 'Cambodia' }, capital: { zh: '金边', en: 'Phnom Penh' }, region: 'southeast-asia', currency: 'KHR' },
  { iso2: 'LA', iso3: 'LAO', name: { zh: '老挝', en: 'Laos' }, capital: { zh: '万象', en: 'Vientiane' }, region: 'southeast-asia', currency: 'LAK' },
  { iso2: 'BN', iso3: 'BRN', name: { zh: '文莱', en: 'Brunei' }, capital: { zh: '斯里巴加湾', en: 'Bandar Seri Begawan' }, region: 'southeast-asia', currency: 'BND' },
  { iso2: 'TL', iso3: 'TLS', name: { zh: '东帝汶', en: 'Timor-Leste' }, capital: { zh: '帝力', en: 'Dili' }, region: 'southeast-asia', currency: 'USD' },

  // South Asia
  { iso2: 'IN', iso3: 'IND', name: { zh: '印度', en: 'India' }, capital: { zh: '新德里', en: 'New Delhi' }, region: 'south-asia', currency: 'INR' },
  { iso2: 'PK', iso3: 'PAK', name: { zh: '巴基斯坦', en: 'Pakistan' }, capital: { zh: '伊斯兰堡', en: 'Islamabad' }, region: 'south-asia', currency: 'PKR' },
  { iso2: 'BD', iso3: 'BGD', name: { zh: '孟加拉国', en: 'Bangladesh' }, capital: { zh: '达卡', en: 'Dhaka' }, region: 'south-asia', currency: 'BDT' },
  { iso2: 'LK', iso3: 'LKA', name: { zh: '斯里兰卡', en: 'Sri Lanka' }, capital: { zh: '科伦坡', en: 'Colombo' }, region: 'south-asia', currency: 'LKR' },
  { iso2: 'NP', iso3: 'NPL', name: { zh: '尼泊尔', en: 'Nepal' }, capital: { zh: '加德满都', en: 'Kathmandu' }, region: 'south-asia', currency: 'NPR' },
  { iso2: 'BT', iso3: 'BTN', name: { zh: '不丹', en: 'Bhutan' }, capital: { zh: '廷布', en: 'Thimphu' }, region: 'south-asia', currency: 'BTN' },
  { iso2: 'MV', iso3: 'MDV', name: { zh: '马尔代夫', en: 'Maldives' }, capital: { zh: '马累', en: 'Malé' }, region: 'south-asia', currency: 'MVR' },
  { iso2: 'AF', iso3: 'AFG', name: { zh: '阿富汗', en: 'Afghanistan' }, capital: { zh: '喀布尔', en: 'Kabul' }, region: 'south-asia', currency: 'AFN' },

  // Middle East
  { iso2: 'SA', iso3: 'SAU', name: { zh: '沙特阿拉伯', en: 'Saudi Arabia' }, capital: { zh: '利雅得', en: 'Riyadh' }, region: 'middle-east', currency: 'SAR' },
  { iso2: 'AE', iso3: 'ARE', name: { zh: '阿联酋', en: 'United Arab Emirates' }, capital: { zh: '阿布扎比', en: 'Abu Dhabi' }, region: 'middle-east', currency: 'AED' },
  { iso2: 'IR', iso3: 'IRN', name: { zh: '伊朗', en: 'Iran' }, capital: { zh: '德黑兰', en: 'Tehran' }, region: 'middle-east', currency: 'IRR' },
  { iso2: 'IQ', iso3: 'IRQ', name: { zh: '伊拉克', en: 'Iraq' }, capital: { zh: '巴格达', en: 'Baghdad' }, region: 'middle-east', currency: 'IQD' },
  { iso2: 'IL', iso3: 'ISR', name: { zh: '以色列', en: 'Israel' }, capital: { zh: '耶路撒冷', en: 'Jerusalem' }, region: 'middle-east', currency: 'ILS' },
  { iso2: 'JO', iso3: 'JOR', name: { zh: '约旦', en: 'Jordan' }, capital: { zh: '安曼', en: 'Amman' }, region: 'middle-east', currency: 'JOD' },
  { iso2: 'LB', iso3: 'LBN', name: { zh: '黎巴嫩', en: 'Lebanon' }, capital: { zh: '贝鲁特', en: 'Beirut' }, region: 'middle-east', currency: 'LBP' },
  { iso2: 'SY', iso3: 'SYR', name: { zh: '叙利亚', en: 'Syria' }, capital: { zh: '大马士革', en: 'Damascus' }, region: 'middle-east', currency: 'SYP' },
  { iso2: 'KW', iso3: 'KWT', name: { zh: '科威特', en: 'Kuwait' }, capital: { zh: '科威特城', en: 'Kuwait City' }, region: 'middle-east', currency: 'KWD' },
  { iso2: 'BH', iso3: 'BHR', name: { zh: '巴林', en: 'Bahrain' }, capital: { zh: '麦纳麦', en: 'Manama' }, region: 'middle-east', currency: 'BHD' },
  { iso2: 'QA', iso3: 'QAT', name: { zh: '卡塔尔', en: 'Qatar' }, capital: { zh: '多哈', en: 'Doha' }, region: 'middle-east', currency: 'QAR' },
  { iso2: 'OM', iso3: 'OMN', name: { zh: '阿曼', en: 'Oman' }, capital: { zh: '马斯喀特', en: 'Muscat' }, region: 'middle-east', currency: 'OMR' },
  { iso2: 'YE', iso3: 'YEM', name: { zh: '也门', en: 'Yemen' }, capital: { zh: '萨那', en: "Sana'a" }, region: 'middle-east', currency: 'YER' },
  { iso2: 'TR', iso3: 'TUR', name: { zh: '土耳其', en: 'Türkiye' }, capital: { zh: '安卡拉', en: 'Ankara' }, region: 'middle-east', currency: 'TRY' },
  { iso2: 'CY', iso3: 'CYP', name: { zh: '塞浦路斯', en: 'Cyprus' }, capital: { zh: '尼科西亚', en: 'Nicosia' }, region: 'middle-east', currency: 'EUR' },
];

export const getCountry = (iso2: string): Country | undefined =>
  COUNTRIES.find((c) => c.iso2.toLowerCase() === iso2.toLowerCase());

export const countriesByRegion = (region: RegionId): Country[] =>
  COUNTRIES.filter((c) => c.region === region);