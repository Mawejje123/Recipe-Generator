// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // Everything that starts with /api should go to the backend
      '/api': {
        target: 'http://127.0.0.1:3001',     // ← This is the most important change!
        changeOrigin: true,
        secure: false,
        // Optional: if you want to remove /api prefix (not needed in your case)
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})