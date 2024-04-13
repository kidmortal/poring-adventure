import { Button } from "../Button";
import { useModalStore } from "@/store/modal";
import MailIcon from "@/assets/Mail";
import styles from "./style.module.scss";
import { When } from "../When";
import { useUserStore } from "@/store/user";

export default function MailBoxButton() {
  const modalStore = useModalStore();
  const userStore = useUserStore();
  const notViewedMailCount = userStore.mailBox.filter((m) => !m.visualized);
  return (
    <div className={styles.container}>
      <Button
        label={<MailIcon />}
        theme="success"
        onClick={() => {
          modalStore.setUserConfig({ open: false });
          modalStore.setMailBox({ open: true });
        }}
      />
      <When value={notViewedMailCount.length > 0}>
        <span className={styles.mailCounter}>{notViewedMailCount.length}</span>
      </When>
    </div>
  );
}
