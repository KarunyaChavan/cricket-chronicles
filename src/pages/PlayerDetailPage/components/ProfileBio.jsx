import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { formatDate, formatGender } from '../../../utils/formatters'

/**
 * Renders the detailed profile biography grid.
 * @param {object} props - Component props.
 * @param {object} props.player - Player profile data.
 * @returns {JSX.Element} The rendered profile grid.
 */
const ProfileBio = ({ player }) => {
	const { t } = useTranslation()
	return (
		<section>
			<h2 className="detail-section-title">{t('players.bioTitle', 'Player Bio')}</h2>
			<div className="detail-profile">
				<div className="detail-profile__grid">
					<div className="detail-profile__row">
						<span className="detail-profile__label">{t('bio.fullName', 'Full Name')}</span>
						<span className="detail-profile__value">{player.fullname}</span>
					</div>
					<div className="detail-profile__row">
						<span className="detail-profile__label">{t('bio.gender', 'Gender')}</span>
						<span className="detail-profile__value">{formatGender(player.gender)}</span>
					</div>
					<div className="detail-profile__row">
						<span className="detail-profile__label">{t('bio.country', 'Country')}</span>
						<span className="detail-profile__value">{player.country?.name || '—'}</span>
					</div>
					<div className="detail-profile__row">
						<span className="detail-profile__label">{t('bio.dob', 'Date of Birth')}</span>
						<span className="detail-profile__value">{formatDate(player.dateofbirth)}</span>
					</div>
					<div className="detail-profile__row">
						<span className="detail-profile__label">{t('bio.position', 'Position')}</span>
						<span className="detail-profile__value">{player.position?.name || '—'}</span>
					</div>
					<div className="detail-profile__row">
						<span className="detail-profile__label">{t('bio.batting', 'Batting Style')}</span>
						<span className="detail-profile__value">{player.battingstyle || '—'}</span>
					</div>
					<div className="detail-profile__row">
						<span className="detail-profile__label">{t('bio.bowling', 'Bowling Style')}</span>
						<span className="detail-profile__value">{player.bowlingstyle || '—'}</span>
					</div>
				</div>
			</div>
		</section>
	)
}

ProfileBio.propTypes = {
	player: PropTypes.object.isRequired,
}

export default ProfileBio
