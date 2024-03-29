import { Broker } from "@/assets/Broker";
import { ToolTipDirection } from "../Tooltip";
import styles from "./style.module.scss";
import cn from "classnames";
import { When } from "../When";
import React from "react";

type Props = {
  inventoryItem?: InventoryItem | Equipment;
  backgroundColor?: string;
  toolTip?: React.ReactNode;
  toolTipDirection?: ToolTipDirection;
  stack?: number;
  customSize?: number;
  onClick?: () => void;
};

export function InventoryItem({ customSize = 26, ...args }: Props) {
  const inventoryItem = args.inventoryItem;
  const item = args.inventoryItem?.item;
  let isOnSale = false;
  let stack = args.stack ?? 0;
  if (inventoryItem && "marketListing" in inventoryItem) {
    isOnSale = !!inventoryItem?.marketListing;
    stack = args.stack || inventoryItem?.stack || 0;
  }

  if (!inventoryItem) {
    return (
      <div
        style={{ backgroundColor: args.backgroundColor }}
        className={cn(styles.inventoryItemContainer, styles.empty)}
      />
    );
  }

  if (!item) {
    return (
      <div
        style={{ backgroundColor: args.backgroundColor }}
        className={cn(styles.inventoryItemContainer, styles.empty)}
      />
    );
  }

  return (
    <div
      onClick={args.onClick}
      style={{ backgroundColor: args.backgroundColor }}
      className={cn(styles.inventoryItemContainer)}
    >
      <img width={customSize} height={customSize} src={item.image} />
      <When value={stack > 1}>
        <span className={styles.stackAmount}>{stack}</span>
      </When>

      <When value={isOnSale}>
        <div className={styles.saleIcon}>
          <Broker />
        </div>
      </When>
    </div>
  );
}
