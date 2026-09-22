// scripts/utils.mjs — Shared helpers for scrapers.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const ROOT = path.resolve(__dirname, '..');
export const DATA_DIR = path.join(ROOT, 'data');
export const HISTORY_DIR = path.join(DATA_DIR, 'history');

export const TODAY = (() => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
})();

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function readJSON(file, fallback = null) {
  if (!fs.existsSync(file)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.warn(`[utils] bad JSON at ${file}:`, err.message);
    return fallback;
  }
}

export function writeJSON(file, value) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

export function snapshotPath() {
  return path.join(DATA_DIR, 'snapshot.json');
}

export function historyPath(prefix) {
  ensureDir(HISTORY_DIR);
  return path.join(HISTORY_DIR, `${prefix}-${TODAY}.json`);
}

/**
 * Best-effort HTTP fetch with timeout. Returns null on any failure.
 * Designed to never throw — scrapers fall back to seed data instead.
 */
export async function tryFetch(url, { timeoutMs = 8000 } = {}) {
  if (typeof fetch !== 'function') return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        'user-agent': 'asia-environment-monitor/0.1 (+github-actions)',
        accept: 'application/json, text/xml, */*',
      },
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text;
  } catch (err) {
    console.warn(`[utils] fetch ${url} failed: ${err.message}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function pickRandom(arr, rng = Math.random) {
  return arr[Math.floor(rng() * arr.length)];
}

/** Deterministic pseudo-random in [0, 1) seeded by string. */
export function srandom(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}