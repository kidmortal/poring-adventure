import styles from "./style.module.scss";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Query } from "@/store/query";
import { toast } from "react-toastify";

import { BaseModal } from "../BaseModal";
import { Silver } from "@/components/Silver";
import { InventoryItem } from "@/components/InventoryItem";
import { Button } from "@/components/Button";
import { useWebsocketApi } from "@/api/websocketServer";
import { useModalStore } from "@/store/modal";

type Props = {
  isOpen?: boolean;
  item?: MarketListing;
  onRequestClose: (i?: InventoryItem) => void;
};

export function BuyItemModal(props: Props) {
  const api = useWebsocketApi();
  const modalStore = useModalStore();
  const queryClient = useQueryClient();

  const purchaseMutation = useMutation({
    mutationFn: (args: { listingId: number; amount: number }) =>
      api.market.purchaseMarketListing({
        marketListingId: args.listingId,
        stack: args.amount,
      }),
    onSuccess: () => {
      props.onRequestClose();
      toast("Purchase successful", { type: "success" });
      queryClient.refetchQueries({
        queryKey: [Query.ALL_MARKET],
      });
      queryClient.refetchQueries({
        queryKey: [Query.USER_CHARACTER],
      });
    },
  });

  const sellPrice = modalStore.sellItem.price ?? 0;
  const buyingAmount = modalStore.buyItem.amount ?? 0;
  const stock = props.item?.stack || 0;

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <div className={styles.itemInfoContainer}>
        <InventoryItem inventoryItem={props.item?.inventory} stack={stock} />
        <span>Seller: {props.item?.seller.name}</span>
        <div>
          Unit price: <Silver amount={sellPrice} />
        </div>
      </div>
      <div className={styles.buttonsContainer}>
        <input
          placeholder={`buying amount`}
          type="number"
          min={0}
          max={stock}
          value={modalStore.buyItem.amount}
          onChange={(e) => modalStore.setBuyItem({ amount: +e.target.value })}
        />
        <div>
          <h2>Total</h2> <Silver amount={buyingAmount * sellPrice} />
        </div>

        <Button
          label="Buy item"
          theme="danger"
          onClick={() => {
            if (props.item) {
              purchaseMutation.mutate({
                listingId: props.item?.id,
                amount: modalStore.buyItem.amount ?? 1,
              });
            }
          }}
          disabled={false}
        />
      </div>
    </BaseModal>
  );
}
