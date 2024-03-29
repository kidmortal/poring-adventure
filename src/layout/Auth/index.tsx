import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useMainStore } from "@/store/main";
import { useAuth } from "@/hooks/useAuth";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { LoginPage } from "@/pages/login";

export function AuthLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const store = useMainStore();
  const { isAuthenticated, isFetching, user } = useAuth();

  useEffect(() => {
    if (!isFetching) {
      if (isAuthenticated) {
        store.setUserLoggedInfo({
          loggedIn: isAuthenticated,
          // @ts-expect-error idk man, should have it
          accessToken: user?.accessToken,
          email: user?.email || "",
        });
      }
    }
    store.setIsLoading(isFetching);
  }, [isAuthenticated, isFetching]);

  useEffect(() => {
    const loggedIn = store.loggedUserInfo.loggedIn;
    if (loggedIn) {
      // alert("should move to home");
      if (location.pathname.includes("login")) {
        // alert("moving to home");
        navigate("/");
      }
    }
    if (!loggedIn) {
      if (!location.pathname.includes("login")) {
        // alert("moving to login");
        navigate("/login");
      }
      if (store.loggedUserInfo) {
        store.setUserLoggedInfo({
          loggedIn: false,
          accessToken: "",
          email: "",
        });
      }
    }
  }, [store.loggedUserInfo.loggedIn]);

  if (isFetching) {
    return <FullscreenLoading info="Login data" />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <Outlet />;
}
