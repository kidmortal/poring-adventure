import styles from "./style.module.scss";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Query } from "@/store/query";
import { toast } from "react-toastify";

import { BaseModal } from "../BaseModal";
import { When } from "@/components/When";
import { Silver } from "@/components/Silver";
import { InventoryItem } from "@/components/InventoryItem";
import { Button } from "@/components/Button";
import { useWebsocketApi } from "@/api/websocketServer";

type Props = {
  isOpen?: boolean;
  item?: InventoryItem;
  onRequestClose: (i?: InventoryItem) => void;
};

export function SellItemModal(props: Props) {
  const api = useWebsocketApi();
  const price = 5;
  const amount = 1;
  const queryClient = useQueryClient();
  const createMarketListingMutation = useMutation({
    mutationFn: (args: { id: number; stack: number; price: number }) =>
      api.market.createMarketListing({
        itemId: args.id,
        price: args.price,
        stack: args.stack,
      }),
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

  const hasRemainingStock =
    (props.item?.stack || 0) > (props.item?.marketListing?.stack || 0);
  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <div className={styles.itemInfoContainer}>
        <InventoryItem inventoryItem={props.item} />
      </div>
      <div className={styles.buttonsContainer}>
        <input placeholder={`price - ${price}`} type="number" disabled />
        <input placeholder={`amount - ${amount}`} type="number" disabled />
        <Silver amount={amount * price} />
        <When value={hasRemainingStock}>
          <Button
            label="Sell item"
            theme="danger"
            onClick={() => {
              if (props.item) {
                createMarketListingMutation.mutate({
                  id: props.item?.itemId,
                  price: 5,
                  stack: 1,
                });
              }
            }}
            disabled={
              !hasRemainingStock || createMarketListingMutation.isPending
            }
          />
        </When>
      </div>
    </BaseModal>
  );
}
