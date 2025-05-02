// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api/proxy': {
        target: 'https://a.windbornesystems.com',
        changeOrigin: true,
        rewrite: (path) => {
          const hours = path.split('=')[1];
          return `/treasure/${hours}.json`;
        }
      }
    }
  }
})