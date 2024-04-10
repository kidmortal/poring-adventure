import OneSignal from "onesignal-cordova-plugin";
import { Capacitor } from "@capacitor/core";

export function setupOneSignal() {
  const plataform = Capacitor.getPlatform();

  if (plataform === "android") {
    OneSignal.setAppId("5946ea98-cf28-48f1-9716-10c866cd937d");
  }
}
