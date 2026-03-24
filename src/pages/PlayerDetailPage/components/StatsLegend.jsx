// StatsLegend doesn't require PropTypes for static content

/**
 * Statistics Legend component providing definitions for performance abbreviations.
 * @returns {JSX.Element} The rendered legend component.
 */
const StatsLegend = () => (
	<aside className="stats-legend">
		<h3 className="stats-legend__title">Glossary</h3>
		<div className="stats-legend__grid">
			<div className="stats-legend__item">
				<span className="stats-legend__term">Inn</span>
				<span className="stats-legend__desc">Innings Played</span>
			</div>
			<div className="stats-legend__item">
				<span className="stats-legend__term">BF</span>
				<span className="stats-legend__desc">Balls Faced</span>
			</div>
			<div className="stats-legend__item">
				<span className="stats-legend__term">4s / 6s</span>
				<span className="stats-legend__desc">Boundaries</span>
			</div>
			<div className="stats-legend__item">
				<span className="stats-legend__term">HS</span>
				<span className="stats-legend__desc">Highest Score</span>
			</div>
			<div className="stats-legend__item">
				<span className="stats-legend__term">Avg</span>
				<span className="stats-legend__desc">Average</span>
			</div>
			<div className="stats-legend__item">
				<span className="stats-legend__term">SR</span>
				<span className="stats-legend__desc">Strike Rate</span>
			</div>
			<div className="stats-legend__item">
				<span className="stats-legend__term">Wkts</span>
				<span className="stats-legend__desc">Wickets Taken</span>
			</div>
			<div className="stats-legend__item">
				<span className="stats-legend__term">Mdn</span>
				<span className="stats-legend__desc">Maiden Overs</span>
			</div>
			<div className="stats-legend__item">
				<span className="stats-legend__term">Econ</span>
				<span className="stats-legend__desc">Economy Rate</span>
			</div>
			<div className="stats-legend__item">
				<span className="stats-legend__term">B.SR</span>
				<span className="stats-legend__desc">Bowling SR</span>
			</div>
		</div>
	</aside>
)

export default StatsLegend
