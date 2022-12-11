import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'

export default defineConfig({
  plugins: [
    react(),
    !process.env.DISABLE_ESLINT
      ? eslint({ include: ['src/**/*.{ts,tsx}'] })
      : null
  ],
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    host: true
  }
})
