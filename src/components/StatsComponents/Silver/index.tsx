import styles from './style.module.scss';
import { Utils } from '@/utils';

type Props = {
  amount?: number;
  /**
   * Show every digit. For figures a player is about to act on — what a listing
   * will actually pay out, what a purchase will actually cost — where reading
   * `1.2k` instead of `1,235` is worse than the extra width.
   */
  exact?: boolean;
};

export function Silver({ amount, exact }: Props) {
  const value = amount ?? 0;

  return (
    <div className={styles.container} title={value.toLocaleString()}>
      <span>{exact ? value.toLocaleString() : Utils.abbreviateNumber(value)}</span>
      <img
        width={20}
        height={20}
        src="https://cdn.discordapp.com/emojis/651562374326779955.webp?size=96&quality=lossless"
      />
    </div>
  );
}
