import { useMemo } from 'react'

/**
 * Sorts an array of player objects based on a sort key.
 * @param {Array} data - Array of player objects.
 * @param {string} sortKey - The key to sort by.
 * @returns {Array} Sorted player array.
 */
const sortPlayers = (data, sortKey) =>
	[...data].sort((a, b) => {
		switch (sortKey) {
			case 'firstNameAsc':
				return (a.fullname || '').localeCompare(b.fullname || '')
			case 'firstNameDesc':
				return (b.fullname || '').localeCompare(a.fullname || '')
			case 'idAsc':
				return a.id - b.id
			case 'idDesc':
				return b.id - a.id
			case 'updatedAtDesc':
				return new Date(b.updated_at || 0) - new Date(a.updated_at || 0)
			case 'updatedAtAsc':
				return new Date(a.updated_at || 0) - new Date(b.updated_at || 0)
			default:
				return 0
		}
	})

/**
 * Custom hook to filter and sort player data.
 * @param {Array} allPlayers - All player data.
 * @param {object} filters - Filter criteria (search, sort, etc.).
 * @returns {Array} Filtered and sorted player array.
 */
export const usePlayerFilters = (allPlayers, filters) => {
	const { search, sort, position, country, careerType } = filters

	const filteredSorted = useMemo(() => {
		let result = [...allPlayers]

		// Filter by Search (Last Name)
		if (search && search.trim()) {
			const q = search.trim().toLowerCase()
			result = result.filter((p) => (p.lastname || '').toLowerCase().includes(q))
		}

		// Filter by Position
		if (position && position !== 'All') {
			result = result.filter(
				(p) => (p.position?.name || '').toLowerCase() === position.toLowerCase(),
			)
		}

		// Filter by Country
		if (country && country !== 'All') {
			result = result.filter((p) => (p.country?.name || '') === country)
		}

		// Filter by Career Type
		if (careerType && careerType !== 'All') {
			result = result.filter((p) => (p.careerTypes || []).includes(careerType))
		}

		// Sort
		return sortPlayers(result, sort)
	}, [allPlayers, search, sort, position, country, careerType])

	return filteredSorted
}
