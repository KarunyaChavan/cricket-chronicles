/**
 * @file Header.jsx
 * @description Unified top navigation bar for the application.
 * @module Header
 */

import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import './Header.css'

/**
 * Common Header component for both Listing and Detail pages.
 * @param {object} props - Component props.
 * @param {boolean} [props.showBackButton] - Whether to display the back button.
 * @returns {JSX.Element} - The rendered Header component.
 */
const Header = ({ showBackButton = false }) => {
	const navigate = useNavigate()
	const { t, i18n } = useTranslation()

	return (
		<header className="app-header">
			<div className="app-header__inner">
				<div className="app-header__left">
					{showBackButton && (
						<button
							className="app-header__back-btn"
							onClick={() => navigate(-1)}
							type="button"
							aria-label="Go back to previous page"
						>
							← {t('app.back', 'Back')}
						</button>
					)}
				</div>
				<div className="app-header__center">
					<Link to="/" className="app-header__logo" aria-label="Go to home page">
						PAVILION
					</Link>
				</div>
				<div className="app-header__right">
					<select
						className="app-header__lang"
						value={i18n.language?.split('-')[0] || 'en'}
						onChange={(e) => i18n.changeLanguage(e.target.value)}
						aria-label={t('app.changeLanguage', 'Change language')}
					>
						<option value="en">English</option>
						<option value="es">Español</option>
					</select>
				</div>
			</div>
		</header>
	)
}

export default Header
