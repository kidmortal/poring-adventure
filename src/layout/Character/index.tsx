import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useMainStore } from "@/store/main";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/service";
import { Query } from "@/store/query";
import { FullscreenLoading } from "@/components/FullscreenLoading";

export function CharacterLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const store = useMainStore();
  const isOnCreatePage = location.pathname.includes("create");

  useQuery({
    queryKey: [Query.ALL_CHARACTERS],
    staleTime: 1000 * 10,
    queryFn: () => api.getFirst10Users(),
  });

  const characterQuery = useQuery({
    queryKey: [Query.USER_CHARACTER],
    enabled: !!store.loggedUserInfo.email,
    staleTime: 1000 * 10,
    queryFn: () => api.getUserInfo(store.loggedUserInfo.email),
  });

  if (characterQuery.isLoading) {
    return <FullscreenLoading />;
  }

  if (characterQuery.isFetched && !characterQuery.data && !isOnCreatePage) {
    console.log("go create");
    navigate("/create");
  }

  if (characterQuery.data && isOnCreatePage) {
    console.log("go profile");
    navigate("/profile");
  }

  return <Outlet />;
}
