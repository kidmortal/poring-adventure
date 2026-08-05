import styles from './style.module.scss';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notify } from '@/components/Toast/notify';
import { FaMinus, FaPlus } from 'react-icons/fa';

import { Query } from '@/store/query';

import { BaseModal } from '../BaseModal';
import { Silver } from '@/components/StatsComponents/Silver';
import { InventoryItem } from '@/components/Items/InventoryItem';
import { Button } from '@/components/shared/Button';
import { useWebsocketApi } from '@/api/websocketServer';
import { useModalStore } from '@/store/modal';
import { useUserStore } from '@/store/user';
import Input from '@/components/shared/Input';
import { ItemIdentity, ItemStats } from '@/components/Items/ItemStats';

type Props = {
  isOpen?: boolean;
  item?: MarketListing;
  onRequestClose: (i?: InventoryItem) => void;
};

/** The buying side of SellItemModal — same header, stepper, total box and warnings. */
export function BuyItemModal(props: Props) {
  const api = useWebsocketApi();
  const modalStore = useModalStore();
  const userStore = useUserStore();
  const queryClient = useQueryClient();

  const purchaseMutation = useMutation({
    mutationFn: (args: { listingId: number; amount: number }) =>
      api.market.purchaseMarketListing({
        marketListingId: args.listingId,
        stack: args.amount,
      }),
    onSuccess: () => {
      props.onRequestClose();
      notify('Purchase successful', { type: 'success' });
      queryClient.refetchQueries({
        queryKey: [Query.ALL_MARKET],
      });
      queryClient.refetchQueries({
        queryKey: [Query.USER_CHARACTER],
      });
    },
  });

  const listing = props.item;
  const unitPrice = listing?.price ?? 0;
  const stock = listing?.stack ?? 0;
  const silver = userStore.user?.silver ?? 0;

  const buyingAmount = modalStore.buyItem.amount ?? 0;
  const totalPrice = buyingAmount * unitPrice;

  // Two ceilings on a purchase: the seller's stock and your wallet.
  const affordableStack = unitPrice > 0 ? Math.floor(silver / unitPrice) : stock;
  const maxAmount = Math.min(stock, affordableStack);

  const amountIsValid = buyingAmount >= 1 && buyingAmount <= stock;
  const canAfford = totalPrice <= silver;
  const canBuy = stock > 0 && amountIsValid && canAfford && !purchaseMutation.isPending;

  function changeAmount(next: number) {
    modalStore.setBuyItem({ amount: Math.min(Math.max(next, 0), stock) });
  }

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <div className={styles.itemInfoContainer}>
        <header className={styles.itemHeader}>
          <InventoryItem inventoryItem={listing?.inventory} customSize={46} />
          <ItemIdentity inventoryItem={listing?.inventory} />
        </header>
        <ItemStats inventoryItem={listing?.inventory} showHeader={false} />
      </div>

      <div className={styles.formContainer}>
        <div className={styles.field}>
          <div className={styles.fieldHeader}>
            <span className={styles.fieldLabel}>Seller</span>
            <span className={styles.fieldHint}>{stock} in stock</span>
          </div>
          <div className={styles.sellerRow}>
            <span className={styles.sellerName}>{listing?.seller?.name}</span>
            <div className={styles.unitPrice}>
              <Silver amount={unitPrice} exact />
              <span className={styles.unitSuffix}>each</span>
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.fieldHeader}>
            <span className={styles.fieldLabel}>Amount</span>
            <span className={styles.fieldHint}>
              You have <Silver amount={silver} exact />
            </span>
          </div>
          {/* Stepper + Max, same as selling: the number keyboard is the slow path. */}
          <div className={styles.amountRow}>
            <button
              type="button"
              className={styles.stepperButton}
              onClick={() => changeAmount(buyingAmount - 1)}
              disabled={buyingAmount <= 1}
              aria-label="Decrease amount"
            >
              <FaMinus />
            </button>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              max={stock}
              value={buyingAmount || ''}
              placeholder="0"
              onChange={(e) => changeAmount(+e.target.value)}
            />
            <button
              type="button"
              className={styles.stepperButton}
              onClick={() => changeAmount(buyingAmount + 1)}
              disabled={buyingAmount >= stock}
              aria-label="Increase amount"
            >
              <FaPlus />
            </button>
            {/* Max is what the wallet can actually pay for, not the whole stock. */}
            <button
              type="button"
              className={styles.maxButton}
              onClick={() => changeAmount(maxAmount)}
              disabled={maxAmount < 1}
            >
              Max
            </button>
          </div>
        </div>

        <div className={styles.totalPriceContainer}>
          <span className={styles.totalLabel}>Total for {buyingAmount || 0}x</span>
          <Silver amount={totalPrice} exact />
        </div>

        <Button
          label={purchaseMutation.isPending ? 'Buying…' : 'Buy item'}
          onClick={() => {
            if (listing && canBuy) {
              purchaseMutation.mutate({ listingId: listing.id, amount: buyingAmount });
            }
          }}
          disabled={!canBuy}
        />

        {stock < 1 && <span className={styles.warning}>This listing is sold out.</span>}
        {stock > 0 && !amountIsValid && <span className={styles.warning}>Choose an amount between 1 and {stock}.</span>}
        {stock > 0 && amountIsValid && !canAfford && (
          <span className={styles.warning}>
            {maxAmount > 0 ? `You are too poor for that — you can afford ${maxAmount}x` : 'You are too poor for that'}
          </span>
        )}
      </div>
    </BaseModal>
  );
}
