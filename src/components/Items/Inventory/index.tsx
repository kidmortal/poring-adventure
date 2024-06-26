import styles from './style.module.scss';

import { InventoryItem } from '../InventoryItem';
import { useModalStore } from '@/store/modal';

import { InventoryFilters, useMainStore } from '@/store/main';
import { ItemCategoryFilter } from '../ItemCategoryFilter';

const MATERIALS = ['material'];
const CONSUMABLES = ['consumable'];
const EQUIPS = ['weapon', 'armor', 'legs', 'boots'];

function filterInventory(items: InventoryItem[], filter: InventoryFilters) {
  const notEquippedItems = items?.filter((inv) => !inv.equipped);

  switch (filter) {
    case 'all':
      return notEquippedItems;
    case 'equipment':
      return notEquippedItems?.filter((inv) => EQUIPS.includes(inv.item?.category));
    case 'consumable':
      return notEquippedItems?.filter((inv) => CONSUMABLES.includes(inv.item?.category));
    case 'material':
      return notEquippedItems?.filter((inv) => MATERIALS.includes(inv.item?.category));

    default:
      return notEquippedItems;
  }
}

type Props = {
  items?: InventoryItem[];
};

function InventoryItems(props: { items: InventoryItem[]; onClick?: (i: InventoryItem) => void; limit: number }) {
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
          toolTipDirection="right"
        />
      ))}
    </div>
  );
}

export function Inventory(props: Props) {
  const store = useMainStore();
  const modalStore = useModalStore();
  const filteredInventory = filterInventory(props.items ?? [], store.inventoryFilter);

  return (
    <div className={styles.container}>
      <ItemCategoryFilter selected={store.inventoryFilter} onClick={(option) => store.setInventoryFilter(option)} />
      <InventoryItems
        items={filteredInventory}
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
