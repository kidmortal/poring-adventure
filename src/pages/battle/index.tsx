import { FullscreenLoading } from '@/layout/PageLoading/FullscreenLoading';
import styles from './style.module.scss';
import { Query } from '@/store/query';
import { useQueryClient } from '@tanstack/react-query';
import { useBattleStore } from '@/store/battle';
import { MapSelection } from './components/MapSelection';
import { ActiveBattle } from './components/ActiveBattle';
import cn from 'classnames';
import { LoadingBlock } from '@/components/shared/LoadingBlock';

/**
 * Two distinct screens live here: picking a map, and the battle itself.
 * This component only decides which one is on screen.
 */
export function BattlePage() {
  const queryClient = useQueryClient();
  const battleStore = useBattleStore();
  const query = queryClient.getQueryState([Query.BATTLE]);
  const maps = queryClient.getQueryState<MonsterMap[]>([Query.MAPS]);

  if (query?.status === 'pending') {
    return <FullscreenLoading info="Battle info" />;
  }

  const battle = battleStore.battle;
  // Arriving on the page before the map list lands used to render an empty
  // selection screen rather than a wait.
  const mapsPending = !battle && maps?.status !== 'success';

  return (
    <div className={cn(styles.container, { [styles.battlefield]: !!battle })}>
      {mapsPending && <LoadingBlock info="Looking for maps" />}
      {!mapsPending && (battle ? <ActiveBattle battle={battle} /> : <MapSelection maps={maps?.data} />)}
    </div>
  );
}
