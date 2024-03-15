import styles from "./style.module.scss";

type Props = {
  currentExp?: number;
  level?: number;
  minWidth?: string;
  minHeight?: string;
};
function calculateNextLevelExp(level: number) {
  return level * 100 * 1.2;
}

export default function ExperienceBar(props: Props) {
  const currentExp = props.currentExp ?? 0;
  const nextLevelExp = calculateNextLevelExp(props.level ?? 0);
  const currentPercentage = Math.floor((currentExp / nextLevelExp) * 100);

  return (
    <div
      className={styles.container}
      style={{ minWidth: props.minWidth, minHeight: props.minHeight }}
    >
      <span>Exp {currentExp}</span>

      <div
        style={{
          width: `${currentPercentage > 100 ? 100 : currentPercentage}%`,
        }}
        className={styles.fillColor}
      />
    </div>
  );
}
