import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
      react(),
      tailwindcss(),
  ],
    server: {
        host: "0.0.0.0", // Allow Glitch to serve the app
        port: 3000,
        proxy: {
            '/api': {
                target: 'https://a4-colinnguyen5.glitch.me',
                changeOrigin: true,
                secure: false
            }
        }
    }
})
