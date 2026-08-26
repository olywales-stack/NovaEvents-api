import rateLimit from "express-rate-limit";

/**
 * Global rate limit applied to all routes.
 * 100 requests per IP per 15-minute window.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: "draft-8", // Adds RateLimit-* headers (RFC 9110 draft-8)
  legacyHeaders: false,
  message: {
    error: "Too many requests, please try again later.",
  },
});

/**
 * Stricter rate limit for GET /api/events.
 * Each request fans out one Soroban RPC simulation per event (N+1),
 * so this endpoint is throttled more aggressively to protect RPC load.
 * 20 requests per IP per 15-minute window.
 */
export const eventsListLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error:
      "Too many requests to the events list endpoint, please try again later.",
  },
});
