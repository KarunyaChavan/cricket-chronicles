import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './Loader.css'

/**
 * An immersive 30-second progressive loading animation designed to retain user engagement
 * while massive client-side data hydration occurs from the raw API payload.
 * @returns {JSX.Element} The rendered Loader component.
 */
const Loader = () => {
	const { t } = useTranslation()
	const phrases = [
		t('loader.phrase1', 'Preparing the pitch...'),
		t('loader.phrase2', 'Assembling the squads...'),
		t('loader.phrase3', 'Crunching career statistics...'),
		t('loader.phrase4', 'Reviewing match histories...'),
		t('loader.phrase5', 'Finalizing player chronicles...'),
	]

	const [index, setIndex] = useState(0)

	useEffect(() => {
		// Cycle text phrases every 5.5 seconds smoothly (matching the ~30s total async time)
		const interval = setInterval(() => {
			setIndex((prev) => (prev + 1) % phrases.length)
		}, 5500)
		return () => clearInterval(interval)
	}, [phrases.length])

	return (
		<div className="immersive-loader">
			<div className="immersive-loader__animation">
				<div className="cricket-ball" />
				<div className="cricket-shadow" />
			</div>
			<div className="immersive-loader__text-wrapper">
				<p className="immersive-loader__text" key={index}>
					{phrases[index]}
				</p>
			</div>
			<div className="immersive-loader__progress-bar">
				<div className="immersive-loader__progress-fill" />
			</div>
		</div>
	)
}

export default Loader
