import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import PlayerDetailPage from './pages/PlayerDetailPage'
import PlayersListingPage from './pages/PlayersListingPage'

/**
 * Main application component configuring routing and global layout
 * @returns {JSX.Element} The root application element
 */
function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<PlayersListingPage />} />
				<Route path="/player/:id" element={<PlayerDetailPage />} />
				<Route path="*" element={<div className="no-results">Page Not Found</div>} />
			</Routes>
		</Router>
	)
}

export default App
