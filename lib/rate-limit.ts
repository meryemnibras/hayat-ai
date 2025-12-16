import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create Redis instance
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Rate limiters for different endpoints
export const rateLimiters = {
  // General API: 100 requests per minute
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 m"),
    analytics: true,
    prefix: "ratelimit:api",
  }),

  // AI Chat: 20 requests per minute (more expensive)
  aiChat: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 m"),
    analytics: true,
    prefix: "ratelimit:ai-chat",
  }),

  // Webhooks: 200 requests per minute
  webhooks: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(200, "1 m"),
    analytics: true,
    prefix: "ratelimit:webhooks",
  }),

  // Auth: 10 requests per minute (prevent brute force)
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
    prefix: "ratelimit:auth",
  }),
};

export type RateLimiterType = keyof typeof rateLimiters;

export async function checkRateLimit(
  identifier: string,
  type: RateLimiterType = "api"
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const limiter = rateLimiters[type];
  const result = await limiter.limit(identifier);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

