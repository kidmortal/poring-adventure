import { Broker } from "@/assets/Broker";
import { Tooltip } from "../Tooltip";
import styles from "./style.module.scss";
import cn from "classnames";
import { When } from "../When";

type Props = {
  inventoryItem?: InventoryItem;
  backgroundColor?: string;
  onClick?: () => void;
};

export function InventoryItem({
  inventoryItem,
  onClick,
  backgroundColor,
}: Props) {
  const item = inventoryItem?.item;
  const isOnSale = !!inventoryItem?.marketListing;

  if (!item?.id) {
    return (
      <div
        style={{ backgroundColor: backgroundColor }}
        className={cn(styles.inventoryItemContainer, styles.empty)}
      />
    );
  }

  if (!item) {
    return (
      <div
        style={{ backgroundColor: backgroundColor }}
        className={cn(styles.inventoryItemContainer, styles.empty)}
      />
    );
  }

  return (
    <Tooltip text={item.name}>
      <div
        onClick={onClick}
        style={{ backgroundColor: backgroundColor }}
        className={cn(styles.inventoryItemContainer)}
      >
        <img width={40} height={40} src={item.image} />
        <When value={inventoryItem.stack > 1}>
          <span className={styles.stackAmount}>{inventoryItem.stack}</span>
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
