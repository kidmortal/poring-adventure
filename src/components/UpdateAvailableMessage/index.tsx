import { Updater } from "@/updater";
import { Button } from "../Button";
import styles from "./style.module.scss";

export function UpdateAvailableMessage() {
  return (
    <div className={styles.container}>
      <div className={styles.imageMessageContainer}>
        <img
          alt="poring"
          src={"https://kidmortal.sirv.com/icons/smug_poring.webp"}
        />
        <div className={styles.messageContainer}>
          <h1>An Update is available on store</h1>
        </div>
      </div>

      <Button label="Update" onClick={() => Updater.performImmediateUpdate()} />
    </div>
  );
}
