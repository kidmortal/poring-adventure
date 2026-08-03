import styles from './style.module.scss';
import cn from 'classnames';
import { Utils } from '@/utils';

export type ResourceStackVariant = 'silver' | 'exp';

const ICONS: Record<ResourceStackVariant, string> = {
  silver: 'https://kidmortal.sirv.com/misc/silver.webp',
  exp: 'https://kidmortal.sirv.com/misc/exp.webp',
};

/**
 * Reward icon with its amount — shared by SilverStack and ExpStack.
 *
 * The amount sits beside the icon rather than on top of it. It used to be
 * absolutely positioned over the sprite, which held together for two or three
 * digits and then wrote a four figure reward straight across the coin.
 *
 * `title` keeps the exact figure one hover away, since the label itself is
 * abbreviated once it passes a thousand.
 */
export function ResourceStack({ variant, amount }: { variant: ResourceStackVariant; amount?: number }) {
  const value = amount ?? 0;

  return (
    <div className={cn(styles.container, styles[variant])} title={value.toLocaleString()}>
      <img src={ICONS[variant]} alt={variant} />
      <span className={styles.amount}>{Utils.abbreviateNumber(value)}</span>
    </div>
  );
}
