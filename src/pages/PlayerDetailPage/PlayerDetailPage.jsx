import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import CareerStats from './components/CareerStats'
import DetailHero from './components/DetailHero'
import ProfileBio from './components/ProfileBio'
import TeamList from './components/TeamList'
import { playerService } from '../../api/sportmonks'
import Header from '../../components/Header/Header'
import { formatDate, formatGender } from '../../utils/formatters'
import { computeOverallStats } from '../../utils/stats'
import './PlayerDetailPage.css'

/**
 * Constructs a readable biography sentence for the player.
 * @param {object} player - The player object from API.
 * @returns {string} The constructed biography sentence.
 */
const buildBio = (player) => {
	const {
		fullname: name,
		gender,
		country: countryObj,
		dateofbirth: dob,
		battingstyle: batting,
		bowlingstyle: bowling,
	} = player
	const country = countryObj?.name
	let sentence = dob ? `Born on ${formatDate(dob)}, ` : ''
	sentence += `${name} is a ${formatGender(gender)} cricketer`
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
 * Orchestrates the player profile view using modular sub-components.
 * @returns {JSX.Element} The rendered player detail page.
 */
const PlayerDetailPage = () => {
	const { id } = useParams()
	const { t } = useTranslation()
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

	const playerWithBio = {
		...player,
		bioSentence: buildBio(player),
	}

	return (
		<div className="player-detail">
			<Header showBackButton={true} />

			<main className="detail-main">
				<DetailHero player={playerWithBio} overallStats={overallStats} />

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
							{t(`tabs.${tab.toLowerCase()}`, tab)}
						</button>
					))}
				</div>

				{activeTab === 'Stats' && <CareerStats career={player.career} careerTypes={careerTypes} />}

				{activeTab === 'Bio' && <ProfileBio player={player} />}

				{activeTab === 'Teams' && <TeamList teams={uniqueTeams} />}
			</main>

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
				<span className="detail-fab__label">{t('detail.share', 'Share Profile')}</span>
			</button>
		</div>
	)
}

export default PlayerDetailPage
