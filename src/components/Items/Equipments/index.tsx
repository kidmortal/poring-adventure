import styles from './style.module.scss';

import { InventoryItem } from '../InventoryItem';
import { useModalStore } from '@/store/modal';

const EQUIPMENT_SLOTS = ['weapon', 'armor', 'legs', 'boots'] as const;

/**
 * The gear rail. `slots` is what makes the accessory a slot of its own rather
 * than a fifth box hanging off the 2x2 block — it sits on the other side of the
 * character, where the profile has room for it.
 */
export function Equipments(props: { equips: InventoryItem[]; slots?: readonly string[] }) {
  const modalStore = useModalStore();
  const slots = props.slots ?? EQUIPMENT_SLOTS;

  return (
    <div className={styles.inventoryContainer}>
      {slots.map((slot) => {
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
