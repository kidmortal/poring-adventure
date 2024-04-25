import styles from './style.module.scss';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Query } from '@/store/query';
import { toast } from 'react-toastify';

import { BaseModal } from '../BaseModal';
import { When } from '@/components/shared/When';
import { Silver } from '@/components/StatsComponents/Silver';
import { InventoryItem } from '@/components/Items/InventoryItem';
import { Button } from '@/components/shared/Button';
import { useModalStore } from '@/store/modal';
import { useWebsocketApi } from '@/api/websocketServer';
import { ItemStats } from '@/components/Items/ItemStats';

type Props = {
  isOpen?: boolean;
  inventoryItem?: InventoryItem;
  onRequestClose: (i?: InventoryItem) => void;
};

function ItemDetails({ inventoryItem }: { inventoryItem?: InventoryItem }) {
  let isOnSale = false;
  let stack = 0;
  let totalPrice = 0;

  isOnSale = !!inventoryItem?.marketListing;
  stack = inventoryItem?.marketListing?.stack ?? 0;
  totalPrice = (inventoryItem?.marketListing?.price ?? 0) * (inventoryItem?.marketListing?.stack ?? 1);

  return (
    <div className={styles.itemDetailContainer}>
      <ItemStats inventoryItem={inventoryItem} />
      <When value={isOnSale}>
        <div className={styles.row}>
          <span>Sale</span>
          <InventoryItem inventoryItem={inventoryItem} stack={stack} />
          <Silver amount={totalPrice} />
        </div>
      </When>
    </div>
  );
}

export function ItemMenuModal(props: Props) {
  const api = useWebsocketApi();
  const modalStore = useModalStore();
  const queryClient = useQueryClient();

  const revokeMarketListingMutation = useMutation({
    mutationFn: (listingId: number) => api.market.removeMarketListing({ marketListingId: listingId }),
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
    mutationFn: (inventoryId: number) => api.items.consumeItem({ inventoryId }),
    onSuccess: () => {
      toast('Item consumed', { type: 'success', autoClose: 1000 });
    },
    onSettled: () => {
      props.onRequestClose();
      queryClient.refetchQueries({
        queryKey: [Query.USER_CHARACTER],
      });
    },
  });

  const unequipItemMutation = useMutation({
    mutationFn: (inventoryId: number) => api.items.unequipItem({ inventoryId }),
    onSuccess: () => {
      toast('Item unequipped', { type: 'success' });
    },
    onSettled: () => {
      props.onRequestClose();
      queryClient.refetchQueries({
        queryKey: [Query.USER_CHARACTER],
      });
    },
  });

  const equipItemMutation = useMutation({
    mutationFn: (inventoryId: number) => api.items.equipItem({ inventoryId }),
    onSuccess: () => {
      toast('Item equipped', { type: 'success' });
    },
    onSettled: () => {
      props.onRequestClose();
      queryClient.refetchQueries({
        queryKey: [Query.USER_CHARACTER],
      });
    },
  });

  const inventoryItem = props.inventoryItem;
  let listingId = 0;
  let hasRemainingStock = false;

  if (inventoryItem && 'marketListing' in inventoryItem) {
    listingId = inventoryItem.marketListing?.id ?? 0;
    hasRemainingStock = (inventoryItem.stack || 0) > (inventoryItem.marketListing?.stack || 0);
  }

  const isOnSale = !!listingId;
  const isConsumable = props.inventoryItem?.item?.category === 'consumable';

  const isAlreadyEquipped = inventoryItem?.equipped ?? false;

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <div className={styles.itemInfoContainer}>
        <InventoryItem inventoryItem={inventoryItem} />
        <ItemDetails inventoryItem={inventoryItem} />
      </div>
      <div className={styles.buttonsContainer}>
        <When value={isConsumable}>
          <Button
            label="Use item"
            onClick={() => {
              if (props.inventoryItem?.itemId) {
                consumeItemMutation.mutate(props.inventoryItem?.id);
              }
            }}
            disabled={!hasRemainingStock || consumeItemMutation.isPending}
          />
        </When>

        <When value={!isConsumable}>
          <Button
            label="Enhance"
            onClick={() => {
              modalStore.setInventoryItem({ open: false });
              modalStore.setEnhanceItem({ open: true });
            }}
          />
          <When value={!isAlreadyEquipped}>
            <Button
              label="Equip item"
              disabled={equipItemMutation.isPending}
              onClick={() => {
                if (props.inventoryItem?.itemId) {
                  equipItemMutation.mutate(props.inventoryItem.id);
                }
              }}
            />
          </When>
          <When value={isAlreadyEquipped}>
            <Button
              label="Unequip item"
              disabled={unequipItemMutation.isPending}
              onClick={() => {
                if (props.inventoryItem?.itemId) {
                  unequipItemMutation.mutate(props.inventoryItem?.id);
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
