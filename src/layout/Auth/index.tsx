import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useMainStore } from "@/store/main";
import { useAuth } from "@/hooks/useAuth";

export function AuthLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const store = useMainStore();
  const { isAuthenticated, isFetching, user } = useAuth();
  const isOnLoginPage = location.pathname.includes("login");

  useEffect(() => {
    if (!isAuthenticated && !isOnLoginPage) {
      navigate("/login");
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
      store.setIsLoading(isFetching);
      store.setUserLoggedInfo({
        loggedIn: isAuthenticated,
        // @ts-expect-error idk man, should have it
        accessToken: user?.accessToken,
        email: user?.email || "",
      });
      if (isAuthenticated && location.pathname.includes("login")) {
        navigate("/profile");
      }
      if (!isAuthenticated && !location.pathname.includes("login")) {
        navigate("/login");
      }
    }

    store.setIsLoading(isFetching);
  }, [isAuthenticated, isFetching]);

  return <Outlet />;
}
