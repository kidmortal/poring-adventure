import styles from "./style.module.scss";
import { InventoryItem } from "../InventoryItem";

export function EquippedItems(props: {
  equips: Equipment[];
  onClick?: (i: Item) => void;
}) {
  const inventorySlots: (Equipment | { id: string })[] = props.equips;
  if (inventorySlots.length < 4) {
    const remainingSlots = 4 - inventorySlots.length;
    for (let index = 0; index < remainingSlots; index++) {
      inventorySlots.push({ id: `empty-${index}` });
    }
  }

  return (
    <div className={styles.inventoryContainer}>
      {props.equips?.map((equip) => (
        <InventoryItem
          key={equip.id}
          inventoryItem={{
            item: equip.item,
            itemId: equip.id,
            id: equip.id,
            stack: 1,
            userEmail: "",
          }}
          backgroundColor="gray"
          onClick={() => {}}
        />
      ))}
    </div>
  );
}
