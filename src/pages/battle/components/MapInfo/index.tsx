import { Button } from '@/components/shared/Button';
import styles from './style.module.scss';
import { useMutation } from '@tanstack/react-query';
import { useWebsocketApi } from '@/api/websocketServer';
import ForEach from '@/components/shared/ForEach';

type Props = {
  map: MonsterMap;
};

function getDropsFromMonsters(monsters: Monster[]) {
  const itemMaps: { [id: number]: Item } = {};
  monsters.forEach((monster) => monster.drops.forEach((drop) => (itemMaps[drop.itemId] = drop.item)));

  const itemsArray = Object.values(itemMaps);

  return itemsArray;
}

export default function MapInfo({ map }: Props) {
  const api = useWebsocketApi();
  const createBattleMutation = useMutation({
    mutationFn: (mapId: number) => api.battle.createBattleInstance(mapId),
  });
  const drops = getDropsFromMonsters(map.monster);

  return (
    <Button
      key={map.id}
      className={styles.container}
      label={
        <div className={styles.mapInfoColumn}>
          <h3>{map.name}</h3>
          <div className={styles.monstersRow}>
            <ForEach items={map.monster} render={(m) => <img key={m.id} width={40} height={40} src={m.image} />} />
          </div>
          <div className={styles.monstersRow}>
            <ForEach items={drops} render={(drop) => <img key={drop.id} width={40} height={40} src={drop.image} />} />
          </div>
        </div>
      }
      onClick={() => createBattleMutation.mutate(map.id)}
      disabled={createBattleMutation.isPending}
    />
  );
}
