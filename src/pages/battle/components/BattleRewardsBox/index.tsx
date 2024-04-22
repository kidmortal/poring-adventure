import ForEach from '@/components/shared/ForEach';
import styles from './style.module.scss';
import { InventoryItem } from '@/components/Items/InventoryItem';
import { SilverStack } from '@/components/StatsComponents/SilverStack';
import { ExpStack } from '@/components/StatsComponents/ExpStack';
import { Tooltip } from '@/components/shared/Tooltip';

type Props = {
  members?: User[];
  drops?: BattleDrop[];
  userLost?: boolean;
};

export function BattleRewardBox({ drops, userLost, members }: Props) {
  if (userLost) {
    return <h3>You lost, Git gud son</h3>;
  }

  return (
    <div className={styles.container}>
      <span>Drops</span>
      <ForEach
        items={drops}
        render={(drop) => {
          let username = '';
          if (members) {
            const user = members.find((member) => member.email === drop.userEmail);
            username = user?.name ?? '';
          }
          const items = drop?.dropedItems;
          return (
            <div key={drop.userEmail} className={styles.dropContainer}>
              <span>{username}</span>
              <Tooltip text="Experience">
                <ExpStack amount={drop?.exp} />
              </Tooltip>
              <SilverStack amount={drop?.silver} />
              <RenderDropedItems items={items} email={drop.userEmail} />
            </div>
          );
        }}
      />
    </div>
  );
}

function RenderDropedItems({ items, email }: { email: string; items: BattleUserDropedItem[] }) {
  return (
    <ForEach
      items={items}
      render={({ item, itemId, stack }) => (
        <InventoryItem
          key={`${email}-${item.id}`}
          inventoryItem={{
            item: item,
            id: 0,
            itemId: itemId,
            userEmail: '',
            stack: stack,
          }}
        />
      )}
    />
  );
}
