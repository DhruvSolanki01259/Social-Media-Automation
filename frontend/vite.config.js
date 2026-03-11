import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // server: {
  //   port: 5173, // Vite dev server
  //   proxy: {
  //     // All requests starting with /api go to backend
  //     "/api": {
  //       target: "http://localhost:8000",
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
});