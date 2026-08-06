import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// builds the loading screen that loads the loading screen
export default defineConfig({
  plugins: [react()],
  build: {
    minify: false,
    sourcemap: true,
    target: 'es2015',
    cssMinify: false,
  },
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:3848',
    },
  },
});
