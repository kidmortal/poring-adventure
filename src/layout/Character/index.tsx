import { Outlet } from "react-router-dom";

import { useMainStore } from "@/store/main";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/service";
import { Query } from "@/store/query";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { CharacterSummaryHeader } from "@/components/CharacterSummaryHeader";
import { useEffect } from "react";
import { CharacterCreationPage } from "@/pages/characterCreation";
import { ErrorMessage } from "@/components/ErrorMessage";

export function CharacterLayout() {
  const store = useMainStore();

  const characterQuery = useQuery({
    queryKey: [Query.USER_CHARACTER],
    enabled: !!store.loggedUserInfo.email,
    staleTime: 1000 * 2,
    queryFn: () => api.getUserInfo(store.loggedUserInfo.email),
  });

  useEffect(() => {
    if (characterQuery?.data) {
      store.setUserCharacterData(characterQuery?.data);
    }
  }, [characterQuery?.data]);

  if (characterQuery.isLoading) {
    return <FullscreenLoading />;
  }
  if (characterQuery.isError) {
    return <ErrorMessage message={characterQuery.error.message} />;
  }
  if (characterQuery.isFetched && !characterQuery.data) {
    return <CharacterCreationPage />;
  }

  return (
    <>
      <CharacterSummaryHeader />
      <Outlet />
    </>
  );
}
