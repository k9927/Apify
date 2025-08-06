import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // Changed from '/client/' to '/'
  plugins: [react()],
  build: {
    outDir: '../dist', // Now builds inside client folder
    emptyOutDir: true,
    assetsDir: 'assets'
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