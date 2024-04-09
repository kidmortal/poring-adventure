import { createRoot } from "react-dom/client";
import "./firebase.ts";
import { App } from "./app";

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
