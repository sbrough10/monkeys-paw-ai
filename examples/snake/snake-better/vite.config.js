import { defineConfig } from 'vite';

// Intentionally cold: no prefetch hints, debug build defaults
export default defineConfig({
  build: {
    minify: false,
    sourcemap: true,
    target: 'es2015',
    cssMinify: false,
  },
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:3847',
    },
  },
});
