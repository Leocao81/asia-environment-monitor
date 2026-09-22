/**
 * Resolve the canonical site URL in a build-safe way.
 *
 * Priority:
 *   1. SITE_URL (if set to a non-empty value)
 *   2. Vercel production domain (auto-injected on Vercel builds)
 *   3. Vercel preview domain   (auto-injected on Vercel builds)
 *   4. localhost fallback      (local development)
 *
 * IMPORTANT: never call `new URL()` directly on a raw env var anywhere else.
 * A var that exists but is EMPTY would crash the build with `Invalid URL`
 * (`??` does not catch empty strings — `||` does).
 */
function normalize(url: string): string {
  return url.replace(/\/+$/, ''); // strip trailing slashes
}

export function getSiteUrl(): string {
  const siteUrl = process.env.SITE_URL?.trim();
  if (siteUrl) return normalize(siteUrl);

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProd) return normalize(`https://${vercelProd}`);

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return normalize(`https://${vercelUrl}`);

  return 'http://localhost:3000';
}