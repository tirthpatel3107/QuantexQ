import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import history from "connect-history-api-fallback";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  appType: "spa",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    {
      name: "history-fallback",
      configureServer(server) {
        server.middlewares.use(history());
      },
      configurePreviewServer(server) {
        server.middlewares.use(history());
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    minify: "esbuild",
  },
}));
