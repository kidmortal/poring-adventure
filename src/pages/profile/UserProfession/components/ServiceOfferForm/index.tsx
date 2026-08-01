import { useEffect, useState } from 'react';
import cn from 'classnames';
import styles from './style.module.scss';

import Input from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { When } from '@/components/shared/When';

type Props = {
  /** Whichever profession the player practices — the offer is always for it. */
  profession?: Profession;
  offer?: ServiceOffer | null;
  busy?: boolean;
  onPublish: (dto: PublishServiceOfferDto) => void;
  onRemove: () => void;
};

const DEFAULT_PRICE = 50;

/**
 * Publishing your own stamina for hire. Enhancing is only on the board for
 * professions that can enhance, so a cook never advertises smithing work.
 */
export function ServiceOfferForm({ profession, offer, busy, onPublish, onRemove }: Props) {
  const canEnhance = !!profession?.canEnhance;

  const [price, setPrice] = useState(offer?.pricePerStamina ?? DEFAULT_PRICE);
  const [crafting, setCrafting] = useState(offer?.crafting ?? true);
  const [enhancing, setEnhancing] = useState(offer?.enhancing ?? false);

  // The published offer is the source of truth: reflect it once it arrives, and
  // after every publish.
  useEffect(() => {
    if (!offer) return;
    setPrice(offer.pricePerStamina);
    setCrafting(offer.crafting);
    setEnhancing(offer.enhancing);
  }, [offer]);

  const sellsSomething = crafting || (enhancing && canEnhance);
  const canPublish = !!profession && price >= 1 && sellsSomething && !busy;

  if (!profession) {
    return <span className={styles.empty}>Learn a profession to sell your services</span>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <div className={styles.fieldHeader}>
          <span className={styles.fieldLabel}>Price per energy</span>
          <span className={styles.fieldHint}>silver</span>
        </div>
        <Input
          type="number"
          inputMode="numeric"
          min={1}
          value={price || ''}
          placeholder="50"
          onChange={(e) => setPrice(+e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <span className={styles.fieldLabel}>Services</span>
        <div className={styles.toggles}>
          <button
            type="button"
            className={cn(styles.toggle, { [styles.selected]: crafting })}
            onClick={() => setCrafting(!crafting)}
          >
            Crafting
          </button>
          <button
            type="button"
            className={cn(styles.toggle, { [styles.selected]: enhancing && canEnhance })}
            onClick={() => canEnhance && setEnhancing(!enhancing)}
            disabled={!canEnhance}
          >
            Enhancing
          </button>
        </div>
        <When value={!canEnhance}>
          <span className={styles.fieldHint}>Only a blacksmith can enhance for others</span>
        </When>
      </div>

      <Button
        label={offer ? 'Update offer' : 'Publish offer'}
        disabled={!canPublish}
        onClick={() => onPublish({ pricePerStamina: price, crafting, enhancing: enhancing && canEnhance })}
      />

      <When value={!!offer}>
        <Button label="Stop offering" theme="neutral" disabled={busy} onClick={onRemove} />
      </When>
    </div>
  );
}
