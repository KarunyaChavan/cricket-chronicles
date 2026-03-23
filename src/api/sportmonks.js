import { sportmonksClient } from './HttpClient'

/**
 * Service specifically for Player-related API calls
 * Extends functionality but adheres to SRP and Open/Closed principles
 */
class PlayerService {
	constructor(client) {
		this.client = client
	}

	/**
	 * Get all players with necessary includes for the listing page
	 * (Server-side pagination is not supported here, so we fetch all available)
	 * @param {object} queryOptions - Filter options
	 * @param {string} [queryOptions.include] - Comma separated relations
	 * @param {object} [queryOptions.filters] - Additional filters
	 * @param {AbortSignal} [queryOptions.signal] - Abort signal
	 * @returns {Promise<object>} Players list response
	 */
	async getPlayers({ include = 'country', filters = {}, signal } = {}) {
		return this.client.get(
			'players',
			{
				include,
				...filters,
			},
			{ signal },
		)
	}

	/**
	 * Get details for a specific player
	 * @param {number} id - Player ID to fetch
	 * @param {string} [include] - Related entities to include
	 * @param {object} [options] - Request options
	 * @param {AbortSignal} [options.signal] - Abort signal
	 * @returns {Promise<object>} Player details response
	 */
	async getPlayerById(id, include = 'country,teams,career', options = {}) {
		return this.client.get(`players/${id}`, { include }, options)
	}

	/**
	 * Get players matching a specific search query
	 * @param {string} name - The name to search for
	 * @param {object} options - Search options
	 * @param {number} [options.page] - Page number
	 * @param {number} [options.perPage] - Results per page
	 * @param {string} [options.include] - Included relations
	 * @param {AbortSignal} [options.signal] - Abort signal
	 * @returns {Promise<object>} Search results response
	 */
	async searchPlayersByName(name, { page = 1, perPage = 15, include = 'country', signal } = {}) {
		return this.client.get(
			`players/search/${encodeURIComponent(name)}`,
			{
				page,
				per_page: perPage,
				include,
			},
			{ signal },
		)
	}
}

// Export a singleton instance of the service injected with the API client
export const playerService = new PlayerService(sportmonksClient)
