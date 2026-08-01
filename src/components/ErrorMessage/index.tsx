import styles from './style.module.scss';

/** A dead end: something failed and the screen has nothing else to show. */
export function ErrorMessage({ message }: { message?: string }) {
  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <img className={styles.poring} alt="poring" src="assets/sadporing.png" />
        <h1 className={styles.title}>Something went wrong</h1>
        {!!message && <span className={styles.message}>{message}</span>}
      </div>
    </div>
  );
}
