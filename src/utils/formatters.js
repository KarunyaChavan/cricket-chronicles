/**
 * Formats a date string into a localized long date (e.g., March 24, 2026).
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date or '—'.
 */
export const formatDate = (dateString) => {
	if (!dateString) return '—'
	const date = new Date(dateString)
	if (isNaN(date.getTime())) return '—'
	return date.toLocaleDateString(undefined, {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})
}

/**
 * Capitalizes the first letter of a gender string.
 * @param {string} gender - Male or Female.
 * @returns {string} Formatted gender or '—'.
 */
export const formatGender = (gender) => {
	if (!gender) return '—'
	return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()
}

/**
 * Formats a numeric value for statistics display.
 * Returns '—' for null/undefined, an integer string for whole numbers,
 * or a 2-decimal string for others.
 * @param {number|string} value - The value to format.
 * @returns {string} The formatted value.
 */
export const formatValue = (value) => {
	if (value === null || value === undefined || value === '—') return '—'
	const num = parseFloat(value)
	if (isNaN(num)) return value
	if (Number.isInteger(num)) return num.toString()
	return num.toFixed(2)
}

/**
 * Returns an optimized image URL for Vercel, or the original path for local development.
 * @param {string} imagePath - Original image path.
 * @param {number} width - Desired width for optimization.
 * @param {number} quality - Desired quality for optimization.
 * @returns {string} The optimized or original image URL.
 */
export const getOptimizedImageUrl = (imagePath, width = 256, quality = 75) => {
	if (!imagePath) return '/placeholder-player.svg'
	const isLocalhost =
		typeof window !== 'undefined' &&
		['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
	if (import.meta.env.PROD && !isLocalhost) {
		return `/_vercel/image?url=${encodeURIComponent(imagePath)}&w=${width}&q=${quality}`
	}
	return imagePath
}
