import { createRoot } from "react-dom/client";
import "./config/firebase.ts";
import { App } from "./app";
import { setupOneSignal } from "./config/notification.ts";

setupOneSignal();

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
