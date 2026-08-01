import { Query } from '@/store/query';
import styles from './style.module.scss';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { FullscreenLoading } from '@/layout/PageLoading/FullscreenLoading';
import { useMainStore } from '@/store/main';
import { useWebsocketApi } from '@/api/websocketServer';
import { useEffect, useState } from 'react';
import { When } from '@/components/shared/When';
import { TabOption, Tabs } from '@/components/shared/Tabs';
import { PlayersRankingPage } from './players';
import { GuildRankingPage } from './guilds';
import { Pagination } from '@/components/shared/Pagination';

type RankingTab = 'players' | 'guild';

export function RankingPage() {
  const [showing, setShowing] = useState<RankingTab>('players');
  const api = useWebsocketApi();
  const queryClient = useQueryClient();
  const store = useMainStore();
  const query = useQuery({
    queryKey: [Query.ALL_CHARACTERS],
    enabled: !!store.websocket,
    staleTime: 1000 * 10, // 10 seconds
    queryFn: () => api.users.getRankingUsers({ page: store.rankingPage }),
  });

  const queryGuild = useQuery({
    queryKey: [Query.ALL_GUILDS],
    enabled: !!store.websocket,
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: () => api.guild.getAllGuilds(),
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: [Query.ALL_CHARACTERS] });
  }, [store.rankingPage]);

  if (query.isLoading) {
    return <FullscreenLoading info="Player List" />;
  }

  const tabs: TabOption<RankingTab>[] = [
    { value: 'players', label: 'Players' },
    { value: 'guild', label: 'Guilds', badge: queryGuild.data?.length },
  ];

  return (
    <div className={styles.container}>
      <Tabs options={tabs} selected={showing} onSelect={setShowing} />

      {/* Only the list scrolls, so the tabs and the pagination stay in view. */}
      <div className={styles.listPanel}>
        <When value={showing === 'players'}>
          <PlayersRankingPage users={query.data?.users} page={store.rankingPage} />
        </When>
        <When value={showing === 'guild'}>
          <GuildRankingPage guilds={queryGuild.data} />
        </When>
      </div>

      <When value={showing === 'players'}>
        <Pagination
          className={styles.pagination}
          totalCount={query.data?.count ?? 10}
          onPageChange={(p) => {
            store.setRankingPage(p);
          }}
        />
      </When>
    </div>
  );
}
