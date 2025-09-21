import type { Request, Response, NextFunction } from "express";
import { decideSlidingWindow } from "./slidingWindow.js";
import { setRateLimitHeaders, setRetryAfter } from "./headers.js";
import { defaultKeyResolver } from "./keyResolver.js";
import type { SlidingWindowConfig, Store } from "./types.js";

export function rateLimiter(store: Store, cfg: SlidingWindowConfig) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const key = defaultKeyResolver(req, cfg.prefix ?? "rl:v1");
    const decision = await decideSlidingWindow(store, key, cfg);

    setRateLimitHeaders(res, cfg.limit, decision.remaining, decision.resetMs);

    if (!decision.allowed) {
      setRetryAfter(res, decision.resetMs);
      return res.status(429).json({ error: "Too Many Requests" });
    }
    return next();
  };
}
