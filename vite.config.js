import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/governance-studio-V1/',
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' }
  },
  server: {
    port: parseInt(process.env.PORT) || 5173,
  }
})