import styles from "./style.module.scss";

export function ErrorMessage({ message }: { message?: string }) {
  return (
    <div className={styles.container}>
      <img alt="poring" src="assets/sadporing.png" />
      <div className={styles.messageContainer}>
        <h1>Something went wrong</h1>
        <span>Error message</span>
        <div className={styles.errorMessage}>
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
}
