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

  useQuery({
    queryKey: [Query.NOTIFICATIONS],
    enabled: !!store.websocket && !!store.wsAuthenticated,
    staleTime: 1000 * 60 * 10, // 10 minutes
    queryFn: () => api.mail.getAllMail(),
  });

  if (characterQuery.isLoading) {
    return <FullscreenLoading info="Fetching character info" />;
  }
  if (characterQuery.isError) {
    return <ErrorMessage message={characterQuery.error.message} />;
  }
  if (characterQuery.isFetched && !characterQuery.data) {
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
