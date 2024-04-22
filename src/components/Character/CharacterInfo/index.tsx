import cn from 'classnames';
import styles from './style.module.scss';
import { useState } from 'react';

export function CharacterHead({
  gender,
  head,
  className,
}: {
  head: string;
  gender: 'male' | 'female';
  className?: string;
}) {
  return (
    <img
      className={cn(styles.isolatedHeadContainer, className)}
      src={`https://kidmortal.sirv.com/heads/${gender}/${head}/front.png`}
    />
  );
}

export function CharacterInfo({
  costume,
  gender,
  head,
  orientation = 'front',
  onClick,
}: {
  costume: string;
  head: string;
  gender: 'male' | 'female';
  orientation?: 'front' | 'back';
  onClick?: () => void;
}) {
  const [assetLoaded, setAssetLoaded] = useState(false);
  return (
    <div className={styles.characterContainer} onClick={onClick}>
      <div className={cn(styles.character, { [styles.hidden]: !assetLoaded })}>
        <img className={styles.head} src={`https://kidmortal.sirv.com/heads/${gender}/${head}/${orientation}.png`} />
        <img
          className={styles.body}
          src={`https://kidmortal.sirv.com/bodys/${gender}/${costume}/${orientation}.png`}
          onLoad={() => setAssetLoaded(true)}
        />
      </div>
    </div>
  );
}
