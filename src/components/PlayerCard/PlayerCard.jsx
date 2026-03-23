import './PlayerCard.css'

/**
 * Player card displaying photo, name, position, and date of birth.
 * @param {object} props - The component props.
 * @param {object} props.player - The player data object.
 * @param {function(number): void} props.onClick - Callback when the card is clicked.
 * @returns {JSX.Element} - The rendered player card component.
 */
const PlayerCard = ({ player, onClick }) => {
	const { id, fullname, image_path, position, dateofbirth } = player

	const formattedDob = dateofbirth
		? new Date(dateofbirth).toLocaleDateString('en-GB', {
				day: '2-digit',
				month: 'short',
				year: 'numeric',
			})
		: '—'

	return (
		<button
			type="button"
			className="player-card"
			onClick={() => onClick(id)}
			aria-label={`View details for ${fullname}`}
		>
			<div className="player-card__image-wrapper">
				<img
					src={image_path || 'https://placehold.co/400x500?text=No+Image'}
					alt={fullname}
					className="player-card__image"
					loading="lazy"
					onError={(e) => {
						e.currentTarget.onerror = null
						e.currentTarget.src = 'https://placehold.co/400x500?text=No+Image'
					}}
				/>
			</div>

			<div className="player-card__content">
				<h3 className="player-card__name">{fullname}</h3>

				<div className="player-card__footer">
					<div className="player-card__footer-item">
						<span className="player-card__footer-label">Position</span>
						<span className="player-card__footer-value">{position?.name || '—'}</span>
					</div>
					<div className="player-card__footer-item">
						<span className="player-card__footer-label">Date of Birth</span>
						<span className="player-card__footer-value">{formattedDob}</span>
					</div>
				</div>
			</div>
		</button>
	)
}

export default PlayerCard
