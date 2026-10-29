

export const SITE_NAME = "Mahi Computer Training Center";
export const SITE_SHORT_NAME = "Mahi Computer";

/**
 * Business timezone. Pinned rather than inherited from the host so dates that
 * are stored (audit serial numbers) and dates that are rendered agree on every
 * deployment, whatever TZ the server container runs in.
 */
export const SITE_TIME_ZONE = "Asia/Dhaka";

/** Production origin. Set NEXT_PUBLIC_SITE_URL in the environment. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mahicomputer.vercel.app"
).replace(/\/+$/, "");

/** Resolve a route to an absolute URL against the canonical site origin. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, `${SITE_URL}/`).toString();
}

/** Absolute URL for a public asset (e.g. "/images/hero.jpg"). */
export function assetUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return absoluteUrl(path.startsWith("/") ? path : `/${path}`);
}

/** Trimmed copy for meta descriptions (target: <= 160 chars). */
export function truncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}
