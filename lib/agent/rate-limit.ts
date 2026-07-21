/**
 * Minimal in-memory rate limiter for the public agent endpoint.
 * Single-instance deployment (one Railway container), so a Map is honest
 * and sufficient; a distributed store would be right-sizing theater here.
 */
type Bucket = { count: number; resetAt: number };

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;
const buckets = new Map<string, Bucket>();

export function checkRateLimit(ip: string): { ok: boolean; retryAfterS: number } {
  const now = Date.now();

  // prune occasionally so the map cannot grow unbounded
  if (buckets.size > 5_000) {
    for (const [key, b] of buckets) {
      if (b.resetAt < now) buckets.delete(key);
    }
  }

  const bucket = buckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfterS: 0 };
  }

  bucket.count += 1;
  if (bucket.count > MAX_PER_WINDOW) {
    return { ok: false, retryAfterS: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfterS: 0 };
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
