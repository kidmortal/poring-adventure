import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.kidmortal.poringadventure",
  appName: "Poring Adventure",
  webDir: "dist",
  server: {
    url: "http://192.168.1.93:3000",
    cleartext: true,
  },
};

export default config;
