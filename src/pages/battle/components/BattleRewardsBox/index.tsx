import ForEach from '@/components/shared/ForEach';
import styles from './style.module.scss';
import { InventoryItem } from '@/components/Items/InventoryItem';
import { SilverStack } from '@/components/StatsComponents/SilverStack';
import { ExpStack } from '@/components/StatsComponents/ExpStack';

type Props = {
  members?: User[];
  drops?: BattleDrop[];
  userLost?: boolean;
};

/** Battle drops are not inventory rows yet, so they are adapted for display. */
function asInventoryItem(drop: BattleUserDropedItem): InventoryItem {
  return {
    item: drop.item,
    id: 0,
    itemId: drop.itemId,
    userEmail: '',
    equipped: false,
    locked: false,
    enhancement: 0,
    quality: 0,
    stack: drop.stack,
  };
}

function DropRow({ drop, name }: { drop: BattleDrop; name: string }) {
  return (
    <div className={styles.dropContainer}>
      <span className={styles.playerName}>{name}</span>
      <div className={styles.rewards}>
        <ExpStack amount={drop.exp} />
        <SilverStack amount={drop.silver} />
      </div>
      <div className={styles.itemRow}>
        <ForEach
          items={drop.dropedItems}
          render={(item) => (
            <InventoryItem key={`${drop.userEmail}-${item.itemId}`} inventoryItem={asInventoryItem(item)} />
          )}
        />
      </div>
    </div>
  );
}

export function BattleRewardBox({ drops, userLost, members }: Props) {
  if (userLost) {
    return <h3 className={styles.defeat}>You lost, Git gud son</h3>;
  }

  const nameByEmail = new Map(members?.map((member) => [member.email, member.name]));

  return (
    <div className={styles.container}>
      <span className={styles.title}>Drops</span>
      <ForEach
        items={drops}
        render={(drop) => <DropRow key={drop.userEmail} drop={drop} name={nameByEmail.get(drop.userEmail) ?? ''} />}
      />
    </div>
  );
}
