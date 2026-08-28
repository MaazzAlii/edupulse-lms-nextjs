import { NextRequest } from "next/server";

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const ipStore = new Map<string, RateLimitStore>();

// Clean up expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  ipStore.forEach((store, ip) => {
    if (now > store.resetTime) {
      ipStore.delete(ip);
    }
  });
}, 10 * 60 * 1000);

/**
 * In-memory IP Rate Limiter
 * @param req NextRequest
 * @param maxHits Limit of max requests allowed (default 10)
 * @param windowMs Time window in ms (default 15 minutes)
 */
export function checkRateLimit(
  req: NextRequest,
  maxHits: number = 10,
  windowMs: number = 15 * 60 * 1000
): { isAllowed: boolean; remainingHits: number } {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

  const now = Date.now();
  const store = ipStore.get(ip);

  if (!store || now > store.resetTime) {
    ipStore.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { isAllowed: true, remainingHits: maxHits - 1 };
  }

  if (store.count >= maxHits) {
    return { isAllowed: false, remainingHits: 0 };
  }

  store.count += 1;
  ipStore.set(ip, store);
  return { isAllowed: true, remainingHits: maxHits - store.count };
}
