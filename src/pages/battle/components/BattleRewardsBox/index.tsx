import ForEach from "@/components/ForEach";
import styles from "./style.module.scss";
import { InventoryItem } from "@/components/InventoryItem";
import { Silver } from "@/components/Silver";

type Props = {
  drops?: BattleDrop[];
  userLost?: boolean;
};

export function BattleRewardBox({ drops, userLost }: Props) {
  if (userLost) {
    return <h3>You lost, Git gud son</h3>;
  }

  return (
    <div className={styles.container}>
      <span>Drops</span>
      <ForEach
        items={drops}
        render={(drop) => {
          const items = drop?.dropedItems;
          return (
            <div key={drop.userEmail} className={styles.dropContainer}>
              <Silver amount={drop?.silver} />
              <RenderDropedItems items={items} />
            </div>
          );
        }}
      />
    </div>
  );
}

function RenderDropedItems({ items }: { items: BattleUserDropedItem[] }) {
  return (
    <ForEach
      items={items}
      render={({ item, itemId, stack }) => (
        <InventoryItem
          key={itemId}
          inventoryItem={{
            item: item,
            id: 0,
            itemId: itemId,
            userEmail: "",
            stack: stack,
          }}
        />
      )}
    />
  );
}
