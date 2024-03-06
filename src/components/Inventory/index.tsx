import { useQueryClient } from "@tanstack/react-query";
import styles from "./style.module.scss";
import { Query } from "@/store/query";
import { Tooltip } from "../Tooltip";

export function Inventory() {
  const queryClient = useQueryClient();
  const userQuery = queryClient.getQueryData<User>([Query.USER_CHARACTER]);
  return (
    <div className={styles.container}>
      <span>Inventory</span>
      <div className={styles.inventoryContainer}>
        {userQuery?.items?.map((value) => (
          <InventoryItem key={value.id} item={value} />
        ))}
      </div>
    </div>
  );
}

function InventoryItem({ item }: { item: Item }) {
  return (
    <Tooltip text={item.name}>
      <div className={styles.inventoryItemContainer}>
        <img width={40} height={40} src={item.image} />
        <span className={styles.stackAmount}>{item.stack}</span>
      </div>
    </Tooltip>
  );
}
