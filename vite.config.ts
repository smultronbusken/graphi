import { defineConfig } from "vite";
import path from "path"
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    open: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'ES2024', 
  },
});
