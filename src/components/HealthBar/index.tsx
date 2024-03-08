import styles from "./style.module.scss";

type Props = {
  currentHealth: number;
  maxHealth: number;
};

export default function HealthBar(props: Props) {
  return (
    <div className={styles.container}>
      HP {props.currentHealth}/{props.maxHealth}
    </div>
  );
}
