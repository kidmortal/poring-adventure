import { Broker } from "@/assets/Broker";
import { Tooltip } from "../Tooltip";
import styles from "./style.module.scss";
import cn from "classnames";
import { When } from "../When";

type Props = {
  item?: Item;
  onClick?: () => void;
};

export function InventoryItem({ item, onClick }: Props) {
  const isOnSale = !!item?.marketListing;

  if (!item?.image) {
    return <div className={cn(styles.inventoryItemContainer, styles.empty)} />;
  }

  if (!item) {
    return <div className={cn(styles.inventoryItemContainer, styles.empty)} />;
  }

  return (
    <Tooltip text={item.name}>
      <div onClick={onClick} className={cn(styles.inventoryItemContainer)}>
        <img width={40} height={40} src={item.image} />
        <span className={styles.stackAmount}>{item.stack}</span>
        <When value={isOnSale}>
          <div className={styles.saleIcon}>
            <Broker />
          </div>
        </When>
      </div>
    </Tooltip>
  );
}
