import styles from './style.module.scss';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Query } from '@/store/query';

import { BaseModal } from '../BaseModal';
import { When } from '@/components/shared/When';
import { Silver } from '@/components/StatsComponents/Silver';
import { InventoryItem } from '@/components/Items/InventoryItem';
import { Button } from '@/components/shared/Button';
import { useWebsocketApi } from '@/api/websocketServer';
import { useModalStore } from '@/store/modal';
import Input from '@/components/shared/Input';
import { ItemStats } from '@/components/Items/ItemStats';

type Props = {
  isOpen?: boolean;
  item?: InventoryItem;
  onRequestClose: (i?: InventoryItem) => void;
};

export function SellItemModal(props: Props) {
  const api = useWebsocketApi();
  const modalStore = useModalStore();
  const queryClient = useQueryClient();
  const createMarketListingMutation = useMutation({
    mutationFn: (args: { stack: number; price: number }) =>
      api.market.createMarketListing({
        inventoryId: props.item?.id ?? 0,
        price: args.price,
        stack: args.stack,
      }),
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

  const item = props.item;

  let hasRemainingStock = false;
  const sellPrice = modalStore.sellItem.price ?? 0;
  const sellAmount = modalStore.sellItem.amount ?? 0;

  if (item && 'marketListing' in item) {
    hasRemainingStock = (item.stack || 0) > (item.marketListing?.stack || 0);
  }

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <div className={styles.itemInfoContainer}>
        <InventoryItem inventoryItem={props.item} />
        <ItemStats inventoryItem={props.item} />
      </div>
      <div className={styles.buttonsContainer}>
        <Input
          placeholder={`price`}
          type="number"
          min={1}
          onChange={(e) => modalStore.setSellItem({ price: +e.target.value })}
        />
        <Input
          placeholder={`amount`}
          type="number"
          min={0}
          onChange={(e) => modalStore.setSellItem({ amount: +e.target.value })}
        />
        <div className={styles.totalPriceContainer}>
          <span>{sellAmount}x</span>
          <Silver amount={sellPrice} />
          <span>=</span>
          <Silver amount={sellAmount * sellPrice} />
        </div>
        <When value={hasRemainingStock}>
          <Button
            label="Sell item"
            theme="danger"
            onClick={() => {
              if (props.item) {
                createMarketListingMutation.mutate({
                  price: sellPrice,
                  stack: sellAmount,
                });
              }
            }}
            disabled={!hasRemainingStock || createMarketListingMutation.isPending}
          />
        </When>
      </div>
    </BaseModal>
  );
}
