import fs from 'node:fs';
import path from 'node:path';
import type { Policy, Snapshot, TradeRecord } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Read the latest snapshot.json. If the file does not exist yet
 * (e.g. on first build before scrapers have run), return an empty
 * snapshot so the site still renders without crashing.
 */
export function readSnapshot(): Snapshot {
  const file = path.join(DATA_DIR, 'snapshot.json');
  if (!fs.existsSync(file)) {
    return emptySnapshot();
  }
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const parsed = JSON.parse(raw) as Snapshot;
    // Defensive defaults
    return {
      generatedAt: parsed.generatedAt ?? new Date().toISOString(),
      sourceNote: parsed.sourceNote ?? '',
      policies: Array.isArray(parsed.policies) ? parsed.policies : [],
      trade: Array.isArray(parsed.trade) ? parsed.trade : [],
    };
  } catch (err) {
    console.warn('[data] failed to parse snapshot.json:', err);
    return emptySnapshot();
  }
}

function emptySnapshot(): Snapshot {
  return {
    generatedAt: new Date(0).toISOString(),
    sourceNote: 'No data yet — scraper has not produced a snapshot.',
    policies: [],
    trade: [],
  };
}

export function policiesForRegion(
  snapshot: Snapshot,
  region: string,
): Policy[] {
  return snapshot.policies
    .filter((p) => p.region === region)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function tradeForRegion(
  snapshot: Snapshot,
  region: string,
): TradeRecord[] {
  return snapshot.trade
    .filter((t) => t.region === region)
    .sort((a, b) => (a.period < b.period ? 1 : -1));
}

export function policiesForCountry(
  snapshot: Snapshot,
  iso2: string,
): Policy[] {
  return snapshot.policies
    .filter((p) => p.country.toLowerCase() === iso2.toLowerCase())
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function tradeForCountry(
  snapshot: Snapshot,
  iso2: string,
): TradeRecord[] {
  return snapshot.trade
    .filter((t) => t.country.toLowerCase() === iso2.toLowerCase())
    .sort((a, b) => (a.period < b.period ? 1 : -1));
}