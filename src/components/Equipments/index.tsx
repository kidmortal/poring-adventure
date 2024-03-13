import styles from "./style.module.scss";

import { EquippedItem } from "../EquipedItem";
import { useModalStore } from "@/store/modal";
import { useEffect, useState } from "react";

export function Equipments(props: {
  equips: Equipment[];
  onClick?: (i: Item) => void;
}) {
  const modalStore = useModalStore();
  const [equippedItems, setEquippedItems] = useState<{
    weapon?: Equipment;
    armor?: Equipment;
    legs?: Equipment;
    boots?: Equipment;
  }>({
    weapon: undefined,
    armor: undefined,
    legs: undefined,
    boots: undefined,
  });
  useEffect(() => {
    const newEquips: {
      weapon?: Equipment;
      armor?: Equipment;
      legs?: Equipment;
      boots?: Equipment;
    } = {};
    props.equips.forEach((equip) => {
      if (equip.item.category === "weapon") {
        newEquips.weapon = equip;
      }
      if (equip.item.category === "armor") {
        newEquips.armor = equip;
      }
      if (equip.item.category === "legs") {
        newEquips.legs = equip;
      }
      if (equip.item.category === "boots") {
        newEquips.boots = equip;
      }
    });
    setEquippedItems(newEquips);
  }, [props.equips]);

  return (
    <div className={styles.inventoryContainer}>
      <EquippedItem
        key={equippedItems.weapon?.id}
        equip={equippedItems.weapon}
        onClick={() => {
          modalStore.setInventoryItem({
            open: true,
            selectedItem: equippedItems.weapon,
          });
        }}
      />
      <EquippedItem
        key={equippedItems.armor?.id}
        equip={equippedItems.armor}
        onClick={() => {
          modalStore.setInventoryItem({
            open: true,
            selectedItem: equippedItems.armor,
          });
        }}
      />
      <EquippedItem
        key={equippedItems.legs?.id}
        equip={equippedItems.legs}
        onClick={() => {
          modalStore.setInventoryItem({
            open: true,
            selectedItem: equippedItems.legs,
          });
        }}
      />
      <EquippedItem
        key={equippedItems.boots?.id}
        equip={equippedItems.boots}
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
