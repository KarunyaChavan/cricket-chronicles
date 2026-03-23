import React, { useState } from 'react'

import { GlobalContext } from './useGlobalContext'

const CACHE_KEY = 'cricket_players_cache'
const CACHE_TTL = 1000 * 60 * 60 // 1 hour time-to-live

/**
 * Helper to retrieve and validate cache from LocalStorage
 * Ensures data isn't stale before returning it.
 * @returns {Array} The cached players data or an empty array
 */
const getInitialCache = () => {
	try {
		const cached = localStorage.getItem(CACHE_KEY)
		if (!cached) return []

		const { timestamp, data } = JSON.parse(cached)
		if (Date.now() - timestamp < CACHE_TTL) {
			return data
		} else {
			localStorage.removeItem(CACHE_KEY) // Clear expired cache
		}
	} catch (e) {
		console.warn('Failed to parse cache from LocalStorage', e)
	}
	return []
}

/**
 * Global Provider component to manage application-wide state
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The Provider component
 */
export const GlobalProvider = ({ children }) => {
	const [theme, setTheme] = useState('dark')

	// Initialize state synchronously from LocalStorage wrapper
	const [playersCache, setPlayersCacheState] = useState(getInitialCache)

	const toggleTheme = () => {
		setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
	}

	const setPlayersCache = (data) => {
		setPlayersCacheState(data)
		try {
			localStorage.setItem(
				CACHE_KEY,
				JSON.stringify({
					timestamp: Date.now(),
					data: data,
				}),
			)
		} catch (e) {
			// Fail gracefully if quota is exceeded (e.g. 5MB) or in incognito
			console.warn('Failed to save to LocalStorage (possibly quota exceeded)', e)
		}
	}

	const value = {
		theme,
		toggleTheme,
		playersCache,
		setPlayersCache,
	}

	return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
}
