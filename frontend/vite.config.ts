import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false,
      includeAssets: [
        'favicon.svg',
        'app-icon.svg',
        'app-icon-maskable.svg',
      ],
      devOptions: {
        enabled: false,
      },
    }),
  ],

  server: {
    proxy: {
      '/api': {
        target: 'http:' + '//localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
