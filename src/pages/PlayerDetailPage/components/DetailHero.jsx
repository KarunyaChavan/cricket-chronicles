import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { getOptimizedImageUrl } from '../../../utils/formatters'

/**
 * Renders the top hero section of the player detail page.
 * @param {object} props - Component props.
 * @param {object} props.player - Player data with bio.
 * @param {object} props.overallStats - Aggregated hero stats.
 * @returns {JSX.Element} The rendered hero section.
 */
const DetailHero = ({ player, overallStats }) => {
	const navigate = useNavigate()
	const { t } = useTranslation()
	const role = player.position?.name?.toLowerCase() || ''

	const getHeroMetrics = () => {
		if (!overallStats) return []
		const metrics = []
		metrics.push({ label: t('stats.matches', 'Matches'), value: overallStats.matches })

		const isBatsman = role.includes('batsman') || role.includes('wicketkeeper')
		const isBowler = role.includes('bowler')
		const isAllrounder = role.includes('allrounder')

		if (isBowler) {
			metrics.push({ label: t('stats.wickets', 'Wickets'), value: overallStats.wickets })
			metrics.push({
				label: t('stats.econ', 'Econ'),
				value: overallStats.economy,
				accent: true,
			})
			metrics.push({ label: t('stats.bsr', 'B.SR'), value: overallStats.bowlStrikeRate })
		} else if (isBatsman) {
			metrics.push({ label: t('stats.runs', 'Runs'), value: overallStats.runs })
			metrics.push({
				label: t('stats.avg', 'Avg'),
				value: overallStats.average,
				accent: true,
			})
			metrics.push({ label: t('stats.4s', '4s'), value: overallStats.fourX })
			metrics.push({ label: t('stats.6s', '6s'), value: overallStats.sixX })
		} else if (isAllrounder) {
			metrics.push({ label: t('stats.runs', 'Runs'), value: overallStats.runs })
			metrics.push({
				label: t('stats.avg', 'Avg'),
				value: overallStats.average,
				accent: true,
			})
			metrics.push({ label: t('stats.wickets', 'Wkts'), value: overallStats.wickets })
			metrics.push({ label: t('stats.bsr', 'B.SR'), value: overallStats.bowlStrikeRate })
		} else {
			metrics.push({ label: t('stats.runs', 'Runs'), value: overallStats.runs })
			metrics.push({
				label: t('stats.avg', 'Avg'),
				value: overallStats.average,
				accent: true,
			})
			metrics.push({ label: t('stats.wickets', 'Wkts'), value: overallStats.wickets })
		}
		return metrics
	}

	return (
		<section className="detail-hero">
			<div className="detail-hero__image-wrap">
				<img
					src={getOptimizedImageUrl(player.image_path, 1080, 85)}
					alt={player.fullname}
					className="detail-hero__image"
					onError={(e) => {
						e.currentTarget.onerror = null
						e.currentTarget.src = '/placeholder-player.svg'
					}}
				/>
			</div>

			<div className="detail-hero__info">
				<div className="detail-hero__header">
					<div className="detail-hero__badges">
						{player.country?.name && (
							<button
								type="button"
								className="detail-hero__badge detail-hero__country"
								onClick={() => navigate(`/?country=${encodeURIComponent(player.country.name)}`)}
							>
								{player.country.name}
							</button>
						)}
						{player.position?.name && (
							<button
								type="button"
								className="detail-hero__badge detail-hero__position"
								onClick={() => navigate(`/?position=${encodeURIComponent(player.position.name)}`)}
							>
								{player.position.name === 'Allrounder'
									? t('players.filters.allrounder', 'All-rounder')
									: t(
											`players.filters.${player.position.name.toLowerCase()}`,
											player.position.name,
										)}
							</button>
						)}
					</div>
					<h1 className="detail-hero__name">{player.fullname}</h1>
				</div>

				<div className="detail-hero__stats">
					{overallStats ? (
						getHeroMetrics().map((metric, idx) => (
							<div className="detail-hero__stat-item" key={idx}>
								<span className="detail-hero__stat-label">{metric.label}</span>
								<span
									className={`detail-hero__stat-value ${
										metric.accent ? 'detail-hero__stat-value--accent' : ''
									}`}
								>
									{metric.value || '0'}
								</span>
							</div>
						))
					) : (
						<p className="detail-bio__text">{t('players.noStats', 'No stats available.')}</p>
					)}
				</div>

				<div className="detail-bio">
					<h2 className="detail-bio__title">{t('players.bioTitle', 'Player Bio')}</h2>
					<p className="detail-bio__text">{player.bioSentence}</p>
				</div>
			</div>
		</section>
	)
}

DetailHero.propTypes = {
	player: PropTypes.object.isRequired,
	overallStats: PropTypes.object,
}

export default DetailHero
