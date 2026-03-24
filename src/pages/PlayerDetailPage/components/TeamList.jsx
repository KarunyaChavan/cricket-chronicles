import PropTypes from 'prop-types'

/**
 * Renders the list of teams the player belongs to.
 * @param {object} props - Component props.
 * @param {Array} props.teams - The teams array.
 * @returns {JSX.Element} The rendered component.
 */
const TeamList = ({ teams }) => (
	<section>
		<h2 className="detail-section-title">Teams</h2>
		{teams.length === 0 ? (
			<p style={{ color: 'var(--color-on-surface-variant)' }}>No team information available.</p>
		) : (
			<div className="detail-teams__badges">
				{teams.map((team) => (
					<div key={team.id} className="detail-teams__badge">
						{team.image_path && <img src={team.image_path} alt="" className="team-badge__logo" />}
						<span className="team-badge__name">{team.name}</span>
					</div>
				))}
			</div>
		)}
	</section>
)

TeamList.propTypes = {
	teams: PropTypes.array.isRequired,
}

export default TeamList
