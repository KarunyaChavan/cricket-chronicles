import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { get, set, del } from 'idb-keyval'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import './i18n'
import App from './App.jsx'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 60 * 24, // 24 hours
			staleTime: 1000 * 60 * 60, // 1 hour
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
})

const persister = createAsyncStoragePersister({
	storage: {
		getItem: async (key) => await get(key),
		setItem: async (key, value) => {
			try {
				await set(key, value)
			} catch (err) {
				console.error('IDB set error', err)
				throw err
			}
		},
		removeItem: async (key) => await del(key),
	},
})

// Remove old global caches if they exist to keep things tidy
localStorage.removeItem('cricket_players_cache')
localStorage.removeItem('REACT_QUERY_OFFLINE_CACHE')

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{
				persister,
				buster: 'v4', // Version bump to safely reset cache format
				maxAge: 1000 * 60 * 60 * 24, // 24 hours
			}}
		>
			<App />
		</PersistQueryClientProvider>
	</StrictMode>,
)
