/**
 * @file api/rateLimiter.js
 * @description Configurable rate limiters for the BFF server.
 * Provides two tiers: strict for the API proxy, moderate for general routes.
 * All limits are configurable via environment variables.
 */

import rateLimit from 'express-rate-limit'

const isEnabled = () => process.env.RATE_LIMIT_ENABLED !== 'false'

const ONE_MINUTE = 60 * 1000
const FIFTEEN_MINUTES = 15 * ONE_MINUTE

const parseMs = (value, fallback) => {
	const n = Number(value)
	return Number.isFinite(n) && n > 0 ? n : fallback
}

const parseMax = (value, fallback) => {
	const n = Number(value)
	return Number.isInteger(n) && n >= 0 ? n : fallback
}

const createHandler = (limiterName) => (_req, res) => {
	console.warn(`[rate-limiter] ${limiterName} limit exceeded`)
	res.status(429).json({
		error: 'Too Many Requests',
		message: `You have exceeded the ${limiterName} rate limit. Please try again later.`,
	})
}

/**
 * Strict rate limiter for the Sportmonks API proxy.
 * Protects upstream API quota from abuse or runaway clients.
 */
export const apiLimiter = rateLimit({
	windowMs: parseMs(process.env.RATE_LIMIT_API_WINDOW_MS, FIFTEEN_MINUTES),
	max: parseMax(process.env.RATE_LIMIT_API_MAX, 100),
	skip: () => !isEnabled(),
	handler: createHandler('API'),
	standardHeaders: true,
	legacyHeaders: false,
})

/**
 * Moderate rate limiter for general SPA routes (catch-all).
 * Prevents excessive page reloads / scraping of the application shell.
 */
export const generalLimiter = rateLimit({
	windowMs: parseMs(process.env.RATE_LIMIT_GENERAL_WINDOW_MS, FIFTEEN_MINUTES),
	max: parseMax(process.env.RATE_LIMIT_GENERAL_MAX, 1000),
	skip: () => !isEnabled(),
	handler: createHandler('General'),
	standardHeaders: true,
	legacyHeaders: false,
})
