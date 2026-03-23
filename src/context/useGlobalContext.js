import { createContext, useContext } from 'react'

export const GlobalContext = createContext()

/**
 * Custom hook to access the global application state
 * @returns {object} The global context value
 */
export const useGlobalContext = () => useContext(GlobalContext)
