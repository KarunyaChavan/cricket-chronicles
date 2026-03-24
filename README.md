# Cricket Chronicles

A modern, high-performance web application designed to explore the world of cricket through detailed player profiles, aggregated career statistics, and a secure, mobile-first experience.

## Product Overview

**Cricket Chronicles** provides a seamless interface for fans, analysts, and scouts to discover and deep-dive into player data. Whether you're tracking international stars or emerging talent, the app offers a premium browsing experience.

### Key Features (User Experience)
- **Global Player Directory**: Explore a comprehensive database of players from teams worldwide.
- **Performance Insights**: Instant access to detailed batting and bowling statistics categorized by format (ODI, T20, Test).
- **Intelligent Search & Filtering**: Rapidly find players by name, country, position, or team with zero-latency client-side interaction.
- **Premium Mobile-First Design**: A stunning, responsive interface featuring glassmorphism, smooth transitions, and high-legibility typography optimized for any device.

---

## Technical Architecture

For developers and engineers, this project demonstrates a modern frontend stack with a strong focus on **Security**, **Maintainability**, and **Performance**.

### 1. BFF (Backend-For-Frontend) Proxy
For production-grade security, we implement a **BFF Architecture** using Express.js. This prevents the `SPORTMONKS_API_TOKEN` from being exposed in client-side bundles. The server acts as a secure middleware that injects the required tokens server-side.


### 2. Client-Side Pagination & Data Hydration
Due to upstream API restrictions on bulk pagination flexibility, the application operates strictly on a **client-side pagination** and filtering model. We fetch a heavily optimized payload of the core player demographic, natively map it to discard heavy irrelevant JSON nodes, and perform the matrix filtering and index slicing locally via React Hooks. This guarantees absolute zero-latency text searching and faceted filtering without risking remote network timeouts or IndexedDB overflow limits.

### 3. Core Tech Stack
- **Frontend**: React + Vite + i18next (Internationalization)
- **Server**: Express.js + http-proxy-middleware
- **API**: Sportmonks Cricket API

---

## Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Configuration
Create a `.env` file in the root directory:
```env
# sportmonks.com API Token (Server-side ONLY)
SPORTMONKS_API_TOKEN=your_token_here
SPORTMONKS_BASE_URL=https://cricket.sportmonks.com/api/v2.0
DEFAULT_LANGUAGE=en
PORT=3000
```

### 3. Development
Run the development server with secure local proxying:
```bash
npm run dev
```

### 4. Production
Build and serve the production bundle through the BFF server:
```bash
npm run build
node server.js
```

---