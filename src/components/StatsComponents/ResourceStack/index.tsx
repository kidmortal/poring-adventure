import styles from './style.module.scss';
import cn from 'classnames';

export type ResourceStackVariant = 'silver' | 'exp';

const ICONS: Record<ResourceStackVariant, string> = {
  silver: 'https://kidmortal.sirv.com/misc/silver.webp',
  exp: 'https://kidmortal.sirv.com/misc/exp.webp',
};

/** Reward icon with the amount overlaid — shared by SilverStack and ExpStack. */
export function ResourceStack({ variant, amount }: { variant: ResourceStackVariant; amount?: number }) {
  return (
    <div className={cn(styles.container, styles[variant])}>
      <img src={ICONS[variant]} />
      <div className={styles.overLay}>
        <span>{amount ?? 0}</span>
      </div>
    </div>
  );
}
