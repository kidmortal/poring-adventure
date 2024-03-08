import styles from "./style.module.scss";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/service";
import { useMainStore } from "@/store/main";
import { Query } from "@/store/query";
import { toast } from "react-toastify";

import { BaseModal } from "../BaseModal";
import { When } from "@/components/When";
import { Silver } from "@/components/Silver";
import { InventoryItem } from "@/components/InventoryItem";
import { Button } from "@/components/Button";
import { useModalStore } from "@/store/modal";

type Props = {
  isOpen?: boolean;
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
          <span>Sale</span>
          <InventoryItem
            inventoryItem={item}
            stack={item?.marketListing?.stack}
          />
          <Silver
            amount={
              (item?.marketListing?.price ?? 0) *
              (item?.marketListing?.stack ?? 1)
            }
          />
        </div>
      </When>
    </div>
  );
}

export function ItemMenuModal(props: Props) {
  const store = useMainStore();
  const modalStore = useModalStore();
  const queryClient = useQueryClient();

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
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
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
              modalStore.setInventoryItem({ open: false });
              modalStore.setSellItem({ open: true });
            }}
            disabled={isOnSale}
          />
        </When>
      </div>
    </BaseModal>
  );
}
