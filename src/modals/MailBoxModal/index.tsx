import ForEach from "@/components/ForEach";
import styles from "./style.module.scss";
import { BaseModal } from "../BaseModal";
import { SilverStack } from "@/components/SilverStack";
import { InventoryItem } from "@/components/InventoryItem";
import dayjs from "dayjs";
import cn from "classnames";
import { Button } from "@/components/Button";
import { useMutation } from "@tanstack/react-query";
import { useWebsocketApi } from "@/api/websocketServer";
import { When } from "@/components/When";

type Props = {
  isOpen?: boolean;
  mailBox: Mail[];
  onRequestClose: () => void;
};

export function MailBoxModal(props: Props) {
  const api = useWebsocketApi();

  const claimAllMutation = useMutation({
    mutationFn: () => api.mail.claimAll(),
  });
  const deleteAllMutation = useMutation({
    mutationFn: () => api.mail.deleteAll(),
  });

  const viewAllMutation = useMutation({
    mutationFn: () => api.mail.viewAll(),
  });

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <div className={styles.container}>
        <Button
          label="Delete all"
          theme="danger"
          onClick={() => deleteAllMutation.mutate()}
          disabled={deleteAllMutation.isPending}
        />
        <ForEach
          items={props.mailBox}
          render={(mail) => <MailContainer key={mail.id} mail={mail} />}
        />
      </div>
      <div className={styles.buttonsContainer}>
        <Button
          label="View All"
          onClick={() => viewAllMutation.mutate()}
          disabled={viewAllMutation.isPending}
        />
        <Button
          label="Claim All"
          onClick={() => claimAllMutation.mutate()}
          disabled={claimAllMutation.isPending}
        />
      </div>
    </BaseModal>
  );
}

function MailContainer({ mail }: { mail: Mail }) {
  const hasItem = !!mail.item;
  const hasSilver = mail?.silver > 0;
  return (
    <div
      className={cn(styles.mailContainer, {
        [styles.visualized]: mail.visualized,
      })}
    >
      <div className={styles.notificationInfoContainer}>
        <span>{dayjs(mail.createdAt).format("DD/MM/YYYY")}</span>
        <span>Sender: {mail.sender}</span>
        <div className={styles.messageContainer}>
          <span>{mail.content}</span>
        </div>
      </div>
      <div className={styles.rewardsContainer}>
        <When value={hasItem || hasSilver}>
          <When value={!mail.claimed}>Not claimed</When>
          <When value={mail?.claimed}>Claimed</When>
          <When value={hasSilver}>
            <SilverStack amount={mail.silver} />
          </When>
          <When value={hasItem}>
            <InventoryItem
              stack={mail.itemStack}
              customSize={32}
              inventoryItem={{
                id: 0,
                itemId: mail.item?.id,
                userEmail: "",
                item: mail.item,
              }}
            />
          </When>
        </When>
      </div>
    </div>
  );
}
