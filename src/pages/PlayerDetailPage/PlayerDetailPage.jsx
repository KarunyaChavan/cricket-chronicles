import { useQuery } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { playerService } from '../../api/sportmonks'
import Header from '../../components/Header/Header'
import './PlayerDetailPage.css'

/**
 * Humanise gender code from API
 * @param {string} g - The gender code ('m' or 'f').
 * @returns {string} - The human-readable gender string.
 */
const formatGender = (g) => {
	if (g === 'm') return 'Male'
	if (g === 'f') return 'Female'
	return g || '—'
}

/**
 * Format a YYYY-MM-DD date string to "14 Sep 1994"
 * @param {string} dob - The ISO date string.
 * @returns {string} - The formatted date string.
 */
const formatDate = (dob) => {
	if (!dob) return '—'
	return new Date(dob).toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	})
}

/**
 * Aggregate career stats across all seasons for a given format type.
 * Returns { innings, runs, wickets, matches, average }.
 * Wickets will be 0 if bowling is always null.
 * @param {Array} career - The player's career data array.
 * @param {string} type - The format type (e.g., 'Test', 'ODI').
 * @returns {object} - The aggregated statistics object.
 */
const aggregateByType = (career, type) => {
	const entries = career.filter((c) => c.type === type)
	let totalMatches = 0
	let totalInnings = 0
	let totalRuns = 0
	let totalWickets = 0
	let totalRunsForAvg = 0
	let totalInningsForAvg = 0
	let totalNotOuts = 0

	entries.forEach((c) => {
		const b = c.batting || {}
		const bl = c.bowling || {}

		totalMatches += b.matches || 0
		totalInnings += b.innings || 0
		totalRuns += b.runs_scored || 0
		totalWickets += bl.wickets || 0
		totalRunsForAvg += b.runs_scored || 0
		totalInningsForAvg += b.innings || 0
		totalNotOuts += b.not_outs || 0
	})

	const dismissals = totalInningsForAvg - totalNotOuts
	const average = dismissals > 0 ? (totalRunsForAvg / dismissals).toFixed(2) : '—'

	return {
		matches: totalMatches,
		innings: totalInnings,
		runs: totalRuns,
		wickets: totalWickets,
		average,
	}
}

/**
 * Compute overall aggregate across all career entries for the hero stats row.
 * @param {Array} career - The player's career data array.
 * @returns {object} - The overall aggregate statistics.
 */
const computeOverallStats = (career) => {
	let totalMatches = 0
	let totalRuns = 0
	let totalWickets = 0
	let totalInnings = 0
	let totalNotOuts = 0

	career.forEach((c) => {
		const b = c.batting || {}
		const bl = c.bowling || {}
		totalMatches += b.matches || 0
		totalRuns += b.runs_scored || 0
		totalWickets += bl.wickets || 0
		totalInnings += b.innings || 0
		totalNotOuts += b.not_outs || 0
	})

	const dismissals = totalInnings - totalNotOuts
	const average = dismissals > 0 ? (totalRuns / dismissals).toFixed(1) : '—'

	return { totalMatches, totalRuns, totalWickets, average }
}

/**
 * Build a bio paragraph from the player's real API fields.
 * @param {object} player - The player data object.
 * @returns {string} - The generated biography string.
 */
const buildBio = (player) => {
	const name = player.fullname || 'This player'
	const gender = formatGender(player.gender).toLowerCase()
	const country = player.country?.name
	const dob = player.dateofbirth ? formatDate(player.dateofbirth) : null
	const batting = player.battingstyle
	const bowling = player.bowlingstyle

	let sentence = dob ? `Born on ${dob}, ` : ''
	sentence += `${name} is a ${gender} cricketer`
	if (country) sentence += ` representing ${country}`
	sentence += '.'
	if (batting || bowling) {
		sentence += ` Known for ${[batting && `${batting} batting`, bowling && `${bowling} bowling`].filter(Boolean).join(' and ')}.`
	}
	return sentence
}

const TABS = ['Stats', 'Bio', 'Teams']

/**
 * Player Detail Page Component
 * @returns {JSX.Element} The rendered player detail page
 */
const PlayerDetailPage = () => {
	const { id } = useParams()

	const [activeTab, setActiveTab] = useState('Stats')

	const {
		data: player = null,
		isLoading,
		isError,
		error: queryError,
	} = useQuery({
		queryKey: ['player', id],
		queryFn: async ({ signal }) => {
			const response = await playerService.getPlayerById(id, undefined, { signal })
			return response.data || null
		},
		enabled: !!id,
		staleTime: 1000 * 60 * 30, // 30 minutes
	})

	const error = isError ? queryError?.message || 'Failed to load player details.' : ''

	/** Unique career format types from the API response */
	const careerTypes = useMemo(() => {
		if (!player?.career?.length) return []
		return [...new Set(player.career.map((c) => c.type))]
	}, [player])

	/** Overall hero aggregate stats */
	const overallStats = useMemo(() => {
		if (!player?.career?.length) return null
		return computeOverallStats(player.career)
	}, [player])

	/** Deduplicated teams list by team.id */
	const uniqueTeams = useMemo(() => {
		if (!player?.teams?.length) return []
		const seen = new Set()
		return player.teams.filter((t) => {
			if (seen.has(t.id)) return false
			seen.add(t.id)
			return true
		})
	}, [player])

	if (isLoading) return <div className="loading-spinner" />
	if (error) return <div className="error-message">{error}</div>
	if (!player) return <div className="no-results">Player not found</div>

	const bio = buildBio(player)

	return (
		<div className="player-detail">
			<Header showBackButton={true} />

			<main className="detail-main">
				{/* Hero Section */}
				<section className="detail-hero">
					{/* Player Image */}
					<div className="detail-hero__image-wrap">
						<img
							src={player.image_path || 'https://placehold.co/600x600?text=No+Image'}
							alt={player.fullname}
							className="detail-hero__image"
							onError={(e) => {
								e.currentTarget.onerror = null
								e.currentTarget.src = 'https://placehold.co/600x600?text=No+Image'
							}}
						/>
					</div>

					{/* Hero Info */}
					<div className="detail-hero__info">
						<div>
							{player.country?.name && (
								<p className="detail-hero__country">{player.country.name}</p>
							)}
							<h1 className="detail-hero__name">{player.fullname}</h1>
						</div>

						{/* Aggregate career stats */}
						{overallStats && (
							<div className="detail-hero__stats">
								<div className="detail-hero__stat-item">
									<span className="detail-hero__stat-label">Matches</span>
									<span className="detail-hero__stat-value">{overallStats.totalMatches}</span>
								</div>
								<div className="detail-hero__stat-item">
									<span className="detail-hero__stat-label">Runs</span>
									<span className="detail-hero__stat-value">
										{overallStats.totalRuns.toLocaleString()}
									</span>
								</div>
								<div className="detail-hero__stat-item">
									<span className="detail-hero__stat-label">Average</span>
									<span className="detail-hero__stat-value detail-hero__stat-value--accent">
										{overallStats.average}
									</span>
								</div>
								{overallStats.totalWickets > 0 && (
									<div className="detail-hero__stat-item">
										<span className="detail-hero__stat-label">Wickets</span>
										<span className="detail-hero__stat-value">{overallStats.totalWickets}</span>
									</div>
								)}
							</div>
						)}
					</div>
				</section>

				{/* Tab Bar */}
				<div className="detail-tabs" role="tablist">
					{TABS.map((tab) => (
						<button
							key={tab}
							role="tab"
							aria-selected={activeTab === tab}
							className={`detail-tab ${activeTab === tab ? 'detail-tab--active' : ''}`}
							onClick={() => setActiveTab(tab)}
							type="button"
						>
							{tab}
						</button>
					))}
				</div>

				{/* Content Grid */}
				<div className="detail-content-grid">
					{/* Left Column */}
					<div>
						{/* Stats Tab */}
						{activeTab === 'Stats' && (
							<section aria-label="Career Statistics">
								<h2 className="detail-section-title">Career Statistics</h2>

								{careerTypes.length === 0 ? (
									<p style={{ color: 'var(--color-on-surface-variant)' }}>
										No career data available.
									</p>
								) : (
									careerTypes.map((type) => {
										const agg = aggregateByType(player.career, type)
										return (
											<div key={type} className="career-format-block">
												<div className="career-format-header">
													<span className="career-format-label">{type}</span>
												</div>
												<table className="career-table">
													<thead>
														<tr>
															<th>Innings</th>
															<th>Runs</th>
															<th>Wickets</th>
															<th>Avg</th>
														</tr>
													</thead>
													<tbody>
														<tr>
															<td>{agg.innings}</td>
															<td>{agg.runs.toLocaleString()}</td>
															<td>{agg.wickets > 0 ? agg.wickets : '—'}</td>
															<td className="accent">{agg.average}</td>
														</tr>
													</tbody>
												</table>
											</div>
										)
									})
								)}

								{/* Official Player Profile */}
								<div className="detail-profile" style={{ marginTop: '2rem' }}>
									<h3 className="detail-profile__title">Official Player Profile</h3>
									<div className="detail-profile__grid">
										<div className="detail-profile__row">
											<span className="detail-profile__label">Full Name</span>
											<span className="detail-profile__value">{player.fullname}</span>
										</div>
										<div className="detail-profile__row">
											<span className="detail-profile__label">Date of Birth</span>
											<span className="detail-profile__value">
												{formatDate(player.dateofbirth)}
											</span>
										</div>
										<div className="detail-profile__row">
											<span className="detail-profile__label">Gender</span>
											<span className="detail-profile__value">{formatGender(player.gender)}</span>
										</div>
										<div className="detail-profile__row">
											<span className="detail-profile__label">Batting Style</span>
											<span className="detail-profile__value">{player.battingstyle || '—'}</span>
										</div>
										<div className="detail-profile__row" style={{ gridColumn: '1 / -1' }}>
											<span className="detail-profile__label">Bowling Style</span>
											<span className="detail-profile__value">{player.bowlingstyle || '—'}</span>
										</div>
									</div>
								</div>
							</section>
						)}

						{/* Bio Tab */}
						{activeTab === 'Bio' && (
							<section>
								<h2 className="detail-section-title">Player Bio</h2>
								<div className="detail-profile">
									<div className="detail-profile__grid">
										<div className="detail-profile__row">
											<span className="detail-profile__label">Full Name</span>
											<span className="detail-profile__value">{player.fullname}</span>
										</div>
										<div className="detail-profile__row">
											<span className="detail-profile__label">Gender</span>
											<span className="detail-profile__value">{formatGender(player.gender)}</span>
										</div>
										<div className="detail-profile__row">
											<span className="detail-profile__label">Country</span>
											<span className="detail-profile__value">{player.country?.name || '—'}</span>
										</div>
										<div className="detail-profile__row">
											<span className="detail-profile__label">Date of Birth</span>
											<span className="detail-profile__value">
												{formatDate(player.dateofbirth)}
											</span>
										</div>
										<div className="detail-profile__row">
											<span className="detail-profile__label">Batting Style</span>
											<span className="detail-profile__value">{player.battingstyle || '—'}</span>
										</div>
										<div className="detail-profile__row">
											<span className="detail-profile__label">Bowling Style</span>
											<span className="detail-profile__value">{player.bowlingstyle || '—'}</span>
										</div>
									</div>
								</div>
							</section>
						)}

						{/* Teams Tab */}
						{activeTab === 'Teams' && (
							<section>
								<h2 className="detail-section-title">Teams</h2>
								{uniqueTeams.length === 0 ? (
									<p style={{ color: 'var(--color-on-surface-variant)' }}>
										No team information available.
									</p>
								) : (
									<div className="detail-teams__badges">
										{uniqueTeams.map((team) => (
											<div key={team.id} className="detail-teams__badge">
												{team.name}
											</div>
										))}
									</div>
								)}
							</section>
						)}
					</div>

					{/* Right Sidebar */}
					<aside className="detail-sidebar">
						{/* Teams */}
						{uniqueTeams.length > 0 && (
							<div className="detail-teams">
								<h2 className="detail-teams__title">Teams</h2>
								<div className="detail-teams__badges">
									{uniqueTeams.map((team) => (
										<div key={team.id} className="team-badge">
											{team.name}
										</div>
									))}
								</div>
							</div>
						)}

						{/* Bio */}
						<div className="detail-bio">
							<h2 className="detail-bio__title">Player Bio</h2>
							<p className="detail-bio__text">{bio}</p>
						</div>
					</aside>
				</div>
			</main>

			{/* Share FAB */}
			<button
				className="detail-fab"
				type="button"
				aria-label="Share player profile"
				onClick={() => {
					if (navigator.share) {
						navigator.share({ title: player.fullname, url: window.location.href })
					}
				}}
			>
				<span className="detail-fab__label">Share Profile</span>
			</button>
		</div>
	)
}

export default PlayerDetailPage
