
import type { Request } from "express";

export function defaultKeyResolver(req: Request, prefix = "rl:v1"): string {
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const route = req.baseUrl + req.path; 
  return `${prefix}:${ip}:${route}`;
}
