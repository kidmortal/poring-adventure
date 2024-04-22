import styles from "./style.module.scss";

export function SilverStack({ amount }: { amount?: number }) {
  return (
    <div className={styles.container}>
      <img src="https://kidmortal.sirv.com/misc/silver.webp" />
      <div className={styles.overLay}>
        <span>{amount ?? 0}</span>
      </div>
    </div>
  );
}
