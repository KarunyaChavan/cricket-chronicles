import { useQuery } from '@tanstack/react-query'
import { useState, useEffect, useMemo, useCallback, Fragment } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { playerService } from '../../api/sportmonks'
import Header from '../../components/Header/Header'
import Pagination from '../../components/Pagination'
import PlayerCard from '../../components/PlayerCard'
import './PlayersListingPage.css'

/** Number of players displayed per page */
const PER_PAGE = 12

/** Position filter options matching the API's position.name values */
const POSITION_FILTERS = ['All', 'Batsman', 'Bowler', 'Allrounder']

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
			case 'updatedAtDesc':
				return new Date(b.updated_at || 0) - new Date(a.updated_at || 0)
			case 'updatedAtAsc':
				return new Date(a.updated_at || 0) - new Date(b.updated_at || 0)
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
 * Filters players by position name.
 * @param {Array} data - All players
 * @param {string} position - Position name or 'All'
 * @returns {Array} Filtered players
 */
const filterByPosition = (data, position) => {
	if (!position || position === 'All') return data
	return data.filter((p) => (p.position?.name || '').toLowerCase() === position.toLowerCase())
}

/**
 * Filters players by country name.
 * @param {Array} data - All players
 * @param {string} country - Country name or 'All'
 * @returns {Array} Filtered players
 */
const filterByCountry = (data, country) => {
	if (!country || country === 'All') return data
	return data.filter((p) => (p.country?.name || '') === country)
}

/**
 * Filters players by career tournament type.
 * @param {Array} data - All players
 * @param {string} type - Tournament type or 'All'
 * @returns {Array} Filtered players
 */
const filterByCareerType = (data, type) => {
	if (!type || type === 'All') return data
	return data.filter((p) => (p.careerTypes || []).includes(type))
}

/**
 * Players listing page — fetches all players once, then filters/sorts/paginates client-side.
 * @returns {JSX.Element} The rendered listings page
 */
const PlayersListingPage = () => {
	const [searchParams, setSearchParams] = useSearchParams()

	const urlSearch = searchParams.get('search') || ''
	const urlSort = searchParams.get('sort') || 'idAsc'
	const urlPage = parseInt(searchParams.get('page'), 10) || 1
	const urlPerPage = parseInt(searchParams.get('post_per_page'), 10) || PER_PAGE
	const urlPosition = searchParams.get('position') || 'All'
	const urlCountry = searchParams.get('country') || 'All'
	const urlCareerType = searchParams.get('career_type') || 'All'

	const [inputValue, setInputValue] = useState(urlSearch)

	const navigate = useNavigate()

	const {
		data: allPlayers = [],
		isLoading,
		isError,
		error: queryError,
	} = useQuery({
		queryKey: ['players'],
		queryFn: async ({ signal }) => {
			const response = await playerService.getPlayers({ include: 'country,career', signal })
			const rawData = response.data || []

			// Transform data directly in queryFn as requested
			return rawData.map((p) => {
				const stripped = {
					id: p.id,
					fullname: p.fullname,
					lastname: p.lastname,
					image_path: p.image_path,
					dateofbirth: p.dateofbirth || null,
					updated_at: p.updated_at || null,
					careerTypes: p.career ? [...new Set(p.career.map((c) => c.type))] : [],
				}
				if (p.country?.name) {
					stripped.country = { name: p.country.name }
				}
				if (p.position?.name) {
					stripped.position = { name: p.position.name }
				}
				return stripped
			})
		},
		staleTime: 1000 * 60 * 60, // 1 hour
	})

	const error = isError
		? queryError?.message || 'Failed to load players. Please try again later.'
		: ''

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

	/** Derived: filter by country → filter by position → filter by last name → sort */
	const filteredSorted = useMemo(
		() =>
			sortPlayers(
				filterByLastName(
					filterByPosition(
						filterByCountry(filterByCareerType(allPlayers, urlCareerType), urlCountry),
						urlPosition,
					),
					urlSearch,
				),
				urlSort,
			),
		[allPlayers, urlSearch, urlSort, urlPosition, urlCountry, urlCareerType],
	)

	const uniqueCountries = useMemo(() => {
		const countries = new Set()
		allPlayers.forEach((p) => {
			if (p.country?.name) countries.add(p.country.name)
		})
		return ['All', ...Array.from(countries).sort()]
	}, [allPlayers])

	const uniqueCareerTypes = useMemo(() => {
		const types = new Set()
		allPlayers.forEach((p) => {
			if (p.careerTypes) p.careerTypes.forEach((t) => {
				if (t && t.trim()) types.add(t)
			})
		})
		return ['All', ...Array.from(types).sort()]
	}, [allPlayers])

	const totalPages = useMemo(
		() => Math.max(1, Math.ceil(filteredSorted.length / urlPerPage)),
		[filteredSorted.length, urlPerPage],
	)

	const players = useMemo(() => {
		const start = (urlPage - 1) * urlPerPage
		if (start >= filteredSorted.length && filteredSorted.length > 0) {
			return filteredSorted.slice(0, urlPerPage)
		}
		return filteredSorted.slice(start, start + urlPerPage)
	}, [filteredSorted, urlPage, urlPerPage])

	const handlePositionFilter = useCallback(
		(position) => {
			setSearchParams((prev) => {
				if (position === 'All') prev.delete('position')
				else prev.set('position', position)
				prev.set('page', '1')
				return prev
			})
		},
		[setSearchParams],
	)

	const handleSortChange = useCallback(
		(e) => {
			setSearchParams((prev) => {
				prev.set('sort', e.target.value)
				prev.set('page', '1')
				return prev
			})
		},
		[setSearchParams],
	)

	const handleCountryChange = useCallback(
		(e) => {
			setSearchParams((prev) => {
				if (e.target.value === 'All') prev.delete('country')
				else prev.set('country', e.target.value)
				prev.set('page', '1')
				return prev
			})
		},
		[setSearchParams],
	)

	const handleCareerTypeChange = useCallback(
		(e) => {
			setSearchParams((prev) => {
				if (e.target.value === 'All') prev.delete('career_type')
				else prev.set('career_type', e.target.value)
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
			<Header />

			<main className="listing-main">
				{/* Editorial Header + Search */}
				<section className="listing-header">
					<div className="listing-header__row">
						<div>
							<span className="listing-header__label">The Archives</span>
							<p className="listing-header__title">
								PLAYER <span className="listing-header__title-muted">CHRONICLES</span>
							</p>
						</div>
						<div className="listing-search">
							<input
								id="player-search"
								type="text"
								className="listing-search__input"
								placeholder="Search by last name..."
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								aria-label="Search players by last name"
							/>
						</div>
					</div>
				</section>

				{/* Position Filter Chips & Selectors */}
				<section className="listing-filters" aria-label="Filters and Sorting">
					<div className="listing-filters__row">
						{POSITION_FILTERS.map((pos, idx) => (
							<Fragment key={pos}>
								{idx === 1 && <div key="divider" className="listing-filters__divider" />}
								<button
									key={pos}
									type="button"
									className={`listing-filter-chip ${
										urlPosition === pos || (pos === 'All' && urlPosition === 'All')
											? 'listing-filter-chip--active'
											: 'listing-filter-chip--inactive'
									}`}
									onClick={() => handlePositionFilter(pos)}
									aria-pressed={urlPosition === pos || (pos === 'All' && urlPosition === 'All')}
								>
									{pos === 'All' ? 'SHOW ALL' : pos === 'Allrounder' ? 'All-rounder' : pos}
								</button>
							</Fragment>
						))}
					</div>

					<div className="listing-dropdowns">
						<select
							value={urlSort}
							onChange={handleSortChange}
							className="listing-dropdowns__select"
							aria-label="Sort players"
						>
							<option value="idAsc">Sort by ID (Low to High)</option>
							<option value="idDesc">Sort by ID (High to Low)</option>
							<option value="firstNameAsc">Sort by Name (A-Z)</option>
							<option value="firstNameDesc">Sort by Name (Z-A)</option>
							<option value="updatedAtDesc">Recently Updated (Newest)</option>
							<option value="updatedAtAsc">Recently Updated (Oldest)</option>
						</select>
						<select
							value={urlCountry}
							onChange={handleCountryChange}
							className="listing-dropdowns__select"
							aria-label="Filter by country"
						>
							{uniqueCountries.map((c) => (
								<option key={c} value={c}>
									{c === 'All' ? 'All Countries' : c}
								</option>
							))}
						</select>
						<select
							value={urlCareerType}
							onChange={handleCareerTypeChange}
							className="listing-dropdowns__select"
							aria-label="Filter by tournament type"
						>
							{uniqueCareerTypes.map((t) => (
								<option key={t} value={t}>
									{t === 'All' ? 'All Formats' : t}
								</option>
							))}
						</select>
					</div>
				</section>

				{/* Error */}
				{error && <div className="error-message">{error}</div>}

				{/* Content */}
				{isLoading ? (
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
			</main>
		</div>
	)
}

export default PlayersListingPage
