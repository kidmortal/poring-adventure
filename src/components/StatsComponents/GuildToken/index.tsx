import cn from 'classnames';
import styles from './style.module.scss';

export const GUILD_TOKEN_IMAGE = 'https://kidmortal.sirv.com/misc/guild_token.webp';

/** Guild tokens: earned by guild tasks and the guild boss, spent in the guild store. */
export function GuildToken({ amount, className, size = 20 }: { amount?: number; className?: string; size?: number }) {
  return (
    <div className={cn(styles.container, className)} title="Guild tokens">
      <span>{amount ?? 0}</span>
      <img width={size} height={size} src={`${GUILD_TOKEN_IMAGE}?w=${size * 2}&h=${size * 2}`} />
    </div>
  );
}
