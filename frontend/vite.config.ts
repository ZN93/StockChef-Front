import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true, // 👈 AJOUTER ÇA
    setupFiles: [
      "./src/test.localStorage.ts",
      "./src/setupTests.ts",
    ],
  },
});
