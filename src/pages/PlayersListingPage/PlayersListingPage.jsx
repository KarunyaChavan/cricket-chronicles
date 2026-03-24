import { useQuery } from '@tanstack/react-query'
import { useState, useEffect, useMemo, useCallback, Fragment } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { usePlayerFilters } from './hooks/usePlayerFilters'
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
 * Players listing page — fetches all players once, then filters/sorts/paginates client-side.
 * @returns {JSX.Element} The rendered listings page.
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

			return rawData.map((p) => ({
				id: p.id,
				fullname: p.fullname,
				lastname: p.lastname,
				image_path: p.image_path,
				dateofbirth: p.dateofbirth || null,
				updated_at: p.updated_at || null,
				careerTypes: p.career ? [...new Set(p.career.map((c) => c.type))] : [],
				country: p.country?.name ? { name: p.country.name } : null,
				position: p.position?.name ? { name: p.position.name } : null,
			}))
		},
		staleTime: 1000 * 60 * 60, // 1 hour
	})

	const error = isError ? queryError?.message || 'Failed to load players.' : ''

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

	useEffect(() => {
		setInputValue(urlSearch)
	}, [urlSearch])

	/** Derived filtering and sorting via custom hook */
	const filteredSorted = usePlayerFilters(allPlayers, {
		search: urlSearch,
		sort: urlSort,
		position: urlPosition,
		country: urlCountry,
		careerType: urlCareerType,
	})

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
			if (p.careerTypes) p.careerTypes.forEach((t) => t && types.add(t))
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

	const handleFilterChange = useCallback(
		(name, value) => {
			setSearchParams((prev) => {
				if (value === 'All') prev.delete(name)
				else prev.set(name, value)
				if (name !== 'page') prev.set('page', '1')
				return prev
			})
		},
		[setSearchParams],
	)

	return (
		<div className="players-listing">
			<Header />
			<main className="listing-main">
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
								aria-label="Search players"
							/>
						</div>
					</div>
				</section>

				<section className="listing-filters">
					<div className="listing-filters__row">
						{POSITION_FILTERS.map((pos, idx) => (
							<Fragment key={pos}>
								{idx === 1 && <div className="listing-filters__divider" />}
								<button
									type="button"
									className={`listing-filter-chip ${
										urlPosition === pos
											? 'listing-filter-chip--active'
											: 'listing-filter-chip--inactive'
									}`}
									onClick={() => handleFilterChange('position', pos)}
								>
									{pos === 'All' ? 'SHOW ALL' : pos === 'Allrounder' ? 'All-rounder' : pos}
								</button>
							</Fragment>
						))}
					</div>

					<div className="listing-dropdowns">
						<select
							value={urlSort}
							onChange={(e) => handleFilterChange('sort', e.target.value)}
							className="listing-dropdowns__select"
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
							onChange={(e) => handleFilterChange('country', e.target.value)}
							className="listing-dropdowns__select"
						>
							{uniqueCountries.map((c) => (
								<option key={c} value={c}>
									{c === 'All' ? 'All Countries' : c}
								</option>
							))}
						</select>
						<select
							value={urlCareerType}
							onChange={(e) => handleFilterChange('career_type', e.target.value)}
							className="listing-dropdowns__select"
						>
							{uniqueCareerTypes.map((t) => (
								<option key={t} value={t}>
									{t === 'All' ? 'All Formats' : t}
								</option>
							))}
						</select>
					</div>
				</section>

				{error && <div className="error-message">{error}</div>}

				{isLoading ? (
					<div className="loading-spinner" />
				) : (
					<>
						{players.length === 0 && !error ? (
							<div className="no-results">No players found matching your criteria.</div>
						) : (
							<div className="player-grid">
								{players.map((p) => (
									<PlayerCard key={p.id} player={p} onClick={(id) => navigate(`/player/${id}`)} />
								))}
							</div>
						)}
						{totalPages > 1 && (
							<Pagination
								currentPage={urlPage}
								totalPages={totalPages}
								onPageChange={(page) => handleFilterChange('page', page.toString())}
							/>
						)}
					</>
				)}
			</main>
		</div>
	)
}

export default PlayersListingPage
