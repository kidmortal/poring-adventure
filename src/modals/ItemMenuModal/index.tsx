import styles from './style.module.scss';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Query } from '@/store/query';
import { notify } from '@/components/Toast/notify';

import { BaseModal } from '../BaseModal';
import { When } from '@/components/shared/When';
import { Silver } from '@/components/StatsComponents/Silver';
import { InventoryItem } from '@/components/Items/InventoryItem';
import { Button } from '@/components/shared/Button';
import { useModalStore } from '@/store/modal';
import { useWebsocketApi } from '@/api/websocketServer';
import { ItemIdentity, ItemStats } from '@/components/Items/ItemStats';
import { Utils } from '@/utils';

type Props = {
  isOpen?: boolean;
  inventoryItem?: InventoryItem;
  onRequestClose: (i?: InventoryItem) => void;
};

function ItemDetails({ inventoryItem }: { inventoryItem?: InventoryItem }) {
  const isOnSale = !!inventoryItem?.marketListing;
  const stack = inventoryItem?.marketListing?.stack ?? 0;
  const totalPrice = (inventoryItem?.marketListing?.price ?? 0) * (inventoryItem?.marketListing?.stack ?? 1);
  // Every copy is spoken for, so the actions above it are greyed out. Saying so
  // here is what turns a dead button into an explained one.
  const allListed = isOnSale && (inventoryItem?.stack ?? 0) <= stack;

  return (
    <div className={styles.itemDetailContainer}>
      <section className={styles.statsSection}>
        <span className={styles.sectionTitle}>Stats</span>
        <ItemStats inventoryItem={inventoryItem} showHeader={false} />
      </section>

      <When value={isOnSale}>
        {/* Spelled out — the old version was a bare "Sale" label next to a duplicate icon. */}
        <section className={styles.saleSection}>
          <span className={styles.sectionTitle}>Listed on the market</span>
          <div className={styles.saleRow}>
            <span className={styles.saleAmount}>{stack}x listed for</span>
            <Silver amount={totalPrice} />
          </div>
          <When value={allListed}>
            <span className={styles.saleLocked}>Revoke the sale to equip or enhance it</span>
          </When>
        </section>
      </When>
    </div>
  );
}

/** "Grilled Fish — Well Fed for 4 battles, party of 3" and the like. */
function describeConsume(result: ConsumeResult) {
  const parts: string[] = [];
  if (result.health) parts.push(`+${result.health} health`);
  if (result.mana) parts.push(`+${result.mana} mana`);
  if (result.buff) {
    const reach = result.buff.fed > 1 ? `, party of ${result.buff.fed}` : '';
    parts.push(`${result.buff.name} for ${result.buff.duration} battles${reach}`);
  }

  return parts.length ? `${result.item} — ${parts.join(', ')}` : `${result.item} used`;
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
    onSuccess: (result) => {
      if (!result) return;
      // Says what it actually did, because quality changes the numbers and a
      // meal's whole effect is a buff that would otherwise be invisible.
      notify(describeConsume(result), { type: 'success' });
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
    onSuccess: (success) => {
      if (!success) return;
      notify('Item unequipped', { type: 'success' });
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
    onSuccess: (success) => {
      if (!success) return;
      notify('Item equipped', { type: 'success' });
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

  // Feeding a duplicate in for a chance at the next rarity only becomes an
  // option at +5, and stops mattering at Legendary.
  const canUpgrade = !!inventoryItem && Utils.canUpgradeQuality(inventoryItem);

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <div className={styles.itemInfoContainer}>
        <header className={styles.itemHeader}>
          <InventoryItem inventoryItem={inventoryItem} customSize={46} />
          <ItemIdentity inventoryItem={inventoryItem} />
        </header>
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
          <When value={!isAlreadyEquipped}>
            <Button
              label="Equip item"
              disabled={equipItemMutation.isPending || !hasRemainingStock}
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

        {/* Secondary actions share a row so the primary action above stays dominant. */}
        <div className={styles.secondaryActions}>
          <When value={!isConsumable}>
            <Button
              label="Enhance"
              theme="neutral"
              disabled={!hasRemainingStock}
              onClick={() => {
                modalStore.setInventoryItem({ open: false });
                modalStore.setEnhanceItem({ open: true });
              }}
            />
          </When>
          {/* Only once the item is finished being enhanced — before that the
              screen has nothing to offer but a refusal. */}
          <When value={!isConsumable && canUpgrade}>
            <Button
              label="Upgrade"
              theme="neutral"
              disabled={!hasRemainingStock}
              onClick={() => {
                modalStore.setInventoryItem({ open: false });
                modalStore.setUpgradeItem({ open: true });
              }}
            />
          </When>
          <When value={hasRemainingStock}>
            <Button
              label="Sell item"
              theme="neutral"
              onClick={() => {
                modalStore.setInventoryItem({ open: false });
                modalStore.setSellItem({ open: true });
              }}
              disabled={!hasRemainingStock}
            />
          </When>
        </div>

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
      </div>
    </BaseModal>
  );
}
