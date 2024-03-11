import styles from "./style.module.scss";

type Props = {
  info?: string;
};

export function FullscreenLoading(props: Props) {
  return (
    <div className={styles.fullScreenOverlay}>
      <div className={styles.loadingContainer}>
        <img alt="poring" src="assets/poring.gif" />
        <span>Loading...</span>
      </div>
      <div className={styles.extraInfo}>{props?.info}</div>
    </div>
  );
}
