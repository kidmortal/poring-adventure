import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import ForEach from '@/components/shared/ForEach';
import { LoadingBlock } from '@/components/shared/LoadingBlock';
import { Query } from '@/store/query';
import { useUserStore } from '@/store/user';
import { DungeonInfo } from '../DungeonInfo';
import styles from './style.module.scss';

/**
 * The dungeon half of the battle page. Where a map is somewhere to go back to
 * all afternoon, every card here is a single attempt — so the tab leads with
 * what that costs before it lists anything.
 */
export function DungeonSelection({ dungeons }: { dungeons?: Dungeon[] }) {
  const queryClient = useQueryClient();
  const userStore = useUserStore();
  const status = userStore.dungeonStatus;

  // The entries in the payload are the party's, so somebody joining or leaving
  // changes who can hold the run up. Nothing on the server pushes on a party
  // change, so the tab asks again rather than showing a stale blocker list.
  const partyKey = (userStore.party?.members ?? []).map((member) => member.email).join('|');
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: [Query.DUNGEON_STATUS] });
  }, [partyKey, queryClient]);

  if (!dungeons) {
    return <LoadingBlock info="Looking for dungeons" />;
  }

  const run = status?.run;
  const entries = status?.entries ?? [];
  // The one the party is inside comes first — it is the only card on the tab
  // they can act on until the run is settled.
  const ordered = [...dungeons].sort((a, b) => {
    if (run?.dungeonId === a.id) return -1;
    if (run?.dungeonId === b.id) return 1;
    return a.sortOrder - b.sortOrder;
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Dungeons</h2>
        <span className={styles.subtitle}>
          Three bosses back to back, one entry a day. Wipe and the day is spent.
        </span>
      </header>

      {dungeons.length === 0 && <span className={styles.empty}>No dungeons are open yet.</span>}

      <div className={styles.dungeonList}>
        <ForEach
          items={ordered}
          render={(dungeon) => (
            <DungeonInfo key={dungeon.id} dungeon={dungeon} entries={entries} run={run} />
          )}
        />
      </div>
    </div>
  );
}
