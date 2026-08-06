import { defineConfig } from "vite";

export default defineConfig({
  base: "/good/",
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3847",
    },
  },
});
