import PropTypes from 'prop-types'

/**
 * Renders the top hero section of the player detail page.
 * @param {object} props - Component props.
 * @param {object} props.player - Player data with bio.
 * @param {object} props.overallStats - Aggregated hero stats.
 * @returns {JSX.Element} The rendered hero section.
 */
const DetailHero = ({ player, overallStats }) => {
	const role = player.position?.name?.toLowerCase() || ''

	const getHeroMetrics = () => {
		const metrics = []
		metrics.push({ label: 'Matches', value: overallStats.matches })

		const isBatsman = role.includes('batsman') || role.includes('wicketkeeper')
		const isBowler = role.includes('bowler')
		const isAllrounder = role.includes('allrounder')

		if (isBowler) {
			metrics.push({ label: 'Wickets', value: overallStats.wickets })
			metrics.push({
				label: 'Econ',
				value: overallStats.economy,
				accent: true,
			})
			metrics.push({ label: 'B.SR', value: overallStats.bowlStrikeRate })
		} else if (isBatsman) {
			metrics.push({ label: 'Runs', value: overallStats.runs })
			metrics.push({
				label: 'Avg',
				value: overallStats.average,
				accent: true,
			})
			metrics.push({ label: '4s', value: overallStats.fourX })
			metrics.push({ label: '6s', value: overallStats.sixX })
		} else if (isAllrounder) {
			metrics.push({ label: 'Runs', value: overallStats.runs })
			metrics.push({
				label: 'Avg',
				value: overallStats.average,
				accent: true,
			})
			metrics.push({ label: 'Wkts', value: overallStats.wickets })
			metrics.push({ label: 'B.SR', value: overallStats.bowlStrikeRate })
		} else {
			metrics.push({ label: 'Runs', value: overallStats.runs })
			metrics.push({
				label: 'Avg',
				value: overallStats.average,
				accent: true,
			})
			metrics.push({ label: 'Wkts', value: overallStats.wickets })
		}
		return metrics
	}

	return (
		<section className="detail-hero">
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

			<div className="detail-hero__info">
				<div className="detail-hero__header">
					<div className="detail-hero__badges">
						{player.country?.name && (
							<span className="detail-hero__badge detail-hero__country">{player.country.name}</span>
						)}
						{player.position?.name && (
							<span className="detail-hero__badge detail-hero__position">
								{player.position.name}
							</span>
						)}
					</div>
					<h1 className="detail-hero__name">{player.fullname}</h1>
				</div>

				<div className="detail-hero__stats">
					{getHeroMetrics().map((metric, idx) => (
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
					))}
				</div>

				<div className="detail-bio">
					<h2 className="detail-bio__title">Player Bio</h2>
					<p className="detail-bio__text">{player.bioSentence}</p>
				</div>
			</div>
		</section>
	)
}

DetailHero.propTypes = {
	player: PropTypes.object.isRequired,
	overallStats: PropTypes.object.isRequired,
}

export default DetailHero
