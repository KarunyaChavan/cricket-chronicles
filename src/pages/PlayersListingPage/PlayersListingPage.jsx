import { useQuery } from '@tanstack/react-query'
import { useState, useEffect, useMemo, useCallback, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { usePlayerFilters } from './hooks/usePlayerFilters'
import { playerService } from '../../api/sportmonks'
import Header from '../../components/Header/Header'
import Loader from '../../components/Loader'
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
	const { t } = useTranslation()
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

	const error = isError ? queryError?.message || t('error.fetch', 'Failed to load players.') : ''

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

	useEffect(() => {
		if (filteredSorted.length > 0 && urlPage > totalPages) {
			setSearchParams(
				(prev) => {
					prev.set('page', totalPages.toString())
					return prev
				},
				{ replace: true },
			)
		}
	}, [filteredSorted.length, urlPage, totalPages, setSearchParams])

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

	const activeFiltersTexts = []
	if (urlPosition !== 'All') {
		activeFiltersTexts.push(
			urlPosition === 'Allrounder'
				? t('players.filters.allrounder', 'All-rounder')
				: t(`players.filters.${urlPosition.toLowerCase()}`, urlPosition),
		)
	}
	if (urlCountry !== 'All') activeFiltersTexts.push(urlCountry)
	if (urlCareerType !== 'All') activeFiltersTexts.push(urlCareerType)

	let headerLabel = t('players.archives', 'The Archives')
	if (urlSearch && activeFiltersTexts.length > 0) {
		headerLabel = t('players.searchAndFilter', 'Search: "{{query}}" • {{filters}}', {
			query: urlSearch,
			filters: activeFiltersTexts.join(' • '),
		})
	} else if (urlSearch) {
		headerLabel = t('players.searchOnly', 'Search: "{{query}}"', { query: urlSearch })
	} else if (activeFiltersTexts.length > 0) {
		headerLabel = t('players.showingFilters', 'Showing: {{filters}}', {
			filters: activeFiltersTexts.join(' • '),
		})
	}

	return (
		<div className="players-listing">
			<Header />
			<main className="listing-main">
				{isLoading ? (
					<Loader />
				) : (
					<>
						<section className="listing-header">
							<div className="listing-header__row">
								<div>
									<span className="listing-header__label">{headerLabel}</span>
									<p className="listing-header__title">
										{t('players.headerTitle', 'PLAYER')}{' '}
										<span className="listing-header__title-muted">
											{t('players.headerSubtitle', 'CHRONICLES')}
										</span>
									</p>
								</div>
								<form
									className="listing-search"
									onSubmit={(e) => {
										e.preventDefault()
										setSearchParams(
											(prev) => {
												if (inputValue) prev.set('search', inputValue)
												else prev.delete('search')
												prev.set('page', '1')
												return prev
											},
											{ replace: true },
										)
									}}
								>
									<input
										id="player-search"
										type="search"
										className="listing-search__input"
										placeholder={t('players.searchHolder', 'Search by last name...')}
										value={inputValue}
										onChange={(e) => setInputValue(e.target.value)}
										aria-label="Search players"
									/>
								</form>
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
											{pos === 'All'
												? t('players.filters.showAll', 'SHOW ALL')
												: pos === 'Allrounder'
													? t('players.filters.allrounder', 'All-rounder')
													: t(`players.filters.${pos.toLowerCase()}`, pos)}
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
									<option value="idAsc">
										{t('players.sort.idAsc', 'Sort by ID (Low to High)')}
									</option>
									<option value="idDesc">
										{t('players.sort.idDesc', 'Sort by ID (High to Low)')}
									</option>
									<option value="firstNameAsc">
										{t('players.sort.firstNameAsc', 'Sort by Name (A-Z)')}
									</option>
									<option value="firstNameDesc">
										{t('players.sort.firstNameDesc', 'Sort by Name (Z-A)')}
									</option>
									<option value="updatedAtDesc">
										{t('players.sort.updatedAtDesc', 'Recently Updated (Newest)')}
									</option>
									<option value="updatedAtAsc">
										{t('players.sort.updatedAtAsc', 'Recently Updated (Oldest)')}
									</option>
								</select>
								<select
									value={urlCountry}
									onChange={(e) => handleFilterChange('country', e.target.value)}
									className="listing-dropdowns__select"
								>
									{uniqueCountries.map((c) => (
										<option key={c} value={c}>
											{c === 'All' ? t('players.filters.country', 'All Countries') : c}
										</option>
									))}
								</select>
								<select
									value={urlCareerType}
									onChange={(e) => handleFilterChange('career_type', e.target.value)}
									className="listing-dropdowns__select"
								>
									{uniqueCareerTypes.map((type) => (
										<option key={type} value={type}>
											{type === 'All' ? t('players.filters.formats', 'All Formats') : type}
										</option>
									))}
								</select>
							</div>
						</section>

						{error && <div className="error-message">{error}</div>}

						{players.length === 0 && !error ? (
							<div className="no-results">
								{t('players.notFound', 'No players found matching your criteria.')}
							</div>
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
