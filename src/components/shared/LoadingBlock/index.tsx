import styles from './style.module.scss';

type Props = {
  /** What is being waited on, e.g. "Loading maps". */
  info?: string;
};

/**
 * In-page waiting state. Unlike FullscreenLoading it does not cover the app —
 * it fills the region whose data has not arrived, so the tabs and navigation
 * around it stay usable.
 */
export function LoadingBlock({ info }: Props) {
  return (
    <div className={styles.container}>
      <img className={styles.poring} alt="poring" src="assets/poring.gif" />
      <span className={styles.info}>{info ?? 'Loading'}</span>
      <div className={styles.track}>
        <div className={styles.trackFill} />
      </div>
    </div>
  );
}
