import { Outlet } from "react-router-dom";

import { useMainStore } from "@/store/main";
import { useQuery } from "@tanstack/react-query";

import { Query } from "@/store/query";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { CharacterSummaryHeader } from "@/components/CharacterSummaryHeader";
import { useEffect } from "react";
import { CharacterCreationPage } from "@/pages/characterCreation";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useWebsocketApi } from "@/api/websocketServer";
import styles from "./style.module.scss";
import { BottomNavBar } from "@/components/BottomNavBar";

export function CharacterLayout() {
  const store = useMainStore();
  const api = useWebsocketApi();

  const characterQuery = useQuery({
    queryKey: [Query.USER_CHARACTER],
    enabled: !!store.websocket && store.wsAuthenticated,
    staleTime: Infinity,
    queryFn: () => api.users.getUser(),
  });
  useQuery({
    queryKey: [Query.BATTLE],
    enabled: !!store.websocket && !!store.loggedUserInfo.accessToken,
    staleTime: 1000 * 60, // 60 seconds
    queryFn: () => api.battle.getBattleInstance(),
  });

  useQuery({
    queryKey: [Query.MAPS],
    enabled: !!store.websocket && !!store.loggedUserInfo.accessToken,
    staleTime: 1000 * 60, // 60 seconds
    queryFn: () => api.monsters.getAllMaps(),
  });

  useQuery({
    queryKey: [Query.NOTIFICATIONS],
    enabled: !!store.websocket && !!store.loggedUserInfo.accessToken,
    staleTime: 1000 * 60 * 10, // 10 minutes
    queryFn: () => api.mail.getAllMail(),
  });

  useEffect(() => {
    if (characterQuery?.data) {
      store.setUserCharacterData(characterQuery?.data);
    }
  }, [characterQuery?.data]);

  if (characterQuery.isLoading) {
    return <FullscreenLoading info="Fetching character info" />;
  }
  if (characterQuery.isError) {
    return <ErrorMessage message={characterQuery.error.message} />;
  }
  if (characterQuery.isFetched && !characterQuery.data) {
    return <CharacterCreationPage />;
  }
  if (!store.userCharacterData?.id) {
    return <FullscreenLoading info="Fetching character info" />;
  }

  return (
    <div className={styles.container}>
      <CharacterSummaryHeader />
      <div className={styles.centerPageContainer}>
        <Outlet />
      </div>
      <BottomNavBar />
    </div>
  );
}
