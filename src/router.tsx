import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./firebase.ts";
import "./styles/global.scss";
import { HomePage } from "./pages/home/index.tsx";
import { LimitedSizeLayout } from "./layout/LimitedSize/index.tsx";
import { LoginPage } from "./pages/login/index.tsx";
import { AuthLayout } from "./layout/Auth/index.tsx";
import { PageLoadingLayout } from "./layout/PageLoading/index.tsx";
import { ProfilePage } from "./pages/profile/index.tsx";
import { CharacterCreationPage } from "./pages/characterCreation/index.tsx";
import { CharacterLayout } from "./layout/Character/index.tsx";
import { RankingPage } from "./pages/ranking/index.tsx";
import { MarketPage } from "./pages/market/index.tsx";
import { NavigationLayout } from "./layout/Navigation/index.tsx";

export function Router() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route element={<LimitedSizeLayout />}>
            <Route element={<NavigationLayout />}>
              <Route element={<AuthLayout />}>
                <Route element={<PageLoadingLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/ranking" element={<RankingPage />} />
                  <Route path="/market" element={<MarketPage />} />
                  <Route element={<CharacterLayout />}>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/create" element={<CharacterCreationPage />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
  );
}
