import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['@prisma/client']
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://estate-app-w2y3.onrender.com', // thay port phù hợp
        changeOrigin: true
      }
    }
  }
})