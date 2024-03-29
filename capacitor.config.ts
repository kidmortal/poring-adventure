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
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ["google.com"],
    },
  },
};

export default config;
