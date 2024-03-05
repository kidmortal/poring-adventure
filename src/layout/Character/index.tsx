import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useMainStore } from "@/store/main";

export function CharacterLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const store = useMainStore();
  const isOnCreatePage = location.pathname.includes("create");

  useEffect(() => {
    if (store.loggedUserInfo.email) {
      store.setIsLoading({ application: true });
      store
        .fetchUserCharacter()
        .then((success) => {
          if (success && isOnCreatePage) {
            navigate("/profile");
          }
          if (!success) {
            navigate("/create");
          }
        })
        .finally(() => {
          store.setIsLoading({ application: false });
        });
    }
  }, [store.loggedUserInfo.email]);

  useEffect(() => {
    if (store.userCharacter && isOnCreatePage) {
      navigate("/profile");
    }
  }, [store.userCharacter]);

  return <Outlet />;
}
