import { defineConfig } from 'vite';

export default defineConfig({
  // Base path for GitHub Pages deployment
  base: process.env.NODE_ENV === 'production' ? '/game-study/' : '/',
  publicDir: 'public',
  server: {
    host: '0.0.0.0', // Listen on all interfaces (allows 127.0.0.1, localhost, etc.)
    port: 5173, // Vite default port - fresh start for Chrome
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
});
