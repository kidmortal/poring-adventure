import { Broker } from "@/assets/Broker";
import { Tooltip } from "../Tooltip";
import styles from "./style.module.scss";
import cn from "classnames";
import { When } from "../When";

type Props = {
  inventoryItem?: InventoryItem;
  backgroundColor?: string;
  stack?: number;
  onClick?: () => void;
};

export function InventoryItem(args: Props) {
  const inventoryItem = args.inventoryItem;
  const item = args.inventoryItem?.item;
  const isOnSale = !!inventoryItem?.marketListing;

  const stack = args.stack || inventoryItem?.stack || 0;

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
    <Tooltip text={item.name}>
      <div
        onClick={args.onClick}
        style={{ backgroundColor: args.backgroundColor }}
        className={cn(styles.inventoryItemContainer)}
      >
        <img width={40} height={40} src={item.image} />
        <When value={stack > 1}>
          <span className={styles.stackAmount}>{stack}</span>
        </When>

        <When value={isOnSale}>
          <div className={styles.saleIcon}>
            <Broker />
          </div>
        </When>
      </div>
    </Tooltip>
  );
}
