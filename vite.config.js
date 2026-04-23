import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://chun-cheng-liu-project3.onrender.com/',
        changeOrigin: true,
      }
    }
  }
})