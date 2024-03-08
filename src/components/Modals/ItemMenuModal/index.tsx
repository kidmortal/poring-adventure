import styles from "./style.module.scss";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/service";
import { useMainStore } from "@/store/main";
import { Query } from "@/store/query";
import { toast } from "react-toastify";

import { Broker } from "@/assets/Broker";
import { BaseModal } from "../BaseModal";
import { When } from "@/components/When";
import { Silver } from "@/components/Silver";
import { InventoryItem } from "@/components/InventoryItem";
import { Button } from "@/components/Button";

type Props = {
  item?: InventoryItem;
  onRequestClose: (i?: InventoryItem) => void;
};

function ItemDetails({ item }: { item?: InventoryItem }) {
  const isOnSale = !!item?.marketListing?.id;
  return (
    <div className={styles.itemDetailContainer}>
      <span>{item?.item.name}</span>
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

  const listingId = props.item?.marketListing?.id;
  const isOnSale = !!listingId;
  return (
    <BaseModal onRequestClose={props.onRequestClose}>
      <div className={styles.itemInfoContainer}>
        <InventoryItem inventoryItem={props.item} />
        <ItemDetails item={props.item} />
      </div>
      <div className={styles.buttonsContainer}>
        <Button
          label="Use item"
          onClick={() => toast("To be added", { type: "info" })}
          disabled={isOnSale}
        />
        <When value={isOnSale}>
          <Button
            label="Revoke selling"
            theme="danger"
            disabled={!isOnSale || revokeMarketListingMutation.isPending}
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
            theme="danger"
            onClick={() => {
              if (props.item) {
                createMarketListingMutation.mutate(props.item?.itemId);
              }
            }}
            disabled={isOnSale || createMarketListingMutation.isPending}
          />
        </When>
      </div>
    </BaseModal>
  );
}
