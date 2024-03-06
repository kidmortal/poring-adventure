import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./style.module.scss";
import { Query } from "@/store/query";
import { Tooltip } from "../Tooltip";
import cn from "classnames";
import { api } from "@/api/service";
import { useMainStore } from "@/store/main";
import { FullscreenLoading } from "../FullscreenLoading";
import { toast } from "react-toastify";

export function Inventory() {
  const store = useMainStore();
  const queryClient = useQueryClient();
  const userQuery = queryClient.getQueryData<User>([Query.USER_CHARACTER]);

  const createMarketListingMutation = useMutation({
    mutationFn: (id: number) =>
      api.createMarketListing(
        { itemId: id, price: 10, stack: 1 },
        store.loggedUserInfo.accessToken
      ),
    onSuccess: () => {
      toast("Market Listing successful", { type: "success" });
      queryClient.refetchQueries({
        queryKey: [Query.USER_CHARACTER],
      });
      queryClient.refetchQueries({
        queryKey: [Query.ALL_MARKET],
      });
    },
  });

  if (createMarketListingMutation.isPending) {
    return <FullscreenLoading />;
  }

  return (
    <div className={styles.container}>
      <span>Inventory</span>
      <div className={styles.inventoryContainer}>
        {userQuery?.items?.map((value) => (
          <InventoryItem
            key={value.id}
            item={value}
            onClick={() => createMarketListingMutation.mutate(value.id)}
          />
        ))}
      </div>
    </div>
  );
}

function InventoryItem({ item, onClick }: { item: Item; onClick: () => void }) {
  const isOnSale = !!item.marketListing;
  let tooltipText = item.name;

  if (isOnSale) {
    tooltipText += ` - on sale for ${item.marketListing.price} silver`;
  }

  return (
    <Tooltip text={tooltipText}>
      <div
        onClick={() => {
          if (!isOnSale) {
            onClick();
          }
        }}
        className={cn(styles.inventoryItemContainer, {
          [styles.onSale]: isOnSale,
        })}
      >
        <img width={40} height={40} src={item.image} />
        <span className={styles.stackAmount}>{item.stack}</span>
      </div>
    </Tooltip>
  );
}
