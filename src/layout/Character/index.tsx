import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useMainStore } from "@/store/main";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/service";
import { Query } from "@/store/query";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { useEffect } from "react";

export function CharacterLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const store = useMainStore();
  const isOnCreatePage = location.pathname.includes("create");

  const characterQuery = useQuery({
    queryKey: [Query.USER_CHARACTER],
    enabled: !!store.loggedUserInfo.email,
    staleTime: 1000 * 2,
    queryFn: () => api.getUserInfo(store.loggedUserInfo.email),
  });

  useEffect(() => {
    if (!isOnCreatePage && !characterQuery.data) {
      navigate("/create");
    }
  }, [location]);

  if (characterQuery.isLoading) {
    return <FullscreenLoading />;
  }
  if (characterQuery.data && isOnCreatePage) {
    console.log("go profile");
    navigate("/profile");
  }

  if (characterQuery.isFetched && !characterQuery.data && !isOnCreatePage) {
    console.log("go create");
    navigate("/create");
  }

  return <Outlet />;
}
