import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./style.module.scss";
import { Query } from "@/store/query";
import { api } from "@/api/service";
import { useMainStore } from "@/store/main";
import { FullscreenLoading } from "../FullscreenLoading";
import { toast } from "react-toastify";
import { When } from "../When";
import { useItemMenuStore } from "@/store/itemMenu";
import { InventoryItem } from "../InventoryItem";

type Props = {
  items?: Item[];
};

function InventoryItems(props: {
  items: Item[];
  onClick?: (i: Item) => void;
  limit: number;
}) {
  const inventorySlots: (Item | { id: string })[] = props.items;
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
          key={value.id}
          item={value}
          onClick={() => props.onClick?.(value)}
        />
      ))}
    </div>
  );
}

export function Inventory(props: Props) {
  const itemMenuStore = useItemMenuStore();
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
    <div>
      <When value={createMarketListingMutation.isPending}>
        <FullscreenLoading />
      </When>

      <div className={styles.container}>
        <span>Inventory</span>
        <InventoryItems
          items={props.items ?? []}
          limit={12}
          onClick={(i) => {
            itemMenuStore.setSelectedItem(i);
            itemMenuStore.setIsModalOpen(true);
          }}
        />
      </div>
    </div>
  );
}
