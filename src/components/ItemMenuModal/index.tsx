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
import { Silver } from "../Silver";
import { Broker } from "@/assets/Broker";

type Props = {
  item?: Item;
  onRequestClose: (i?: Item) => void;
};

function ItemDetails({ item }: { item?: Item }) {
  const isOnSale = !!item?.marketListing;
  return (
    <div className={styles.itemDetailContainer}>
      <span>{item?.name}</span>
      <When value={isOnSale}>
        <div className={styles.row}>
          <Broker />
          <span>On sale</span>
          <Silver amount={item?.marketListing?.price} />
        </div>
      </When>
    </div>
  );
}

export function ItemMenuModal(props: Props) {
  const store = useMainStore();
  const queryClient = useQueryClient();
  const createMarketListingMutation = useMutation({
    mutationFn: (id: number) =>
      api.createMarketListing(
        { itemId: id, price: 10, stack: 1 },
        store.loggedUserInfo.accessToken
      ),
    onSuccess: () => {
      toast("Market Listing successful", { type: "success" });
    },
    onSettled: () => {
      props.onRequestClose();
      queryClient.refetchQueries({
        queryKey: [Query.USER_CHARACTER],
      });
      queryClient.refetchQueries({
        queryKey: [Query.ALL_MARKET],
      });
    },
  });

  const revokeMarketListingMutation = useMutation({
    mutationFn: (listingId: number) =>
      api.revokeMarketListing({
        accessToken: store.loggedUserInfo.accessToken,
        listingId,
      }),
    onSuccess: () => {
      toast("Listing removed", { type: "success" });
    },
    onSettled: () => {
      props.onRequestClose();
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
  const listingId = props.item?.marketListing?.id;
  const isOnSale = !!listingId;
  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.modalBox}>
        <div className={styles.itemInfoContainer}>
          <InventoryItem item={props.item} />
          <ItemDetails item={props.item} />
        </div>
        <div className={styles.buttonsContainer}>
          <Button label="Use item" disabled={isOnSale} />
          <When value={isOnSale}>
            <Button
              label="Revoke selling"
              theme="error"
              onClick={() => {
                if (isOnSale && listingId) {
                  revokeMarketListingMutation.mutate(listingId);
                }
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
    </div>
  );
}
