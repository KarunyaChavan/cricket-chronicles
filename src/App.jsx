import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

const PlayerDetailPage = lazy(() => import('./pages/PlayerDetailPage'))
const PlayersListingPage = lazy(() => import('./pages/PlayersListingPage'))

/**
 * Minimal 404 fallback shown for unknown routes.
 * @returns {JSX.Element} The not-found UI with a home navigation link.
 */
const NotFound = () => (
	<div className="no-results">
		<p>Page Not Found</p>
		<Link to="/">Go Home</Link>
	</div>
)

/**
 * Main application component configuring routing and global layout
 * @returns {JSX.Element} The root application element
 */
function App() {
	return (
		<Router>
			<Suspense fallback={<div>Loading...</div>}>
				<Routes>
					<Route path="/" element={<PlayersListingPage />} />
					<Route path="/player/:id" element={<PlayerDetailPage />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Suspense>
		</Router>
	)
}

export default App
