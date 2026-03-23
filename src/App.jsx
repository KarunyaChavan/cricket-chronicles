import { useTranslation } from 'react-i18next'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import PlayerDetailPage from './pages/PlayerDetailPage'
import PlayersListingPage from './pages/PlayersListingPage'

/**
 * Main application component configuring routing and global layout
 * @returns {JSX.Element} The root application element
 */
function App() {
	const { t } = useTranslation()

	return (
		<Router>
			<div className="l-container">
				<header className="header">
					<h1 className="header__title">{t('app.title')}</h1>
					<p className="header__subtitle">{t('app.subtitle')}</p>
				</header>

				<main className="main-content">
					<Routes>
						<Route path="/" element={<PlayersListingPage />} />
						<Route path="/player/:id" element={<PlayerDetailPage />} />
						<Route path="*" element={<div className="no-results">Page Not Found</div>} />
					</Routes>
				</main>
			</div>
		</Router>
	)
}

export default App
