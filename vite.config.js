import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables unconditionally from .env files
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'https://cricket.sportmonks.com/api/v2.0',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy) => {
            // Inject API token cleanly without exposing to frontend
            proxy.on('proxyReq', (proxyReq) => {
              const token = env.SPORTMONKS_API_TOKEN
              if (token) {
                const reqPath = proxyReq.path
                const separator = reqPath.includes('?') ? '&' : '?'
                proxyReq.path = `${reqPath}${separator}api_token=${token}`
              }
            })
          },
        },
      },
    },
  }
})
