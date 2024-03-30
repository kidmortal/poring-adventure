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
  const loggedIn = store.loggedUserInfo.loggedIn;

  useEffect(() => {
    if (!isFetching) {
      if (isAuthenticated) {
        store.setUserLoggedInfo({
          loggedIn: isAuthenticated,
          accessToken: user?.accessToken || "",
          email: user?.email || "",
        });
      }
    }
    store.setIsLoading(isFetching);
  }, [isAuthenticated, isFetching]);

  useEffect(() => {
    if (loggedIn) {
      // alert("should move to home");
      if (location.pathname.includes("login")) {
        // alert("moving to home");
        navigate("profile");
      }
    }
    if (!loggedIn) {
      if (!location.pathname.includes("login")) {
        // alert("moving to login");
        navigate("login");
      }
      if (store.loggedUserInfo) {
        store.setUserLoggedInfo({
          loggedIn: false,
          accessToken: "",
          email: "",
        });
      }
    }
  }, [loggedIn]);

  if (isFetching) {
    return <FullscreenLoading info="Login data" />;
  }
  if (loggedIn) {
    return <Outlet />;
  }

  return <LoginPage />;
}
