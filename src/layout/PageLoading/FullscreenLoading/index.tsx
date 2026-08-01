import styles from './style.module.scss';

type Props = {
  /** What is being waited on, e.g. "Player list". */
  info?: string;
};

/**
 * The one waiting screen. It sits over whatever is already on screen, so it is
 * a panel rather than a page: dimmed backdrop, the poring, and a line saying
 * what is being fetched.
 */
export function FullscreenLoading({ info }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <img className={styles.poring} alt="poring" src="assets/poring.gif" />

        <div className={styles.text}>
          <span className={styles.title}>
            Loading
            {/* Animated separately so the label itself never shifts. */}
            <span className={styles.dot}>.</span>
            <span className={styles.dot}>.</span>
            <span className={styles.dot}>.</span>
          </span>
          {!!info && <span className={styles.info}>{info}</span>}
        </div>

        <div className={styles.track}>
          <div className={styles.trackFill} />
        </div>
      </div>
    </div>
  );
}
