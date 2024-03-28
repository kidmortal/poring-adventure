import ForEach from "@/components/ForEach";
import styles from "./style.module.scss";
import { BaseModal } from "../BaseModal";
import { SilverStack } from "@/components/SilverStack";
import { InventoryItem } from "@/components/InventoryItem";
import dayjs from "dayjs";
import cn from "classnames";
import { Button } from "@/components/Button";

type Props = {
  isOpen?: boolean;
  notifications: UserNotification[];
  onRequestClose: () => void;
};

export function NotificationsModal(props: Props) {
  console.log(props.notifications);
  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <div className={styles.container}>
        <ForEach
          items={props.notifications}
          render={(notification) => (
            <NotificationBox
              key={notification.id}
              notification={notification}
            />
          )}
        />
      </div>
      <div className={styles.buttonsContainer}>
        <Button label="View All" />
        <Button label="Claim All" />
      </div>
    </BaseModal>
  );
}

function NotificationBox({ notification }: { notification: UserNotification }) {
  return (
    <div
      className={cn(styles.notificationContainer, {
        [styles.visualized]: notification.visualized,
      })}
    >
      <div className={styles.notificationInfoContainer}>
        <span>{dayjs(notification.createdAt).format("DD/MM/YYYY")}</span>
        <span>{notification.sender}</span>
        <span>{notification.content}</span>
      </div>
      <SilverStack amount={notification.silver} />
      <InventoryItem
        stack={notification.itemStack}
        inventoryItem={{
          id: 0,
          itemId: notification.item.id,
          userEmail: "",
          item: notification.item,
        }}
      />
    </div>
  );
}
