import styles from './style.module.scss';

import { InventoryItem } from '../InventoryItem';
import { useModalStore } from '@/store/modal';

const EQUIPMENT_SLOTS = ['weapon', 'armor', 'legs', 'boots'] as const;

export function Equipments(props: { equips: InventoryItem[] }) {
  const modalStore = useModalStore();

  return (
    <div className={styles.inventoryContainer}>
      {EQUIPMENT_SLOTS.map((slot) => {
        const equipped = props.equips.find((equip) => equip.item.category === slot);

        return (
          <InventoryItem
            key={slot}
            inventoryItem={equipped}
            onClick={() => {
              if (equipped) {
                modalStore.setInventoryItem({ open: true, selectedItem: equipped });
              }
            }}
          />
        );
      })}
    </div>
  );
}
