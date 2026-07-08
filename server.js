/**
 * @file server.js
 * @description Production BFF (Backend-For-Frontend) proxy server.
 * Serves the static React application and proxies API requests to Sportmonks.
 */

import path from 'path'
import { fileURLToPath } from 'url'

import dotenv from 'dotenv'
import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'

import { apiLimiter, generalLimiter } from './api/rateLimiter.js'

/**
 * Load environment variables.
 * Supports .env.local for local production testing.
 */
dotenv.config({ path: '.env.local' })
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000
const API_TOKEN = process.env.SPORTMONKS_API_TOKEN || ''

/**
 * Trust proxy configuration.
 * Required when running behind a reverse proxy (Nginx, Vercel, Heroku, etc.)
 * so that rate limiting keys off the real client IP via X-Forwarded-For.
 * TRUST_PROXY accepts: a number (hops), 'loopback', 'linklocal', 'uniquelocal',
 * comma-separated IPs, or 'true' to trust all. Defaults to 'loopback'.
 */
if (process.env.TRUST_PROXY) {
	const raw = process.env.TRUST_PROXY.trim()
	const numeric = Number(raw)
	app.set('trust proxy', Number.isInteger(numeric) ? numeric : raw)
} else {
	app.set('trust proxy', 'loopback')
}

if (!API_TOKEN) {
	console.error('FATAL ERROR: SPORTMONKS_API_TOKEN is not set in the environment. Exiting.')
	process.exit(1)
}

/**
 * BFF Proxy Route.
 * Forward all `/api` requests to Sportmonks API and inject token server-side.
 * Rate-limited to protect upstream Sportmonks quota.
 */
app.use('/api', apiLimiter)
app.use(
	'/api',
	createProxyMiddleware({
		target: 'https://cricket.sportmonks.com/api/v2.0',
		changeOrigin: true,
		pathRewrite: {
			'^/api': '',
		},
		onProxyReq: (proxyReq) => {
			if (API_TOKEN) {
				const currentPath = proxyReq.path
				const separator = currentPath.includes('?') ? '&' : '?'
				proxyReq.path = `${currentPath}${separator}api_token=${API_TOKEN}`
			}
		},
	}),
)

/**
 * Static SPA Serving configuration.
 */
const distPath = path.join(__dirname, 'dist')
app.use(express.static(distPath))

/**
 * Catch-all route to serve index.html for React Router.
 * This ensures that SPA routing works correctly on page refreshes.
 * Rate-limited to prevent excessive page reloads or scraping.
 */
app.get('*', generalLimiter, (req, res) => {
	res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => {
	console.log(`BFF Proxy server running on http://localhost:${PORT}`)
})
