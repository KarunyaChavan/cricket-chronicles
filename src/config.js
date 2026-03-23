/**
 * Application configuration
 * Centralizes all environment variables
 */
export const config = {
	api: {
		token: import.meta.env.VITE_SPORTMONKS_API_TOKEN,
		baseUrl: import.meta.env.VITE_SPORTMONKS_BASE_URL,
	},
	app: {
		defaultLanguage: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
	},
}
