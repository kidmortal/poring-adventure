import { createRoot } from "react-dom/client";
import "./config/firebase.ts";
import { App } from "./app";

import OneSignal from "onesignal-cordova-plugin";

OneSignal.setAppId("5946ea98-cf28-48f1-9716-10c866cd937d");

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
