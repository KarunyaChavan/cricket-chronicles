# Cricket Directory Application

A React + Vite application to browse cricket players, view player details, and filter/sort data with client-side pagination.

## Setup

1. Install dependencies

```bash
npm install
```

2. Configure environment variables in `.env`:

```env
VITE_SPORTMONKS_API_TOKEN=your_token
VITE_SPORTMONKS_BASE_URL=https://api.sportmonks.com/v2.0
VITE_DEFAULT_LANGUAGE=en
```

3. Run development server

```bash
npm run dev
```

## Scripts

- `npm run dev` - Run local development server
- `npm run build` - Build production assets
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run stylelint` - Run Stylelint on CSS
- `npm run lint:all` - Run ESLint + Stylelint
- `npm run format` - Format source files with Prettier
- `npm run format:check` - Verify formatting without modifying files

## Code Quality

- ESLint enforces React, hooks, accessibility, imports, and Prettier rules.
- Stylelint enforces CSS consistency and duplicate selector/property checks.
- `lint-staged` runs ESLint, Stylelint, and Prettier on staged files through the pre-commit hook.

## Notes

- API tokens in frontend apps are visible to end users. For production, proxy external API calls through a backend service.
