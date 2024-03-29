import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  bundledWebRuntime: true,
  appId: "com.kidmortal.poringadventure",
  appName: "Poring Adventure",
  webDir: "dist",
  server:
    process.env.ENV === "development"
      ? {
          url: "http://192.168.0.93:3000",
          cleartext: true,
        }
      : {},
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ["google.com"],
    },
  },
  android: {
    buildOptions: {
      keystorePath: "poringadventure.keystore",
      keystoreAlias: "poringadventure",
      keystoreAliasPassword: "poringadventure",
      keystorePassword: "poringadventure",
      releaseType: "APK",
    },
  },
};

export default config;
