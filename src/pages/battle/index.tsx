import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import cn from 'classnames';

import { FullscreenLoading } from '@/layout/PageLoading/FullscreenLoading';
import styles from './style.module.scss';
import { Query } from '@/store/query';
import { useBattleStore } from '@/store/battle';
import { useUserStore } from '@/store/user';
import { MapSelection } from './components/MapSelection';
import { DungeonSelection } from './components/DungeonSelection';
import { ActiveBattle } from './components/ActiveBattle';
import { LoadingBlock } from '@/components/shared/LoadingBlock';
import { TabOption, Tabs } from '@/components/shared/Tabs';

type HuntTab = 'maps' | 'dungeons';

/**
 * Two distinct screens live here: choosing where to fight, and the battle
 * itself. This component only decides which one is on screen — and, when it is
 * the choosing screen, which half of it.
 */
export function BattlePage() {
  const queryClient = useQueryClient();
  const battleStore = useBattleStore();
  const userStore = useUserStore();
  const query = queryClient.getQueryState([Query.BATTLE]);
  const maps = queryClient.getQueryState<MonsterMap[]>([Query.MAPS]);
  const dungeons = queryClient.getQueryState<Dungeon[]>([Query.DUNGEONS]);

  const [showing, setShowing] = useState<HuntTab>('maps');

  const battle = battleStore.battle;
  const run = userStore.dungeonStatus?.run;
  const { cameFromDungeon, setCameFromDungeon } = battleStore;

  // Coming out of a dungeon fight lands on the dungeon tab, whether the run is
  // still standing or the party just lost it — the map list is not where that
  // news belongs.
  useEffect(() => {
    if (!battle && (run || cameFromDungeon)) {
      setShowing('dungeons');
      if (cameFromDungeon) setCameFromDungeon(false);
    }
  }, [battle, run, cameFromDungeon, setCameFromDungeon]);

  if (query?.status === 'pending') {
    return <FullscreenLoading info="Battle info" />;
  }

  // Arriving on the page before the map list lands used to render an empty
  // selection screen rather than a wait.
  const mapsPending = !battle && showing === 'maps' && maps?.status !== 'success';

  const tabs: TabOption<HuntTab>[] = [
    { value: 'maps', label: 'Maps' },
    { value: 'dungeons', label: 'Dungeons' },
  ];

  if (battle) {
    return (
      <div className={cn(styles.container, styles.battlefield)}>
        <ActiveBattle battle={battle} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Tabs options={tabs} selected={showing} onSelect={setShowing} />
      {mapsPending && <LoadingBlock info="Looking for maps" />}
      {!mapsPending && showing === 'maps' && <MapSelection maps={maps?.data} />}
      {showing === 'dungeons' && <DungeonSelection dungeons={dungeons?.data} />}
    </div>
  );
}
