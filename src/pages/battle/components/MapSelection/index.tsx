import ForEach from '@/components/shared/ForEach';
import { MapInfo } from '../MapInfo';
import styles from './style.module.scss';

export function MapSelection({ maps }: { maps?: MonsterMap[] }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Select a map</h2>
        <span className={styles.subtitle}>Check the monsters and loot before heading out</span>
      </header>

      <div className={styles.mapList}>
        <ForEach items={maps} render={(m) => <MapInfo key={m.id} map={m} />} />
      </div>
    </div>
  );
}
