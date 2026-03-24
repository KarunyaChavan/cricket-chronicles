/**
 * Application configuration
 * Centralizes all environment variables
 */
export const config = {
	api: {
		baseUrl: import.meta.env.VITE_SPORTMONKS_BASE_URL,
	},
	app: {
		defaultLanguage: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
	},
}
