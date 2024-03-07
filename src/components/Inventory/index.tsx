import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./style.module.scss";
import { Query } from "@/store/query";
import { Tooltip } from "../Tooltip";
import cn from "classnames";
import { api } from "@/api/service";
import { useMainStore } from "@/store/main";
import { FullscreenLoading } from "../FullscreenLoading";
import { toast } from "react-toastify";
import { When } from "../When";

type Props = {
  items?: Item[];
};

function BlankInventory() {
  return <div className={styles.inventoryBlank}></div>;
}

export function Inventory(props: Props) {
  const store = useMainStore();
  const queryClient = useQueryClient();

  const createMarketListingMutation = useMutation({
    mutationFn: (id: number) =>
      api.createMarketListing(
        { itemId: id, price: 10, stack: 1 },
        store.loggedUserInfo.accessToken
      ),
    onMutate: async (listingItemId) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: [Query.USER_CHARACTER] });

      // Snapshot the previous value
      const previousUserCharacter = queryClient.getQueryData<User>([
        Query.USER_CHARACTER,
      ]);

      if (previousUserCharacter) {
        const inventoryItemIndex = previousUserCharacter.items?.findIndex(
          (item) => item.id === listingItemId
        );

        if (inventoryItemIndex && inventoryItemIndex >= 0) {
          const newUserInfo = previousUserCharacter;
          if (newUserInfo.items) {
            newUserInfo.items[inventoryItemIndex].marketListing = {
              id: 0,
              createdAt: "",
              updatedAt: "",
              sellerEmail: "",
              itemId: 0,
              price: 10,
              stack: 0,
            };
            // Optimistically update to the new value
            queryClient.setQueryData([Query.USER_CHARACTER], newUserInfo);

            return { previousUserCharacter, newUserInfo };
          }
        }
      }

      // Return the normal values
      return { previousUserCharacter };
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(
        [Query.USER_CHARACTER],
        context?.previousUserCharacter
      );
    },
    onSuccess: () => {
      toast("Market Listing successful", { type: "success" });
    },
    onSettled: () => {
      queryClient.refetchQueries({
        queryKey: [Query.USER_CHARACTER],
      });
      queryClient.refetchQueries({
        queryKey: [Query.ALL_MARKET],
      });
    },
  });

  return (
    <div className={styles.container}>
      <When value={createMarketListingMutation.isPending}>
        <FullscreenLoading />
      </When>
      <span>Inventory</span>
      <div className={styles.backgroundContainer}>
        {Array(12)
          .fill(0)
          .map(() => (
            <BlankInventory />
          ))}
      </div>
      <div className={styles.inventoryContainer}>
        {props.items?.map((value) => (
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
