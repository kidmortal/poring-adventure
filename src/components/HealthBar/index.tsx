import styles from "./style.module.scss";

type Props = {
  currentHealth: number;
  maxHealth: number;
  minWidth?: string;
};

export default function HealthBar(props: Props) {
  const currentPercentage = Math.floor(
    (props.currentHealth / props.maxHealth) * 100
  );

  return (
    <div className={styles.container} style={{ minWidth: props.minWidth }}>
      <span>
        HP {props.currentHealth}/{props.maxHealth}
      </span>

      <div
        style={{
          width: `${currentPercentage > 100 ? 100 : currentPercentage}%`,
        }}
        className={styles.fillColor}
      />
    </div>
  );
}
