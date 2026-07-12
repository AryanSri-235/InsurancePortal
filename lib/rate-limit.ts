// Simple in-memory rate limiter. Works for single-instance deployments.
// For Vercel/serverless production, replace with Upstash Redis rate limiting.
interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();

// Clean up expired entries periodically (every 5 min)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of store) {
      if (now > bucket.resetAt) store.delete(key);
    }
  }, 5 * 60 * 1000);
}

/**
 * Returns true if the request should be blocked.
 * @param key      Unique key per client (e.g. "login:192.168.1.1")
 * @param limit    Max attempts allowed in the window
 * @param windowMs Window size in ms (default: 15 minutes)
 */
export function isRateLimited(key: string, limit: number, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || now > bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  if (bucket.count > limit) return true;

  return false;
}
