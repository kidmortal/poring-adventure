import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.kidmortal.poringadventure",
  appName: "Poring Adventure",
  webDir: "dist",
  server: {
    url: "http://192.168.0.93:3000",
    cleartext: true,
  },
  plugins: {
    GoogleAuth: {
      scopes: ["email"],
      serverClientId:
        "596344810334-tbejurdcnnc90h7ctrh2emj1j9pha93s.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
