import styles from "./style.module.scss";

export function Silver({ amount }: { amount?: number }) {
  return (
    <div className={styles.container}>
      <span>{amount ?? 0}</span>
      <img
        width={20}
        height={20}
        src="https://cdn.discordapp.com/emojis/651562374326779955.webp?size=96&quality=lossless"
      />
    </div>
  );
}
