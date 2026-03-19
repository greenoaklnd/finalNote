import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // automatically update service worker
      manifest: {
        name: "FinalNote",
        short_name: "FinalNote",
        description: "Offline-first note app",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "icons/192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icons/512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      devOptions: {
        enabled: true, // allow testing PWA in dev mode
      },
    }),
  ],
});