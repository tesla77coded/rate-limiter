import type { Store } from "./types.js";

export class MemoryStore implements Store {
  private buckets = new Map<string, number[]>();

  async evalSlidingWindow(key: string, now: number, windowMs: number, limit: number) {
    const arr = this.buckets.get(key) ?? [];
    const cutoff = now - windowMs;
    const pruned = arr.filter(ts => ts > cutoff);
    pruned.push(now);

    this.buckets.set(key, pruned);

    const oldestTs = pruned[0] ?? now;
    return { count: pruned.length, oldestTs };
  }
}
