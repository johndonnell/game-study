import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'public',
  server: {
    port: 5173, // Vite default port - fresh start for Chrome
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
});
