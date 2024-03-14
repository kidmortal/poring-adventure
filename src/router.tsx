import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./firebase.ts";
import "./styles/global.scss";
import { LimitedSizeLayout } from "./layout/LimitedSize/index.tsx";
import { AuthLayout } from "./layout/Auth/index.tsx";
import { PageLoadingLayout } from "./layout/PageLoading/index.tsx";
import { ProfilePage } from "./pages/profile/index.tsx";
import { CharacterCreationPage } from "./pages/characterCreation/index.tsx";
import { CharacterLayout } from "./layout/Character/index.tsx";
import { RankingPage } from "./pages/ranking/index.tsx";
import { MarketPage } from "./pages/market/index.tsx";
import { ModalLayout } from "./layout/Modal/index.tsx";
import { BattlePage } from "./pages/battle/index.tsx";
import { WebsocketLayout } from "./layout/Websocket/index.tsx";
import AdminSocketManager from "./pages/adminSocketManager/index.tsx";
import { AdminLayout } from "./layout/Admin/index.tsx";

export function Router() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route element={<LimitedSizeLayout />}>
            <Route element={<AuthLayout />}>
              <Route element={<WebsocketLayout />}>
                <Route path="/create" element={<CharacterCreationPage />} />
                <Route element={<PageLoadingLayout />}>
                  <Route element={<CharacterLayout />}>
                    <Route element={<ModalLayout />}>
                      <Route path="/" element={<ProfilePage />} />
                      <Route path="/ranking" element={<RankingPage />} />
                      <Route path="/market" element={<MarketPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/battle" element={<BattlePage />} />
                      <Route element={<AdminLayout />}>
                        <Route path="/admin" element={<AdminSocketManager />} />
                      </Route>
                      <Route path="*" element={<ProfilePage />} />
                    </Route>
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
