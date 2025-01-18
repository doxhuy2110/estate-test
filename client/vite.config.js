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
    historyApiFallback: true,  // Thêm dòng này
    proxy: {
      '/api': {
        target: 'https://estate-eahn340qf-doxhuy2104s-projects.vercel.app/',
        changeOrigin: true
      }
    }
  }
})