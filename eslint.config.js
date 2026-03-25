import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import jsdoc from 'eslint-plugin-jsdoc'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettier from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default [
	{
		ignores: ['dist', 'node_modules', 'vite.config.js'],
	},
	{
		files: ['**/*.{js,jsx}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.es2021,
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		plugins: {
			react,
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			'jsx-a11y': jsxA11y,
			import: importPlugin,
			jsdoc,
			prettier,
		},
		settings: {
			react: {
				version: 'detect',
			},
			'import/resolver': {
				node: {
					extensions: ['.js', '.jsx'],
				},
			},
		},
		rules: {
			...js.configs.recommended.rules,
			...react.configs.recommended.rules,
			...react.configs['jsx-runtime'].rules,
			...reactHooks.configs.recommended.rules,
			...jsxA11y.configs.recommended.rules,
			...jsdoc.configs['recommended-error'].rules,

			// Professional & Strict Rules
			'prettier/prettier': [
				'error',
				{
					useTabs: true,
					semi: false,
					singleQuote: true,
					trailingComma: 'all',
					printWidth: 100,
				},
			],
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'no-duplicate-imports': 'error',

			// React Specific
			'react/prop-types': 'off',
			'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

			// JSDoc
			'jsdoc/no-undefined-types': ['error', { definedTypes: ['JSX.Element'] }],
			'jsdoc/require-description': 'warn',
			'jsdoc/require-param-description': 'warn',
			'jsdoc/require-returns-description': 'warn',

			// Import
			'import/order': [
				'error',
				{
					groups: ['builtin', 'external', 'internal', ['sibling', 'parent'], 'index', 'object'],
					'newlines-between': 'always',
					alphabetize: {
						order: 'asc',
						caseInsensitive: true,
					},
				},
			],
		},
	},
	{
		files: ['server.js', 'api/**/*.js'],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
		rules: {
			'no-console': 'off',
		},
	},
	prettierConfig,
]
