import { config } from '../config'

/**
 * Core HTTP Client to handle API interactions
 * Follows Single Responsibility Principle
 */
class HttpClient {
	constructor(baseURL, apiToken) {
		this.baseURL = baseURL
		this.apiToken = apiToken
	}

	/**
	 * Makes an HTTP GET request
	 * @param {string} endpoint - API endpoint
	 * @param {object} params - Query parameters
	 * @param {object} options - Request options
	 * @param {AbortSignal} [options.signal] - Abort signal for cancellation
	 * @returns {Promise<object>} JSON response
	 */
	async get(endpoint, params = {}, options = {}) {
		const { signal } = options
		const base = this.baseURL.startsWith('/') ? window.location.origin + this.baseURL : this.baseURL
		const url = new URL(`${base}/${endpoint}`)

		// Add authentication token and params
		url.searchParams.append('api_token', this.apiToken)
		Object.entries(params).forEach(([key, value]) => {
			if (value || value === 0 || value === false) {
				url.searchParams.append(key, value)
			}
		})

		// Use the URL but decode commas if present (Sportmonks v2 preference)
		const finalUrl = url.toString().replace(/%2C/g, ',')

		try {
			if (signal?.aborted) return null

			const response = await fetch(finalUrl, { signal })

			if (!response.ok) {
				const text = await response.text()
				let errorMsg = `HTTP error! status: ${response.status} at ${endpoint}`
				try {
					const errorData = JSON.parse(text)
					const rawMsg = errorData.message || errorData.error || errorMsg
					errorMsg = typeof rawMsg === 'object' ? JSON.stringify(rawMsg) : rawMsg
				} catch {
					errorMsg = text || errorMsg
				}
				throw new Error(errorMsg)
			}

			return await response.json()
		} catch (error) {
			if (error.name === 'AbortError') throw error // Rethrow to let useQuery handle it quietly

			console.error(`HttpClient GET Error [${endpoint}]:`, error.message, '| URL:', finalUrl)
			throw error
		}
	}
}

// Create a singleton instance for SportMonks API
export const sportmonksClient = new HttpClient(config.api.baseUrl, config.api.token)
