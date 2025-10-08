import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use base for GitHub Pages only in production if GH_PAGES is set
  base: process.env.GH_PAGES === 'true' ? "/anas-haloul-website/" : "/",
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:5174",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:5174",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
