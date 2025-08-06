import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/client/', // Critical for Vercel
  plugins: [react()],
  build: {
    outDir: '../dist', // Build outside client folder
    emptyOutDir: true
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.apify.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/v2'),
      }
    }
  }
})