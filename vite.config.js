import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get the repo name from package.json or environment
// For GitHub Pages: https://username.github.io/repo-name/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use './' for relative paths - works for GitHub Pages
  base: './',
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate sourcemaps for debugging
    sourcemap: false,
    // Ensure assets use relative paths
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    }
  }
}))
