import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

import { Button } from '@/components/shared/Button';
import styles from './style.module.scss';
import { useMutation } from '@tanstack/react-query';
import { useWebsocketApi } from '@/api/websocketServer';
import ForEach from '@/components/shared/ForEach';
import { MonsterChip } from '@/components/Monsters/MonsterChip';
import { levelRange } from '@/components/Monsters/MonsterChip/levelRange';
import cn from 'classnames';
import { useModalStore } from '@/store/modal';

type Props = {
  map: MonsterMap;
};

/**
 * Roughly what fits on one line at the card's width. The grid is auto-filled,
 * so the real number is whatever the browser worked out — this only decides
 * whether collapsing is worth doing at all, and being a slot out either way
 * costs nothing.
 */
const DROPS_PER_ROW = 6;

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

function DropSlot({ drop, onClick }: { drop: MapDrop; onClick: () => void }) {
  return (
    <button type="button" className={styles.dropSlot} title={drop.item.name} onClick={onClick}>
      <img src={drop.item.image} alt={drop.item.name} />
      <span className={styles.dropChance}>{drop.chance}%</span>
    </button>
  );
}

export function MapInfo({ map }: Props) {
  const api = useWebsocketApi();
  const modalStore = useModalStore();
  const createBattleMutation = useMutation({
    mutationFn: (mapId: number) => api.battle.createBattleInstance(mapId),
  });

  const [showAllDrops, setShowAllDrops] = useState(false);

  const drops = getDropsFromMonsters(map.monster);
  const hasBoss = map.monster.some((monster) => monster.boss);
  const collapsible = drops.length > DROPS_PER_ROW;

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
          {/* Both grids open a details sheet, so a map can be sized up without
              entering it. */}
          <ForEach
            items={map.monster}
            render={(monster) => (
              <MonsterChip
                key={monster.id}
                monster={monster}
                onClick={() => modalStore.setMonsterInfo({ open: true, monster })}
              />
            )}
          />
        </div>
      </section>

      {/* Twenty drops is four rows of icons under every map on the list, which
          buried the maps themselves. The first row stands, fading out at the
          bottom to say there is more, and the arrow brings the rest. */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTitle}>Possible drops</span>
          {collapsible && (
            <button
              type="button"
              className={styles.reveal}
              onClick={() => setShowAllDrops(!showAllDrops)}
              aria-expanded={showAllDrops}
            >
              <span>{showAllDrops ? 'Less' : `All ${drops.length}`}</span>
              <FaChevronDown className={cn(styles.chevron, { [styles.chevronOpen]: showAllDrops })} />
            </button>
          )}
        </div>
        <div className={cn(styles.dropGrid, { [styles.dropGridCollapsed]: collapsible && !showAllDrops })}>
          <ForEach
            items={drops}
            render={(drop) => (
              <DropSlot
                key={drop.item.id}
                drop={drop}
                onClick={() => modalStore.setItemInfo({ open: true, item: drop.item })}
              />
            )}
          />
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
