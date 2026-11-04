import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [{
    name: 'disable-hosted-hmr-client',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html.replace(/<script[^>]+src=["']\/@vite\/client["'][^>]*><\/script>/g, '')
      },
    },
  }],
  server: {
    host: true,
    allowedHosts: true,
    hmr: {
      protocol: 'wss',
      host: 'localhost',
      clientPort: 443,
    },
  },
  preview: {
    host: true,
    allowedHosts: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
})
