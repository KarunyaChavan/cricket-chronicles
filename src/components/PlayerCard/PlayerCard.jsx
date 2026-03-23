import './PlayerCard.css'

const PlayerCard = ({ player, onClick }) => {
	const { id, fullname, image_path, country, position } = player

	return (
		<button
			type="button"
			className="player-card"
			onClick={() => onClick(id)}
			aria-label={`View details for ${fullname}`}
		>
			<div className="player-card__image-container">
				<img
					src={image_path || 'https://via.placeholder.com/100?text=No+Image'}
					alt={fullname}
					className="player-card__image"
					loading="lazy"
					onError={(e) => {
						e.currentTarget.onerror = undefined
						e.currentTarget.src = 'https://via.placeholder.com/100?text=No+Image'
					}}
				/>
			</div>
			<div className="player-card__content">
				<h3 className="player-card__name">{fullname}</h3>
				<div className="player-card__info">
					{country?.name && <span className="player-card__country">{country.name}</span>}
					{country?.name && position?.name && ' • '}
					{position?.name && <span className="player-card__position">{position.name}</span>}
				</div>
				<div className="player-card__meta">
					<span className="player-card__badge">ID: {id}</span>
				</div>
			</div>
		</button>
	)
}

export default PlayerCard
