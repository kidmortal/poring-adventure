import { useEffect, useState } from 'react';
import cn from 'classnames';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FaGift, FaMinus, FaPlus, FaTimes } from 'react-icons/fa';

import styles from './style.module.scss';
import { BaseModal } from '../BaseModal';
import ForEach from '@/components/shared/ForEach';
import Input from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { When } from '@/components/shared/When';
import { InventoryItem } from '@/components/Items/InventoryItem';
import { Silver } from '@/components/StatsComponents/Silver';
import { useWebsocketApi } from '@/api/websocketServer';
import { useUserStore } from '@/store/user';

type Props = {
  isOpen?: boolean;
  user?: User;
  onRequestClose: () => void;
};

/**
 * Handing something to another player. It travels as mail for them to claim,
 * and nothing is taken on the way — what goes in is what arrives.
 */
export function GiftModal({ isOpen, user, onRequestClose }: Props) {
  const api = useWebsocketApi();
  const userStore = useUserStore();

  const [silver, setSilver] = useState(0);
  const [message, setMessage] = useState('');
  const [selected, setSelected] = useState<InventoryItem>();
  const [stack, setStack] = useState(1);

  // A gift is composed per recipient: reopening for someone else starts clean.
  useEffect(() => {
    if (!isOpen) return;
    setSilver(0);
    setMessage('');
    setSelected(undefined);
    setStack(1);
  }, [isOpen, user?.email]);

  const giftMutation = useMutation({
    mutationFn: () =>
      api.mail.sendGift({
        receiverEmail: user?.email ?? '',
        silver: silver || undefined,
        inventoryId: selected?.id,
        stack: selected ? stack : undefined,
        message: message.trim() || undefined,
      }),
    onSuccess: (sent) => {
      if (!sent) return;
      toast(`Gift sent to ${user?.name}`, { type: 'success', autoClose: 1500 });
      onRequestClose();
    },
  });

  const mySilver = userStore.user?.silver ?? 0;
  // Equipped, locked and listed stacks are off limits server side, so they are
  // not offered here either.
  const giftable = (userStore.user?.inventory ?? []).filter(
    (item) => !item.equipped && !item.locked && !item.marketListing,
  );

  const maxStack = selected?.stack ?? 1;
  const givesSomething = silver > 0 || !!selected;

  let blockedReason: string | undefined;
  if (!user) blockedReason = 'No recipient';
  else if (!givesSomething) blockedReason = 'Add silver or an item';
  else if (silver > mySilver) blockedReason = 'You do not have that much';

  function pickItem(item: InventoryItem) {
    const isSame = selected?.id === item.id;
    setSelected(isSame ? undefined : item);
    setStack(1);
  }

  function changeStack(next: number) {
    setStack(Math.min(Math.max(next, 1), maxStack));
  }

  return (
    <BaseModal isOpen={isOpen} onRequestClose={onRequestClose}>
      <header className={styles.header}>
        <span className={styles.headerIcon}>
          <FaGift />
        </span>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Send a gift</h2>
          <span className={styles.subtitle}>to {user?.name}</span>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Silver</span>
          <span className={styles.hint}>
            you have <Silver amount={mySilver} />
          </span>
        </div>
        <div className={styles.silverRow}>
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            max={mySilver}
            value={silver || ''}
            placeholder="0"
            onChange={(e) => setSilver(Math.max(Math.min(+e.target.value, mySilver), 0))}
          />
          <button type="button" className={styles.maxButton} onClick={() => setSilver(mySilver)}>
            All
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Item</span>
          <When value={!!selected}>
            <button type="button" className={styles.clearButton} onClick={() => setSelected(undefined)}>
              <FaTimes /> clear
            </button>
          </When>
        </div>

        <When value={giftable.length === 0}>
          <span className={styles.empty}>Nothing in your bags is free to give</span>
        </When>

        <div className={styles.itemGrid}>
          <ForEach
            items={giftable}
            render={(item) => (
              <div
                key={item.id}
                className={cn(styles.itemSlot, { [styles.selectedItem]: selected?.id === item.id })}
                onClick={() => pickItem(item)}
              >
                <InventoryItem inventoryItem={item} customSize={38} />
              </div>
            )}
          />
        </div>

        {/* Only stacks need an amount, and only up to what is in the stack. */}
        <When value={!!selected && maxStack > 1}>
          <div className={styles.stackRow}>
            <button
              type="button"
              className={styles.stepperButton}
              onClick={() => changeStack(stack - 1)}
              disabled={stack <= 1}
              aria-label="Decrease amount"
            >
              <FaMinus />
            </button>
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              max={maxStack}
              value={stack}
              onChange={(e) => changeStack(+e.target.value)}
            />
            <button
              type="button"
              className={styles.stepperButton}
              onClick={() => changeStack(stack + 1)}
              disabled={stack >= maxStack}
              aria-label="Increase amount"
            >
              <FaPlus />
            </button>
            <button type="button" className={styles.maxButton} onClick={() => changeStack(maxStack)}>
              Max
            </button>
          </div>
        </When>
      </section>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>Message</span>
        <Input
          type="text"
          maxLength={120}
          value={message}
          placeholder="Optional note"
          onChange={(e) => setMessage(e.target.value)}
        />
      </section>

      <span className={styles.freeNote}>Gifts arrive in their mailbox in full — nothing is taken.</span>

      <Button
        className={styles.send}
        theme={blockedReason ? 'neutral' : 'primary'}
        disabled={!!blockedReason || giftMutation.isPending}
        label={
          <span className={styles.sendLabel}>
            <FaGift />
            {blockedReason ?? (giftMutation.isPending ? 'Sending…' : 'Send gift')}
          </span>
        }
        onClick={() => giftMutation.mutate()}
      />
    </BaseModal>
  );
}
