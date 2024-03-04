import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./firebase.ts";
import "./styles/global.scss";
import { HomePage } from "./pages/home/index.tsx";
import { LimitedSizeLayout } from "./layout/LimitedSize/index.tsx";
import { LoginPage } from "./pages/login/index.tsx";
import { AuthLayout } from "./layout/Auth/index.tsx";

const router = (
  <BrowserRouter>
    <Routes>
      <Route element={<LimitedSizeLayout />}>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>{router}</React.StrictMode>
);
