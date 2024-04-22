import styles from "./style.module.scss";

type Props = {
  currentExp?: number;
  level?: number;
  minWidth?: string;
  minHeight?: string;
};

function calculateNextLevelExp(level: number) {
  let expNeeded = 0;
  let currentExp = 0;

  for (let i = 1; i < level; i++) {
    expNeeded = i * 100;
    currentExp += expNeeded;
  }

  return currentExp;
}

export default function ExperienceBar(props: Props) {
  const currentExp = props.currentExp ?? 0;
  const currentLevelExp = calculateNextLevelExp(props.level ?? 0);
  const currentLevelExpDifference = currentExp - currentLevelExp;
  const nextLevelExp = calculateNextLevelExp((props.level ?? 0) + 1);
  const currentPercentage = Math.floor(
    (currentLevelExpDifference / nextLevelExp) * 100
  );

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
