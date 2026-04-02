/**
 * Best-effort in-memory limits for a single Node process.
 * On serverless (Vercel) instances don't share memory — use Redis/KV/Firestore for strict enforcement.
 */

const ipHits: Map<string, number[]> = new Map();
const mobileLast: Map<string, number> = new Map();

export function isIpRateLimited(ip: string, maxPerWindow: number, windowMs: number): boolean {
  const now = Date.now();
  const arr = (ipHits.get(ip) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  ipHits.set(ip, arr);
  return arr.length > maxPerWindow;
}

/** Returns true if duplicate within window (and records this hit). */
export function isDuplicateMobile(mobile: string, windowMs: number): boolean {
  const now = Date.now();
  const last = mobileLast.get(mobile);
  if (last !== undefined && now - last < windowMs) {
    return true;
  }
  mobileLast.set(mobile, now);
  return false;
}
