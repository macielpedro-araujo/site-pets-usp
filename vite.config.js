import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Pasta onde o site fica publicado. Padrão: raiz ("/"), como no Vercel.
  // No GitHub Pages o workflow usa BASE_PATH=/site-cepetusp/
  base: process.env.BASE_PATH || '/',
})
