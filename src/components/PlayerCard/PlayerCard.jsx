import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { getOptimizedImageUrl } from '../../utils/formatters'
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
					src={getOptimizedImageUrl(image_path, 256, 75)}
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

PlayerCard.propTypes = {
	player: PropTypes.shape({
		id: PropTypes.number.isRequired,
		fullname: PropTypes.string.isRequired,
		image_path: PropTypes.string,
		position: PropTypes.shape({ name: PropTypes.string }),
		dateofbirth: PropTypes.string,
	}).isRequired,
	onClick: PropTypes.func.isRequired,
}

export default PlayerCard
