import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useMainStore } from "@/store/main";

export function CharacterLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const store = useMainStore();
  const isOnCreatePage = location.pathname.includes("create");

  async function fetchCharacter() {
    if (!store.isLoading) {
      if (store.loggedUserInfo.email) {
        const success = await store.fetchUserCharacter();
        if (success && isOnCreatePage) {
          navigate("/profile");
        }
        if (!success) {
          navigate("/create");
        }
      }
    }
  }

  useEffect(() => {
    fetchCharacter();
  }, []);

  useEffect(() => {
    if (store.userCharacter && isOnCreatePage) {
      navigate("/profile");
    }
  }, [store.userCharacter]);

  return <Outlet />;
}
