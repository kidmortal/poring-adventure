import styles from "./style.module.scss";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Query } from "@/store/query";
import { toast } from "react-toastify";

import { BaseModal } from "../BaseModal";
import { When } from "@/components/When";
import { Silver } from "@/components/Silver";
import { InventoryItem } from "@/components/InventoryItem";
import { Button } from "@/components/Button";
import { useModalStore } from "@/store/modal";
import { useWebsocketApi } from "@/api/websocketServer";
import { useMainStore } from "@/store/main";
import { ItemStats } from "@/components/EquipedItem";

type Props = {
  isOpen?: boolean;
  item?: InventoryItem | Equipment;
  onRequestClose: (i?: InventoryItem) => void;
};

function ItemDetails({ item }: { item?: InventoryItem | Equipment }) {
  let isOnSale = false;
  let stack = 0;
  let totalPrice = 0;
  if (item && "marketListing" in item) {
    isOnSale = !!item?.marketListing;
    stack = item?.marketListing?.stack ?? 0;
    totalPrice =
      (item.marketListing?.price ?? 0) * (item.marketListing?.stack ?? 1);
  }

  return (
    <div className={styles.itemDetailContainer}>
      <ItemStats item={item} />
      <When value={isOnSale}>
        <div className={styles.row}>
          <span>Sale</span>
          <InventoryItem inventoryItem={item} stack={stack} />
          <Silver amount={totalPrice} />
        </div>
      </When>
    </div>
  );
}

export function ItemMenuModal(props: Props) {
  const store = useMainStore();
  const api = useWebsocketApi();
  const modalStore = useModalStore();
  const queryClient = useQueryClient();

  const revokeMarketListingMutation = useMutation({
    mutationFn: (listingId: number) =>
      api.market.revokeMarketListing(listingId),
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

  const consumeItemMutation = useMutation({
    mutationFn: (itemId: number) => api.items.consumeItem(itemId),
    onSuccess: () => {
      toast("Item consumed", { type: "success", autoClose: 1000 });
    },
    onSettled: () => {
      props.onRequestClose();
      queryClient.refetchQueries({
        queryKey: [Query.USER_CHARACTER],
      });
    },
  });

  const unequipItemMutation = useMutation({
    mutationFn: (itemId: number) => api.items.unequipItem(itemId),
    onSuccess: () => {
      toast("Item unequipped", { type: "success" });
    },
    onSettled: () => {
      props.onRequestClose();
      queryClient.refetchQueries({
        queryKey: [Query.USER_CHARACTER],
      });
    },
  });

  const equipItemMutation = useMutation({
    mutationFn: (itemId: number) => api.items.equipItem(itemId),
    onSuccess: () => {
      toast("Item equipped", { type: "success" });
    },
    onSettled: () => {
      props.onRequestClose();
      queryClient.refetchQueries({
        queryKey: [Query.USER_CHARACTER],
      });
    },
  });

  const item = props.item;
  let listingId = 0;
  let hasRemainingStock = false;

  if (item && "marketListing" in item) {
    listingId = item.marketListing?.id ?? 0;
    hasRemainingStock = (item.stack || 0) > (item.marketListing?.stack || 0);
  }

  const isOnSale = !!listingId;
  const isConsumable = props.item?.item?.category === "consumable";

  const isAlreadyEquipped = !!store.userCharacterData?.equipment.find(
    (equip) => equip.itemId === item?.itemId
  );

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <div className={styles.itemInfoContainer}>
        <InventoryItem inventoryItem={item} />
        <ItemDetails item={item} />
      </div>
      <div className={styles.buttonsContainer}>
        <When value={isConsumable}>
          <Button
            label="Use item"
            onClick={() => {
              if (props.item?.itemId) {
                consumeItemMutation.mutate(props.item?.itemId);
              }
            }}
            disabled={!hasRemainingStock || consumeItemMutation.isPending}
          />
        </When>

        <When value={!isConsumable}>
          <When value={!isAlreadyEquipped}>
            <Button
              label="Equip item"
              onClick={() => {
                if (props.item?.itemId) {
                  equipItemMutation.mutate(props.item?.itemId);
                }
              }}
            />
          </When>
          <When value={isAlreadyEquipped}>
            <Button
              label="Unequip item"
              onClick={() => {
                if (props.item?.itemId) {
                  unequipItemMutation.mutate(props.item?.itemId);
                }
              }}
            />
          </When>
        </When>

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
        <When value={hasRemainingStock}>
          <Button
            label="Sell item"
            theme="danger"
            onClick={() => {
              modalStore.setInventoryItem({ open: false });
              modalStore.setSellItem({ open: true });
            }}
            disabled={!hasRemainingStock}
          />
        </When>
      </div>
    </BaseModal>
  );
}
