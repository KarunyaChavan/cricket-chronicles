/**
 * @file api/proxy.js
 * @description Dedicated Vercel Serverless Function Proxy.
 * Securely injects the API token and proxies requests to Sportmonks.
 */

/**
 * Vercel Serverless Function handler for proxying Sportmonks API requests.
 * @param {object} req - HTTP request object.
 * @param {object} res - HTTP response object.
 * @returns {Promise<void>}
 */
export default async function handler(req, res) {
	const fullUrl = req.url || ''
	const apiPath = fullUrl.startsWith('/api') ? fullUrl.replace(/^\/api/, '') : fullUrl

	const targetUrl = new URL(`https://cricket.sportmonks.com/api/v2.0${apiPath}`)

	const token = process.env.SPORTMONKS_API_TOKEN || process.env.VITE_SPORTMONKS_API_TOKEN
	if (token) {
		targetUrl.searchParams.set('api_token', token)
	}

	try {
		const response = await fetch(targetUrl.toString(), {
			method: req.method,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		})

		const data = await response.json()
		return res.status(response.status).json(data)
	} catch (error) {
		console.error('Vercel Proxy Error:', error)
		return res.status(500).json({
			error: 'Internal Server Error',
			message: error.message,
		})
	}
}
