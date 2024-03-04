import * as ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./firebase.ts";
import "./styles/global.scss";
import { HomePage } from "./pages/home/index.tsx";
import { LimitedSizeLayout } from "./layout/LimitedSize/index.tsx";
import { LoginPage } from "./pages/login/index.tsx";
import { AuthLayout } from "./layout/Auth/index.tsx";
import { PageLoadingLayout } from "./layout/PageLoading/index.tsx";

const router = (
  <BrowserRouter>
    <Routes>
      <Route element={<LimitedSizeLayout />}>
        <Route element={<AuthLayout />}>
          <Route element={<PageLoadingLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById("root")!).render(router);
