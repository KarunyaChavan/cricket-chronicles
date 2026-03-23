import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import { config } from '../config'
import enTranslation from './locales/en/translation.json'

i18n
	// detect user language
	.use(LanguageDetector)
	// pass the i18n instance to react-i18next.
	.use(initReactI18next)
	// init i18next
	.init({
		resources: {
			en: {
				translation: enTranslation,
			},
		},
		fallbackLng: config.app.defaultLanguage,
		debug: import.meta.env.MODE === 'development',
		interpolation: {
			escapeValue: false, // react already safes from xss
		},
	})

export default i18n
