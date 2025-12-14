import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages deployment at: https://lemonsupqt.github.io/Strangersday/
export default defineConfig({
  plugins: [react()],
  base: '/Strangersday/',
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
