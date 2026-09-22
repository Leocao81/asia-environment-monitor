import type { MetadataRoute } from 'next';
import { COUNTRIES, REGIONS } from '@/lib/countries';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL ?? 'https://example.com';
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    ...REGIONS.map((r) => ({
      url: `${base}/regions/${r.id}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    ...COUNTRIES.map((c) => ({
      url: `${base}/countries/${c.iso2.toLowerCase()}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.6,
    })),
  ];
}