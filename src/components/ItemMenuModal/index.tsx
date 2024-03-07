import { useDetectClickOutsideElement } from "@/hooks/useDetectClickOutsideElement";
import { Button } from "../Button";
import styles from "./style.module.scss";
import { When } from "../When";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/service";
import { useMainStore } from "@/store/main";
import { Query } from "@/store/query";
import { toast } from "react-toastify";
import { InventoryItem } from "../InventoryItem";

type Props = {
  item?: Item;
  onRequestClose: (i?: Item) => void;
};

export function ItemMenuModal(props: Props) {
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

  const { containerRef } = useDetectClickOutsideElement({
    onClickOutside: () => props.onRequestClose(props.item),
  });
  const isOnSale = !!props.item?.marketListing;
  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.modalBox}>
        <InventoryItem item={props.item} />
        <Button label="Use item" disabled={isOnSale} />
        <When value={isOnSale}>
          <Button
            label="Revoke selling"
            theme="error"
            onClick={() => {
              toast("To be added", { type: "info" });
            }}
          />
        </When>
        <When value={!isOnSale}>
          <Button
            label="Sell item"
            theme="error"
            onClick={() => {
              if (props.item) {
                createMarketListingMutation.mutate(props.item?.id);
              }
            }}
            disabled={isOnSale || createMarketListingMutation.isPending}
          />
        </When>
      </div>
    </div>
  );
}
