import { defineConfig } from "vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
    },
  },
  plugins: [
    react(),
    VitePWA({
      devOptions: { enabled: true },
      registerType: "autoUpdate",
      includeAssets: ["favicon.png"],
      manifest: {
        name: "Poring Adventure",
        short_name: "PoringAdventure",
        description: "Poring rpg online",
        theme_color: "#000040",
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "icons/android-launchericon-512-512.png",
            sizes: "512x512",
          },
          {
            src: "icons/android-launchericon-192-192.png",
            sizes: "192x192",
          },
          {
            src: "icons/android-launchericon-144-144.png",
            sizes: "144x144",
          },
          {
            src: "icons/android-launchericon-96-96.png",
            sizes: "96x96",
          },
          {
            src: "icons/android-launchericon-72-72.png",
            sizes: "72x72",
          },
          {
            src: "icons/android-launchericon-48-48.png",
            sizes: "48x48",
          },
        ],
        screenshots: [
          {
            src: "assets/screenshots/1.jpg",
            sizes: "1080x1920",
            type: "image/jpg",
            form_factor: "narrow",
            label: "Homescreen of Awesome App",
          },
          {
            src: "assets/screenshots/2.jpg",
            sizes: "1080x1920",
            type: "image/jpg",
            form_factor: "narrow",
            label: "Homescreen of Awesome App",
          },
          {
            src: "assets/screenshots/3.jpg",
            sizes: "1080x1920",
            type: "image/jpg",
            form_factor: "narrow",
            label: "Homescreen of Awesome App",
          },
          {
            src: "assets/screenshots/4.jpg",
            sizes: "1080x1920",
            type: "image/jpg",
            form_factor: "narrow",
            label: "Homescreen of Awesome App",
          },
          {
            src: "assets/screenshots/5.jpg",
            sizes: "1080x1920",
            type: "image/jpg",
            form_factor: "narrow",
            label: "Homescreen of Awesome App",
          },
          {
            src: "assets/screenshots/6.jpg",
            sizes: "1080x1920",
            type: "image/jpg",
            form_factor: "narrow",
            label: "Homescreen of Awesome App",
          },
          {
            src: "assets/screenshots/7.jpg",
            sizes: "1080x1920",
            type: "image/jpg",
            form_factor: "narrow",
            label: "Homescreen of Awesome App",
          },
        ],
      },
    }),
  ],
});
