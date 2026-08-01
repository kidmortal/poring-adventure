import { Button } from '@/components/shared/Button';
import styles from './style.module.scss';
import { useMutation } from '@tanstack/react-query';
import { useWebsocketApi } from '@/api/websocketServer';
import ForEach from '@/components/shared/ForEach';
import { MonsterChip } from '@/components/Monsters/MonsterChip';
import { levelRange } from '@/components/Monsters/MonsterChip/levelRange';
import cn from 'classnames';

type Props = {
  map: MonsterMap;
};

type MapDrop = {
  item: Item;
  /** Best chance across every monster on the map that drops it. */
  chance: number;
};

/** One entry per item, keeping the best drop chance available on the map. */
function getDropsFromMonsters(monsters: Monster[]): MapDrop[] {
  const dropsByItem: Record<number, MapDrop> = {};

  monsters.forEach((monster) =>
    monster.drops.forEach((drop) => {
      const existing = dropsByItem[drop.itemId];
      if (!existing || drop.chance > existing.chance) {
        dropsByItem[drop.itemId] = { item: drop.item, chance: drop.chance };
      }
    }),
  );

  return Object.values(dropsByItem).sort((a, b) => b.chance - a.chance);
}

function DropSlot({ drop }: { drop: MapDrop }) {
  return (
    <div className={styles.dropSlot} title={drop.item.name}>
      <img src={drop.item.image} alt={drop.item.name} />
      <span className={styles.dropChance}>{drop.chance}%</span>
    </div>
  );
}

export function MapInfo({ map }: Props) {
  const api = useWebsocketApi();
  const createBattleMutation = useMutation({
    mutationFn: (mapId: number) => api.battle.createBattleInstance(mapId),
  });

  const drops = getDropsFromMonsters(map.monster);
  const hasBoss = map.monster.some((monster) => monster.boss);

  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <h3 className={styles.mapName}>{map.name}</h3>
        <div className={styles.badges}>
          {hasBoss && <span className={cn(styles.badge, styles.bossBadge)}>Boss</span>}
          <span className={styles.badge}>{levelRange(map.monster)}</span>
        </div>
      </header>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>Monsters</span>
        <div className={styles.monsterGrid}>
          <ForEach items={map.monster} render={(monster) => <MonsterChip key={monster.id} monster={monster} />} />
        </div>
      </section>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>Possible drops</span>
        <div className={styles.dropGrid}>
          <ForEach items={drops} render={(drop) => <DropSlot key={drop.item.id} drop={drop} />} />
        </div>
      </section>

      <Button
        label={createBattleMutation.isPending ? 'Entering…' : 'Enter'}
        onClick={() => createBattleMutation.mutate(map.id)}
        disabled={createBattleMutation.isPending}
      />
    </article>
  );
}
