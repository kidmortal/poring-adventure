import { Outlet } from 'react-router-dom';

import { useMainStore } from '@/store/main';
import { useQuery } from '@tanstack/react-query';

import { Query } from '@/store/query';
import { FullscreenLoading } from '@/layout/PageLoading/FullscreenLoading';

import { useWebsocketApi } from '@/api/websocketServer';
import styles from './style.module.scss';

import { useUserStore } from '@/store/user';
import { When } from '@/components/shared/When';

export function GuildLayout() {
  const userStore = useUserStore();
  const store = useMainStore();
  const api = useWebsocketApi();

  const guildQuery = useQuery({
    queryKey: [Query.GUILD],
    enabled: !!store.websocket && store.wsAuthenticated,
    staleTime: Infinity,
    queryFn: () => api.guild.getGuild(),
  });

  if (guildQuery.isLoading) {
    return <FullscreenLoading info="Fetching guild info" />;
  }

  const guild = userStore.guild;

  return (
    <div className={styles.container}>
      <When value={!guild}>
        <h1>You have no guild</h1>
      </When>
      <When value={!!guild}>
        <Outlet />
      </When>
    </div>
  );
}
