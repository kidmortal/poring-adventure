import styles from "./style.module.scss";

export function FullscreenLoading() {
  return (
    <div className={styles.fullScreenOverlay}>
      <img alt="poring" src="assets/poring.gif" />
      <span>Loading...</span>
    </div>
  );
}
