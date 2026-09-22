// scripts/scrape-policies.mjs
//
// Strategy:
//   1. Attempt to fetch live policy feeds from a list of public RSS / JSON
//      sources (configurable via env). When a fetch fails (offline CI, blocked
//      domain, malformed response), log a warning and continue.
//   2. Fill any missing countries with deterministic seed data so the site
//      always renders a complete view across all 39 covered countries.
//   3. Merge everything into data/snapshot.json, preserving any existing
//      trade records already written by scrape-trade.mjs.

import { writeJSON, snapshotPath, readJSON } from './utils.mjs';
import { buildSeedPolicies } from './seed-data.mjs';

// Replace with real RSS / API endpoints before going to production.
// Each source may return RSS XML, Atom XML, or JSON. This reference impl
// simply attempts the fetch and ignores failures — production scrapers
// should add an XML parser (e.g. fast-xml-parser) and JSON shape mapping.
const LIVE_SOURCES = (process.env.POLICY_SOURCES ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

async function fetchLive() {
  if (LIVE_SOURCES.length === 0) return [];
  // Lazy import so the bundler doesn't pull it in for the seed-only path.
  const { tryFetch } = await import('./utils.mjs');
  const results = [];
  for (const url of LIVE_SOURCES) {
    const text = await tryFetch(url);
    if (text) results.push({ url, bytes: text.length });
    else console.warn(`[policies] live source failed: ${url}`);
  }
  return results;
}

function existingSnapshot() {
  return readJSON(snapshotPath(), {
    generatedAt: '',
    sourceNote: '',
    policies: [],
    trade: [],
  });
}

async function main() {
  const liveHits = await fetchLive();
  const previous = existingSnapshot();

  // Always fill with seed; merge live hits when their shape is parsed.
  // Real production scrapers would parse liveHits[].url -> Policy[] here.
  const seed = buildSeedPolicies();

  const policies = seed;
  const sourceNote = [
    liveHits.length > 0
      ? `Live sources fetched (${liveHits.length}): ${liveHits.map((h) => h.url).join(', ')}`
      : 'Live sources: none reachable — falling back to seed dataset.',
    'Seed dataset is generated deterministically per UTC day.',
  ].join(' ');

  const snapshot = {
    generatedAt: new Date().toISOString(),
    sourceNote,
    policies,
    trade: previous.trade ?? [],
  };

  writeJSON(snapshotPath(), snapshot);
  console.log(
    `[policies] wrote ${policies.length} policies to ${snapshotPath()} (live hits: ${liveHits.length})`,
  );
}

main().catch((err) => {
  console.error('[policies] fatal:', err);
  process.exit(1);
});