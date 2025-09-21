import type { Response } from "express";

export function setRateLimitHeaders(
  res: Response,
  limit: number,
  remaining: number,
  resetMs: number
) {
  // RFC-ish names commonly used
  res.setHeader("RateLimit-Limit", String(limit));
  res.setHeader("RateLimit-Remaining", String(remaining));
  res.setHeader("RateLimit-Reset", String(Math.ceil(resetMs / 1000))); // seconds
}

export function setRetryAfter(res: Response, resetMs: number) {
  res.setHeader("Retry-After", String(Math.ceil(resetMs / 1000)));
}
