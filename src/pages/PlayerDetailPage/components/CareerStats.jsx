import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import StatsLegend from './StatsLegend'
import { aggregateByType } from '../../../utils/stats'

/**
 * Renders the career statistics tables and glossary.
 * @param {object} props - Component props.
 * @param {Array} props.career - Player career data.
 * @param {Array} props.careerTypes - Unique format types.
 * @returns {JSX.Element} The rendered statistics section.
 */
const CareerStats = ({ career, careerTypes }) => {
	const { t } = useTranslation()
	return (
		<section aria-label="Career Statistics">
			<h2 className="detail-section-title">{t('stats.careerTitle', 'Career Statistics')}</h2>

			{careerTypes.length === 0 ? (
				<p style={{ color: 'var(--color-on-surface-variant)' }}>
					{t('stats.noData', 'No career data available.')}
				</p>
			) : (
				<div className="detail-content-grid">
					<div>
						{careerTypes.map((type) => {
							const agg = aggregateByType(career, type)
							return (
								<div key={type} className="career-format-block">
									<div className="career-format-header">
										<span className="career-format-label">{type}</span>
									</div>
									<div className="career-table-wrapper">
										<table className="career-table">
											<thead>
												<tr>
													<th>Matches</th>
													<th>Inn</th>
													<th>Runs</th>
													<th>BF</th>
													<th>4s</th>
													<th>6s</th>
													<th>HS</th>
													<th>Avg</th>
													<th>SR</th>
													<th>100s</th>
													<th>50s</th>
													<th>Wkts</th>
													<th>Mdn</th>
													<th>Overs</th>
													<th>Econ</th>
													<th>B.SR</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>{agg.matches}</td>
													<td>{agg.innings}</td>
													<td>{agg.runs.toLocaleString()}</td>
													<td>{agg.ballsFaced}</td>
													<td>{agg.fourX}</td>
													<td>{agg.sixX}</td>
													<td>{agg.highestScore}</td>
													<td className="accent">{agg.average}</td>
													<td>{agg.batStrikeRate}</td>
													<td>{agg.hundreds}</td>
													<td>{agg.fifties}</td>
													<td>{agg.wickets}</td>
													<td>{agg.medians}</td>
													<td>{agg.overs}</td>
													<td>{agg.economy}</td>
													<td>{agg.bowlStrikeRate}</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							)
						})}
					</div>
					<StatsLegend />
				</div>
			)}
		</section>
	)
}

CareerStats.propTypes = {
	career: PropTypes.arrayOf(
		PropTypes.shape({
			type: PropTypes.string,
			seasonid: PropTypes.number,
			batting: PropTypes.object,
			bowling: PropTypes.object,
		}),
	).isRequired,
	careerTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default CareerStats
