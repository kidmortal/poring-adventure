import styles from './style.module.scss';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Query } from '@/store/query';

import { BaseModal } from '../BaseModal';
import { Silver } from '@/components/StatsComponents/Silver';
import { InventoryItem } from '@/components/Items/InventoryItem';
import { Button } from '@/components/shared/Button';
import { useWebsocketApi } from '@/api/websocketServer';
import { useModalStore } from '@/store/modal';
import Input from '@/components/shared/Input';
import { ItemIdentity, ItemStats } from '@/components/Items/ItemStats';
import { FaMinus, FaPlus } from 'react-icons/fa';

type Props = {
  isOpen?: boolean;
  item?: InventoryItem;
  onRequestClose: (i?: InventoryItem) => void;
};

const MIN_PRICE = 1;

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

  // Whatever is already listed on the market can't be listed twice.
  const alreadyListed = item?.marketListing?.stack ?? 0;
  const availableStack = Math.max((item?.stack ?? 0) - alreadyListed, 0);

  const sellPrice = modalStore.sellItem.price ?? 0;
  const sellAmount = modalStore.sellItem.amount ?? 0;
  const hasRemainingStock = availableStack > 0;

  const amountIsValid = sellAmount >= 1 && sellAmount <= availableStack;
  const priceIsValid = sellPrice >= MIN_PRICE;
  const canSell = hasRemainingStock && amountIsValid && priceIsValid && !createMarketListingMutation.isPending;

  function changeAmount(next: number) {
    modalStore.setSellItem({ amount: Math.min(Math.max(next, 0), availableStack) });
  }

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <div className={styles.itemInfoContainer}>
        <header className={styles.itemHeader}>
          <InventoryItem inventoryItem={props.item} customSize={46} />
          <ItemIdentity inventoryItem={props.item} />
        </header>
        <ItemStats inventoryItem={props.item} showHeader={false} />
      </div>

      <div className={styles.formContainer}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Price per unit</span>
          <Input
            type="number"
            inputMode="numeric"
            min={MIN_PRICE}
            value={sellPrice || ''}
            placeholder="0"
            onChange={(e) => modalStore.setSellItem({ price: +e.target.value })}
          />
        </label>

        <div className={styles.field}>
          <div className={styles.fieldHeader}>
            <span className={styles.fieldLabel}>Amount</span>
            <span className={styles.fieldHint}>{availableStack} available</span>
          </div>
          {/* Stepper + Max: selling a stack shouldn't require the number keyboard. */}
          <div className={styles.amountRow}>
            <button
              type="button"
              className={styles.stepperButton}
              onClick={() => changeAmount(sellAmount - 1)}
              disabled={sellAmount <= 1}
              aria-label="Decrease amount"
            >
              <FaMinus />
            </button>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              max={availableStack}
              value={sellAmount || ''}
              placeholder="0"
              onChange={(e) => changeAmount(+e.target.value)}
            />
            <button
              type="button"
              className={styles.stepperButton}
              onClick={() => changeAmount(sellAmount + 1)}
              disabled={sellAmount >= availableStack}
              aria-label="Increase amount"
            >
              <FaPlus />
            </button>
            <button type="button" className={styles.maxButton} onClick={() => changeAmount(availableStack)}>
              Max
            </button>
          </div>
        </div>

        <div className={styles.totalPriceContainer}>
          <span className={styles.totalLabel}>
            Total for {sellAmount || 0}x
          </span>
          <Silver amount={sellAmount * sellPrice} />
        </div>

        <Button
          label={createMarketListingMutation.isPending ? 'Listing…' : 'List on market'}
          onClick={() => {
            if (props.item && canSell) {
              createMarketListingMutation.mutate({
                price: sellPrice,
                stack: sellAmount,
              });
            }
          }}
          disabled={!canSell}
        />

        {!hasRemainingStock && <span className={styles.warning}>Every copy of this item is already listed.</span>}
        {hasRemainingStock && !amountIsValid && (
          <span className={styles.warning}>Choose an amount between 1 and {availableStack}.</span>
        )}
        {hasRemainingStock && amountIsValid && !priceIsValid && (
          <span className={styles.warning}>Set a price of at least {MIN_PRICE} silver.</span>
        )}
      </div>
    </BaseModal>
  );
}
