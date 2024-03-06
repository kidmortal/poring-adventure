import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { useMainStore } from "@/store/main";
import { useAuth } from "@/hooks/useAuth";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { LoginPage } from "@/pages/login";

export function AuthLayout() {
  const location = useLocation();
  // const navigate = useNavigate();
  const store = useMainStore();
  const { isAuthenticated, isFetching, user } = useAuth();

  useEffect(() => {
    if (!isFetching) {
      store.setUserLoggedInfo({
        loggedIn: isAuthenticated,
        // @ts-expect-error idk man, should have it
        accessToken: user?.accessToken,
        email: user?.email || "",
      });
    }
    store.setIsLoading(isFetching);
  }, [isAuthenticated, isFetching]);

  useEffect(() => {
    if (!isAuthenticated) {
      // navigate("/login");
      if (store.loggedUserInfo) {
        store.setUserLoggedInfo({
          loggedIn: false,
          accessToken: "",
          email: "",
        });
      }
    }
  }, [location]);

  if (isFetching) {
    return <FullscreenLoading />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <Outlet />;
}
