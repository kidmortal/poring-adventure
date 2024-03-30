import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.kidmortal.poringadventure",
  appName: "Poring Adventure",
  webDir: "dist",
  server: {
    // url: "http://192.168.0.93:3000",
    // cleartext: true,
  },
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
