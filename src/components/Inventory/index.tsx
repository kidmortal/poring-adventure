import styles from "./style.module.scss";

import { useItemMenuStore } from "@/store/itemMenu";
import { InventoryItem } from "../InventoryItem";

type Props = {
  items?: InventoryItem[];
};

function InventoryItems(props: {
  items: InventoryItem[];
  onClick?: (i: InventoryItem) => void;
  limit: number;
}) {
  const inventorySlots: (InventoryItem | { id: string })[] = props.items;
  if (inventorySlots.length < props.limit) {
    const remainingSlots = props.limit - inventorySlots.length;
    for (let index = 0; index < remainingSlots; index++) {
      inventorySlots.push({ id: `empty-${index}` });
    }
  }

  console.log(inventorySlots);

  return (
    <div className={styles.inventoryContainer}>
      {props.items?.map((value) => (
        <InventoryItem
          key={value?.id}
          inventoryItem={value}
          onClick={() => props.onClick?.(value)}
          backgroundColor="gray"
        />
      ))}
    </div>
  );
}

export function Inventory(props: Props) {
  const itemMenuStore = useItemMenuStore();

  return (
    <div className={styles.container}>
      <span>Inventory</span>
      <InventoryItems
        items={props.items ?? []}
        limit={12}
        onClick={(i) => {
          itemMenuStore.setSelectedItem(i);
          itemMenuStore.setIsModalOpen(true);
        }}
      />
    </div>
  );
}
