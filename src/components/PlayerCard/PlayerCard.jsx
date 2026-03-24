import { useTranslation } from 'react-i18next'
import './PlayerCard.css'

/**
 * Player card displaying photo, name, position, and date of birth.
 * @param {object} props - The component props.
 * @param {object} props.player - The player data object.
 * @param {function(number): void} props.onClick - Callback when the card is clicked.
 * @returns {JSX.Element} - The rendered player card component.
 */
const PlayerCard = ({ player, onClick }) => {
	const { t } = useTranslation()
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
					src={image_path || '/placeholder-player.svg'}
					alt={fullname}
					className="player-card__image"
					loading="lazy"
					onError={(e) => {
						e.currentTarget.onerror = null
						e.currentTarget.src = '/placeholder-player.svg'
					}}
				/>
			</div>

			<div className="player-card__content">
				<h3 className="player-card__name">{fullname}</h3>

				<div className="player-card__footer">
					<div className="player-card__footer-item">
						<span className="player-card__footer-label">{t('players.position', 'Position')}</span>
						<span className="player-card__footer-value">{position?.name || '—'}</span>
					</div>
					<div className="player-card__footer-item">
						<span className="player-card__footer-label">{t('players.dob', 'Date of Birth')}</span>
						<span className="player-card__footer-value">{formattedDob}</span>
					</div>
				</div>
			</div>
		</button>
	)
}

export default PlayerCard
