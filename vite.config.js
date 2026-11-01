import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  server: {
    allowedHosts: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
})
