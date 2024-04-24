import styles from './style.module.scss';

import { InventoryItem } from '../InventoryItem';
import { useModalStore } from '@/store/modal';
import { useEffect, useState } from 'react';

export function Equipments(props: { equips: InventoryItem[]; onClick?: (i: Item) => void }) {
  const modalStore = useModalStore();
  const [equippedItems, setEquippedItems] = useState<{
    weapon?: InventoryItem;
    armor?: InventoryItem;
    legs?: InventoryItem;
    boots?: InventoryItem;
  }>({
    weapon: undefined,
    armor: undefined,
    legs: undefined,
    boots: undefined,
  });
  useEffect(() => {
    const newEquips: {
      weapon?: InventoryItem;
      armor?: InventoryItem;
      legs?: InventoryItem;
      boots?: InventoryItem;
    } = {};
    props.equips.forEach((equip) => {
      if (equip.item.category === 'weapon') {
        newEquips.weapon = equip;
      }
      if (equip.item.category === 'armor') {
        newEquips.armor = equip;
      }
      if (equip.item.category === 'legs') {
        newEquips.legs = equip;
      }
      if (equip.item.category === 'boots') {
        newEquips.boots = equip;
      }
    });
    setEquippedItems(newEquips);
  }, [props.equips]);

  return (
    <div className={styles.inventoryContainer}>
      <InventoryItem
        key={equippedItems.weapon?.id}
        inventoryItem={equippedItems.weapon}
        onClick={() => {
          modalStore.setInventoryItem({
            open: true,
            selectedItem: equippedItems.weapon,
          });
        }}
      />
      <InventoryItem
        key={equippedItems.armor?.id}
        inventoryItem={equippedItems.armor}
        onClick={() => {
          modalStore.setInventoryItem({
            open: true,
            selectedItem: equippedItems.armor,
          });
        }}
      />
      <InventoryItem
        key={equippedItems.legs?.id}
        inventoryItem={equippedItems.legs}
        onClick={() => {
          modalStore.setInventoryItem({
            open: true,
            selectedItem: equippedItems.legs,
          });
        }}
      />
      <InventoryItem
        key={equippedItems.boots?.id}
        inventoryItem={equippedItems.boots}
        onClick={() => {
          modalStore.setInventoryItem({
            open: true,
            selectedItem: equippedItems.boots,
          });
        }}
      />
    </div>
  );
}
