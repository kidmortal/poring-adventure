import { useDetectClickOutsideElement } from "@/hooks/useDetectClickOutsideElement";
import { Button } from "../Button";
import styles from "./style.module.scss";
import { When } from "../When";

type Props = {
  item?: Item;
  onRequestClose: (i?: Item) => void;
  onSellItem?: (i?: Item) => void;
};

export function ItemMenuModal(props: Props) {
  const { containerRef } = useDetectClickOutsideElement({
    onClickOutside: () => props.onRequestClose(props.item),
  });
  const isOnSale = !!props.item?.marketListing;
  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.modalBox}>
        <div className={styles.itemContainer}>
          <img width={40} height={40} src={props.item?.image} />
          <span className={styles.stackAmount}>{props.item?.stack}</span>
        </div>
        <Button label="Use item" disabled={isOnSale} />
        <When value={isOnSale}>
          <Button
            label="Revoke selling"
            theme="error"
            onClick={() => {
              alert("tba");
            }}
          />
        </When>
        <When value={!isOnSale}>
          <Button
            label="Sell item"
            theme="error"
            onClick={() => props.onSellItem?.(props.item)}
            disabled={isOnSale}
          />
        </When>
      </div>
    </div>
  );
}
