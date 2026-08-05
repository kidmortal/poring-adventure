import styles from './style.module.scss';

import { InventoryItem } from '../InventoryItem';
import { useModalStore } from '@/store/modal';

const EQUIPMENT_SLOTS = ['weapon', 'armor', 'legs', 'boots', 'accessory'] as const;

/**
 * The gear rail. `slots` is what lets a caller split the five pieces into the
 * two columns the profile stands either side of the character — the shape the
 * genre has used for paper dolls forever, and the one that fills a tall card
 * instead of leaving a hole under a 2x2 block.
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
