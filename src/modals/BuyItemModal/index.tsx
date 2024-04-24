import styles from './style.module.scss';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Query } from '@/store/query';
import { toast } from 'react-toastify';

import { BaseModal } from '../BaseModal';
import { Silver } from '@/components/StatsComponents/Silver';
import { InventoryItem } from '@/components/Items/InventoryItem';
import { Button } from '@/components/shared/Button';
import { useWebsocketApi } from '@/api/websocketServer';
import { useModalStore } from '@/store/modal';
import Input from '@/components/shared/Input';
import { ItemStats } from '@/components/Items/EquipedItem';

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
      toast('Purchase successful', { type: 'success', autoClose: 1000 });
      queryClient.refetchQueries({
        queryKey: [Query.ALL_MARKET],
      });
      queryClient.refetchQueries({
        queryKey: [Query.USER_CHARACTER],
      });
    },
  });

  const sellPrice = modalStore.buyItem.marketListing?.price ?? 0;
  const buyingAmount = modalStore.buyItem.amount ?? 0;
  const stock = props.item?.stack || 0;

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <div className={styles.itemInfoContainer}>
        <InventoryItem inventoryItem={props.item?.inventory} stack={stock} />
        <ItemStats inventoryItem={props.item?.inventory} />

        <span>Seller: {props.item?.seller.name}</span>
        <div className={styles.row}>
          <span>Unit price: </span>
          <Silver amount={sellPrice} />
        </div>
      </div>
      <div className={styles.buttonsContainer}>
        <div className={styles.row}>
          <Input
            placeholder={`buying amount`}
            type="number"
            min={0}
            max={stock}
            value={modalStore.buyItem.amount}
            onChange={(e) => modalStore.setBuyItem({ amount: +e.target.value })}
          />
          <Silver amount={buyingAmount * sellPrice} />
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
