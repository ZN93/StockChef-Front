import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://stockchef-back-production.up.railway.app", // Backend en Railway
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path, // Mantener el path como está
      },
    },
  },
});
