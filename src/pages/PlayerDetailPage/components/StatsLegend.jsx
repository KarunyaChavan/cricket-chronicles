import { useTranslation } from 'react-i18next'

/**
 * Statistics Legend component providing definitions for performance abbreviations.
 * @returns {JSX.Element} The rendered legend component.
 */
const StatsLegend = () => {
	const { t } = useTranslation()
	return (
		<aside className="stats-legend">
			<h3 className="stats-legend__title">{t('glossary.title', 'Glossary')}</h3>
			<div className="stats-legend__grid">
				<div className="stats-legend__item">
					<span className="stats-legend__term">Inn</span>
					<span className="stats-legend__desc">{t('glossary.inn', 'Innings Played')}</span>
				</div>
				<div className="stats-legend__item">
					<span className="stats-legend__term">BF</span>
					<span className="stats-legend__desc">{t('glossary.bf', 'Balls Faced')}</span>
				</div>
				<div className="stats-legend__item">
					<span className="stats-legend__term">4s / 6s</span>
					<span className="stats-legend__desc">{t('glossary.boundaries', 'Boundaries')}</span>
				</div>
				<div className="stats-legend__item">
					<span className="stats-legend__term">HS</span>
					<span className="stats-legend__desc">{t('glossary.hs', 'Highest Score')}</span>
				</div>
				<div className="stats-legend__item">
					<span className="stats-legend__term">Avg</span>
					<span className="stats-legend__desc">{t('glossary.avg', 'Average')}</span>
				</div>
				<div className="stats-legend__item">
					<span className="stats-legend__term">SR</span>
					<span className="stats-legend__desc">{t('glossary.sr', 'Strike Rate')}</span>
				</div>
				<div className="stats-legend__item">
					<span className="stats-legend__term">Wkts</span>
					<span className="stats-legend__desc">{t('glossary.wkts', 'Wickets Taken')}</span>
				</div>
				<div className="stats-legend__item">
					<span className="stats-legend__term">Mdn</span>
					<span className="stats-legend__desc">{t('glossary.mdn', 'Maiden Overs')}</span>
				</div>
				<div className="stats-legend__item">
					<span className="stats-legend__term">Econ</span>
					<span className="stats-legend__desc">{t('glossary.econ', 'Economy Rate')}</span>
				</div>
				<div className="stats-legend__item">
					<span className="stats-legend__term">B.SR</span>
					<span className="stats-legend__desc">{t('glossary.bsr', 'Bowling SR')}</span>
				</div>
			</div>
		</aside>
	)
}

export default StatsLegend
