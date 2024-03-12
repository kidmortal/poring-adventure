import styles from "./style.module.scss";

type Props = {
  currentHealth: number;
  maxHealth: number;
};

export default function HealthBar(props: Props) {
  const currentPercentage = Math.floor(
    (props.currentHealth / props.maxHealth) * 100
  );

  return (
    <div className={styles.container}>
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
