import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { playerService } from '../../api/sportmonks'
import './PlayerDetailPage.css'

/**
 * Player Detail Page Component
 * @returns {JSX.Element} The rendered player detail page
 */
const PlayerDetailPage = () => {
	const { id } = useParams()
	const navigate = useNavigate()

	const [player, setPlayer] = useState()
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		const controller = new AbortController()

		const fetchPlayer = async () => {
			setLoading(true)
			setError('')
			try {
				const response = await playerService.getPlayerById(id, undefined, {
					signal: controller.signal,
				})
				setPlayer(response.data || undefined)
			} catch (err) {
				if (err.name === 'AbortError') return
				setError('Failed to load player details.')
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		if (id) {
			fetchPlayer()
		}

		return () => {
			controller.abort()
		}
	}, [id])

	if (loading) return <div className="loading-spinner" />
	if (error) return <div className="error-message">{error}</div>
	if (!player) return <div className="no-results">Player not found</div>

	return (
		<div className="player-detail">
			<button className="btn-back" onClick={() => navigate('/')}>
				&larr; Back to Players
			</button>

			<div className="player-detail__header">
				<div className="player-detail__image-container">
					<img
						src={player.image_path || 'https://via.placeholder.com/200?text=No+Image'}
						alt={player.fullname}
						className="player-detail__image"
						onError={(e) => {
							e.currentTarget.onerror = undefined
							e.currentTarget.src = 'https://via.placeholder.com/200?text=No+Image'
						}}
					/>
				</div>
				<div className="player-detail__info">
					<h1 className="player-detail__name">{player.fullname}</h1>
					<div className="player-detail__meta">
						{player.country?.name && (
							<p className="meta-item">
								<span className="meta-label">Nationality:</span> {player.country.name}
							</p>
						)}
						{player.position?.name && (
							<p className="meta-item">
								<span className="meta-label">Position:</span> {player.position.name}
							</p>
						)}
						{player.dateofbirth && (
							<p className="meta-item">
								<span className="meta-label">Born:</span>{' '}
								{new Date(player.dateofbirth).toLocaleDateString()}
							</p>
						)}
						{player.gender && (
							<p className="meta-item">
								<span className="meta-label">Gender:</span> {player.gender}
							</p>
						)}
					</div>
				</div>
			</div>

			{player.teams && player.teams.length > 0 && (
				<section className="player-detail__section">
					<h2 className="section-title">Teams</h2>
					<div className="team-list">
						{player.teams
							.filter((team, index, self) => index === self.findIndex((t) => t.name === team.name))
							.map((team) => (
								<div key={team.id} className="team-badge">
									{team.name}
								</div>
							))}
					</div>
				</section>
			)}

			{/* Render Career stats if available and logically matched from API */}
			{player.career && player.career.length > 0 && (
				<section className="player-detail__section">
					<h2 className="section-title">Career Statistics</h2>
					<div className="stats-grid">
						{player.career.slice(0, 4).map((stat, index) => (
							<div key={index} className="stat-card">
								<h3 className="stat-card__type">{stat.type || 'Tournament Match'}</h3>
								<div className="stat-card__value">Season {stat.season_id}</div>
							</div>
						))}
					</div>
				</section>
			)}
		</div>
	)
}

export default PlayerDetailPage
