import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { playerService } from '../../api/sportmonks'
import Filters from '../../components/Filters'
import Pagination from '../../components/Pagination'
import PlayerCard from '../../components/PlayerCard'
import { useGlobalContext } from '../../context/useGlobalContext'
import './PlayersListingPage.css'

/** Number of players displayed per page */
const PER_PAGE = 15

/**
 * Sorts an array of player objects based on a sort key.
 * @param {Array} data - Array of player objects
 * @param {string} sortKey - Sort key
 * @returns {Array} Sorted player array
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
			default:
				return 0
		}
	})

/**
 * Filters players by last name (case-insensitive).
 * @param {Array} data - All players
 * @param {string} query - Last name query string
 * @returns {Array} Filtered players
 */
const filterByLastName = (data, query) => {
	if (!query || query.trim().length === 0) return data
	const q = query.trim().toLowerCase()
	return data.filter((p) => (p.lastname || '').toLowerCase().includes(q))
}

/**
 * Players listing page — fetches all players once, then filters/sorts/paginates client-side.
 * This is optimal for the SportMonks free API which ignores per_page and returns all data.
 * @returns {JSX.Element} The rendered listings page
 */
const PlayersListingPage = () => {
	const { playersCache, setPlayersCache } = useGlobalContext()
	const [searchParams, setSearchParams] = useSearchParams()

	const urlSearch = searchParams.get('search') || ''
	const urlSort = searchParams.get('sort') || 'firstNameAsc'
	const urlPage = parseInt(searchParams.get('page'), 10) || 1
	const urlPerPage = parseInt(searchParams.get('post_per_page'), 10) || PER_PAGE

	/** All players fetched from the API — immutable after initial load */
	const [allPlayers, setAllPlayers] = useState(playersCache || [])
	const [loading, setLoading] = useState(playersCache && playersCache.length ? false : true)
	const [error, setError] = useState('')

	/** Controlled search input for immediate typing, debounced into URL */
	const [inputValue, setInputValue] = useState(urlSearch)

	const navigate = useNavigate()

	/** Debounce search query into URL */
	useEffect(() => {
		if (inputValue === urlSearch) return

		const handler = setTimeout(() => {
			setSearchParams(
				(prev) => {
					if (inputValue) prev.set('search', inputValue)
					else prev.delete('search')
					prev.set('page', '1')
					return prev
				},
				{ replace: true },
			)
		}, 400)

		return () => clearTimeout(handler)
	}, [inputValue, setSearchParams, urlSearch])

	/** Sync input value if URL changes via back navigation */
	useEffect(() => {
		setInputValue(urlSearch)
	}, [urlSearch])

	/** Fetch all players exactly once on mount */
	useEffect(() => {
		let cancelled = false
		const controller = new AbortController()

		const fetchAll = async () => {
			if (playersCache && playersCache.length > 0) {
				setLoading(false)
				return
			}

			setLoading(true)
			setError('')
			try {
				const response = await playerService.getPlayers({ signal: controller.signal })
				if (!cancelled) {
					const data = response.data || []

					// Strip large objects to prevent LocalStorage QuotaExceededError (5MB limit)
					const strippedData = data.map((p) => {
						const strippedPlayer = {
							id: p.id,
							fullname: p.fullname,
							lastname: p.lastname,
							image_path: p.image_path,
						}

						if (p.country?.name) {
							strippedPlayer.country = { name: p.country.name }
						}

						if (p.position?.name) {
							strippedPlayer.position = { name: p.position.name }
						}

						return strippedPlayer
					})

					setAllPlayers(strippedData)
					setPlayersCache(strippedData)
				}
			} catch (err) {
				if (err.name === 'AbortError') return
				if (!cancelled) {
					setError(err.message || 'Failed to load players. Please try again later.')
					console.error(err)
				}
			} finally {
				if (!cancelled) setLoading(false)
			}
		}

		fetchAll()
		return () => {
			cancelled = true
			controller.abort()
		}
	}, [playersCache, setPlayersCache]) // Run on mount or if cache setup changes

	/** Derived: filter + sort — zero network calls, runs in memory */
	const filteredSorted = useMemo(
		() => sortPlayers(filterByLastName(allPlayers, urlSearch), urlSort),
		[allPlayers, urlSearch, urlSort],
	)

	/** Derived: total pages based on filtered+sorted count */
	const totalPages = useMemo(
		() => Math.max(1, Math.ceil(filteredSorted.length / urlPerPage)),
		[filteredSorted.length, urlPerPage],
	)

	/** Derived: current page slice */
	const players = useMemo(() => {
		const start = (urlPage - 1) * urlPerPage
		// For robustness, ensure we don't return an empty page if URL page is out of bounds
		if (start >= filteredSorted.length && filteredSorted.length > 0) {
			return filteredSorted.slice(0, urlPerPage)
		}
		return filteredSorted.slice(start, start + urlPerPage)
	}, [filteredSorted, urlPage, urlPerPage])

	const handleSearchChange = useCallback((query) => {
		setInputValue(query)
	}, [])

	const handleSearchSubmit = useCallback(
		(query) => {
			setSearchParams((prev) => {
				if (query) prev.set('search', query)
				else prev.delete('search')
				prev.set('page', '1')
				return prev
			})
		},
		[setSearchParams],
	)

	const handleSortChange = useCallback(
		(sort) => {
			setSearchParams((prev) => {
				prev.set('sort', sort)
				prev.set('page', '1')
				return prev
			})
		},
		[setSearchParams],
	)

	const handlePageChange = useCallback(
		(page) => {
			setSearchParams((prev) => {
				prev.set('page', page.toString())
				return prev
			})
		},
		[setSearchParams],
	)

	const handlePlayerClick = useCallback(
		(id) => {
			navigate(`/player/${id}`)
		},
		[navigate],
	)

	return (
		<div className="players-listing">
			<Filters
				searchQuery={inputValue}
				onSearchChange={handleSearchChange}
				onSearchSubmit={handleSearchSubmit}
				sortBy={urlSort}
				onSortChange={handleSortChange}
			/>

			{error && <div className="error-message">{error}</div>}

			{loading ? (
				<div className="loading-spinner" />
			) : (
				<>
					{players.length === 0 && !error ? (
						<div className="no-results">No players found matching your criteria.</div>
					) : (
						<div className="player-grid">
							{players.map((player) => (
								<PlayerCard key={player.id} player={player} onClick={handlePlayerClick} />
							))}
						</div>
					)}

					{totalPages > 1 && (
						<Pagination
							currentPage={urlPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
					)}
				</>
			)}
		</div>
	)
}

export default PlayersListingPage
