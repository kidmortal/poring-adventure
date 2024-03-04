import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useMainStore } from "../../store/main";
import { useAuth } from "../../hooks/useAuth";

export function AuthLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const store = useMainStore();
  const { isAuthenticated, isFetching } = useAuth();

  useEffect(() => {
    if (!isFetching) {
      store.setUserLoggedIn(isAuthenticated);
      store.setIsLoading(isFetching);
      if (isAuthenticated && location.pathname.includes("login")) {
        navigate("/home");
      }
      if (!isAuthenticated && !location.pathname.includes("login")) {
        navigate("/login");
      }
    }

    store.setIsLoading(isFetching);
  }, [isAuthenticated, isFetching]);

  return (
    <div>
      <h1>Auth layer</h1>
      <Outlet />
    </div>
  );
}
