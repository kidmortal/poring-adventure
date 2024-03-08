import styles from "./style.module.scss";

import { InventoryItem } from "../InventoryItem";
import { useModalStore } from "@/store/modal";

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

  return (
    <div className={styles.inventoryContainer}>
      {props.items?.map((value) => (
        <InventoryItem
          key={value?.id}
          inventoryItem={value}
          onClick={() => props.onClick?.(value)}
          backgroundColor="gray"
          toolTipDirection="right"
        />
      ))}
    </div>
  );
}

export function Inventory(props: Props) {
  const modalStore = useModalStore();

  return (
    <div className={styles.container}>
      <span>Inventory</span>
      <InventoryItems
        items={props.items ?? []}
        limit={12}
        onClick={(i) => {
          modalStore.setInventoryItem({
            open: true,
            selectedItem: i,
          });
        }}
      />
    </div>
  );
}
