// Simple in-memory rate limiter
// Note: This only works per-instance in a serverless environment.
// For production, use a persistent store like Redis (e.g., Upstash).

const trackers = new Map();

export function rateLimit(ip, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const record = trackers.get(ip) || { count: 0, resetTime: now + windowMs };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
  } else {
    record.count++;
  }

  trackers.set(ip, record);

  return {
    isLimited: record.count > limit,
    remaining: Math.max(0, limit - record.count),
    resetIn: Math.max(0, record.resetTime - now),
  };
}
