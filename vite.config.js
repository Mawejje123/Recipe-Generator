import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'  // Explicitly set to 'dist' (Vercel default)
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001', // your local backend
        changeOrigin: true,
        secure: false
      }
    }
  }
})