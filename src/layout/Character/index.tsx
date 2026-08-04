import { Outlet } from 'react-router-dom';

import { useMainStore } from '@/store/main';
import { useQuery } from '@tanstack/react-query';

import { Query } from '@/store/query';
import { FullscreenLoading } from '@/layout/PageLoading/FullscreenLoading';
import { CharacterSummaryHeader } from '@/components/Character/CharacterSummaryHeader';
import { CharacterCreationPage } from '@/pages/characterCreation';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useWebsocketApi } from '@/api/websocketServer';
import styles from './style.module.scss';
import { BottomNavBar } from '@/layout/LimitedSize/BottomNavBar';
import { useUserStore } from '@/store/user';

export function CharacterLayout() {
  const userStore = useUserStore();
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
    enabled: !!store.websocket && !!store.wsAuthenticated,
    staleTime: 1000 * 60, // 60 seconds
    queryFn: () => api.battle.getBattleInstance(),
  });

  useQuery({
    queryKey: [Query.MAPS],
    enabled: !!store.websocket && !!store.wsAuthenticated,
    staleTime: 1000 * 60, // 60 seconds
    queryFn: () => api.monsters.getAllMaps(),
  });

  // The dungeon list is content and barely moves; the run and the party's
  // entries do, so they are written to the store here and refreshed from the
  // `dungeon_status` push whenever the server changes either.
  useQuery({
    queryKey: [Query.DUNGEONS],
    enabled: !!store.websocket && !!store.wsAuthenticated,
    staleTime: 1000 * 60 * 10, // 10 minutes
    queryFn: () => api.dungeons.getAllDungeons(),
  });

  useQuery({
    queryKey: [Query.DUNGEON_STATUS],
    enabled: !!store.websocket && !!store.wsAuthenticated,
    staleTime: 1000 * 60, // 60 seconds
    queryFn: async () => {
      const status = await api.dungeons.getDungeonStatus();
      userStore.setDungeonStatus(status);
      return status ?? null;
    },
  });

  // Mail arrives over the `mailbox` push the request triggers; notifications
  // come back inline, so they are written to the store here.
  useQuery({
    queryKey: [Query.MAILBOX],
    enabled: !!store.websocket && !!store.wsAuthenticated,
    staleTime: 1000 * 60 * 10, // 10 minutes
    queryFn: () => api.mail.getAllMail(),
  });

  useQuery({
    queryKey: [Query.NOTIFICATIONS],
    enabled: !!store.websocket && !!store.wsAuthenticated,
    staleTime: 1000 * 60 * 10, // 10 minutes
    queryFn: async () => {
      const notifications = await api.mail.getAllNotifications();
      userStore.setNotifications(notifications ?? []);
      return notifications ?? [];
    },
  });

  if (characterQuery.isLoading) {
    return <FullscreenLoading info="Fetching character info" />;
  }
  if (characterQuery.isError) {
    return <ErrorMessage message={characterQuery.error.message} />;
  }
  if (characterQuery.isFetched && !userStore.user?.id) {
    return <CharacterCreationPage />;
  }

  if (!userStore.user?.id) {
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
