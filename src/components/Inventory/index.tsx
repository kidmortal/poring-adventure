import styles from "./style.module.scss";

import { InventoryItem } from "../InventoryItem";
import { useModalStore } from "@/store/modal";
import cn from "classnames";
import { InventoryFilters, useMainStore } from "@/store/main";

const MATERIALS = ["material"];
const CONSUMABLES = ["consumable"];
const EQUIPS = ["weapon", "armor", "legs", "boots"];

function filterInventory(items: InventoryItem[], filter: InventoryFilters) {
  switch (filter) {
    case "all":
      return items;
    case "equip":
      return items?.filter((inv) => EQUIPS.includes(inv.item?.category));
    case "consumable":
      return items?.filter((inv) => CONSUMABLES.includes(inv.item?.category));
    case "material":
      return items?.filter((inv) => MATERIALS.includes(inv.item?.category));

    default:
      return items;
  }
}

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
  const store = useMainStore();
  const modalStore = useModalStore();
  const filteredInventory = filterInventory(
    props.items ?? [],
    store.inventoryFilter
  );

  return (
    <div className={styles.container}>
      <InventoryFilter
        selected={store.inventoryFilter}
        onClick={(option) => store.setInventoryFilter(option)}
      />
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

function InventoryFilter({
  selected,
  onClick,
}: {
  selected: InventoryFilters;
  onClick: (option: InventoryFilters) => void;
}) {
  return (
    <div className={styles.filtersContainer}>
      <div
        onClick={() => onClick("all")}
        className={cn(styles.filter, { [styles.selected]: selected === "all" })}
      >
        <img
          height={20}
          width={20}
          src="https://kidmortal.sirv.com/misc/inventory.webp?w=20&h=20"
        />
        <span>All</span>
      </div>
      <div
        onClick={() => onClick("equip")}
        className={cn(styles.filter, {
          [styles.selected]: selected === "equip",
        })}
      >
        <img
          height={20}
          width={20}
          src="https://kidmortal.sirv.com/misc/equip.webp?w=20&h=20"
        />
        <span>Equips.</span>
      </div>
      <div
        onClick={() => onClick("consumable")}
        className={cn(styles.filter, {
          [styles.selected]: selected === "consumable",
        })}
      >
        <img
          height={20}
          width={20}
          src="https://kidmortal.sirv.com/misc/consumable.webp?w=20&h=20"
        />
        <span>Consum.</span>
      </div>
      <div
        onClick={() => onClick("material")}
        className={cn(styles.filter, {
          [styles.selected]: selected === "material",
        })}
      >
        <img
          height={20}
          width={20}
          src="https://kidmortal.sirv.com/misc/material.webp?w=20&h=20"
        />
        <span>Mats.</span>
      </div>
    </div>
  );
}
