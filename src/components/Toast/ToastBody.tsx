import { ReactNode } from 'react';

import styles from './style.module.scss';

/** One toast: the message, and how many times it has arrived. */
export function ToastBody({ text, count }: { text: ReactNode; count: number }) {
  return (
    <div className={styles.body}>
      <span className={styles.text}>{text}</span>
      {count > 1 && <span className={styles.count}>×{count}</span>}
    </div>
  );
}
