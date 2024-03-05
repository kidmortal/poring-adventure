import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useMainStore } from "@/store/main";
import { useAuth } from "@/hooks/useAuth";

export function AuthLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const store = useMainStore();
  const { isAuthenticated, isFetching, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !location.pathname.includes("login")) {
      navigate("/login");
      if (store.userCharacter) {
        store.setUserCharacter(undefined);
      }
      if (store.loggedUserInfo) {
        store.setUserLoggedInfo({
          loggedIn: false,
          accessToken: "",
          email: "",
        });
      }
    }
  }, [location]);

  useEffect(() => {
    if (!isFetching) {
      store.setIsLoading({ application: isFetching });
      store.setUserLoggedInfo({
        loggedIn: isAuthenticated,
        // @ts-expect-error idk man, should have it
        accessToken: user?.accessToken,
        email: user?.email || "",
      });
      if (isAuthenticated && location.pathname.includes("login")) {
        navigate("/");
      }
      if (!isAuthenticated && !location.pathname.includes("login")) {
        navigate("/login");
      }
    }

    store.setIsLoading({ application: isFetching });
  }, [isAuthenticated, isFetching]);

  return <Outlet />;
}
