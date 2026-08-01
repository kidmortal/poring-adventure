import { useEffect, useState } from 'react';
import cn from 'classnames';
import dayjs from 'dayjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaHammer, FaBoxOpen, FaBell } from 'react-icons/fa';

import styles from './style.module.scss';
import { BaseModal } from '../BaseModal';
import ForEach from '@/components/shared/ForEach';
import { Button } from '@/components/shared/Button';
import { TabOption, Tabs } from '@/components/shared/Tabs';
import { When } from '@/components/shared/When';
import { SilverStack } from '@/components/StatsComponents/SilverStack';
import { InventoryItem } from '@/components/Items/InventoryItem';
import { useWebsocketApi } from '@/api/websocketServer';
import { useUserStore } from '@/store/user';
import { Query } from '@/store/query';

type MailTab = 'mail' | 'notifications';

type Props = {
  isOpen?: boolean;
  mailBox: Mail[];
  onRequestClose: () => void;
};

/** Two inboxes: mail carries rewards to claim, notifications only tell you what happened. */
export function MailBoxModal(props: Props) {
  const api = useWebsocketApi();
  const queryClient = useQueryClient();
  const userStore = useUserStore();
  const [showing, setShowing] = useState<MailTab>('mail');

  const claimAllMutation = useMutation({
    mutationFn: () => api.mail.claimAll(),
  });
  const deleteAllMutation = useMutation({
    mutationFn: () => api.mail.deleteAll(),
  });
  const viewAllMutation = useMutation({
    mutationFn: () => api.mail.viewAll(),
  });

  const clearNotificationsMutation = useMutation({
    mutationFn: () => api.mail.deleteAllNotifications(),
    onSettled: () => queryClient.invalidateQueries({ queryKey: [Query.NOTIFICATIONS] }),
  });

  const readNotificationsMutation = useMutation({
    mutationFn: () => api.mail.readAllNotifications(),
  });

  const notifications = userStore.notifications;
  const unclaimedMail = props.mailBox.filter((mail) => !mail.claimed).length;
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  // Opening the tab is what marks them read — there is nothing else to do with
  // a notification.
  useEffect(() => {
    if (props.isOpen && showing === 'notifications' && unreadNotifications > 0) {
      readNotificationsMutation.mutate();
    }
  }, [props.isOpen, showing, unreadNotifications]);

  const tabs: TabOption<MailTab>[] = [
    { value: 'mail', label: 'Mail', badge: unclaimedMail },
    { value: 'notifications', label: 'Activity', badge: unreadNotifications },
  ];

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <Tabs options={tabs} selected={showing} onSelect={setShowing} />

      <div className={styles.list}>
        <When value={showing === 'mail'}>
          <When value={props.mailBox.length === 0}>
            <span className={styles.empty}>Your mailbox is empty</span>
          </When>
          <ForEach items={props.mailBox} render={(mail) => <MailRow key={mail.id} mail={mail} />} />
        </When>

        <When value={showing === 'notifications'}>
          <When value={notifications.length === 0}>
            <span className={styles.empty}>Nothing has happened yet</span>
          </When>
          <ForEach items={notifications} render={(n) => <NotificationRow key={n.id} notification={n} />} />
        </When>
      </div>

      <div className={styles.actions}>
        <When value={showing === 'mail'}>
          <Button
            label="Mark read"
            theme="neutral"
            onClick={() => viewAllMutation.mutate()}
            disabled={viewAllMutation.isPending}
          />
          <Button
            label={unclaimedMail > 0 ? `Claim ${unclaimedMail}` : 'Claim all'}
            onClick={() => claimAllMutation.mutate()}
            disabled={claimAllMutation.isPending || unclaimedMail === 0}
          />
          <Button
            label="Delete claimed"
            theme="danger"
            onClick={() => deleteAllMutation.mutate()}
            disabled={deleteAllMutation.isPending}
          />
        </When>

        <When value={showing === 'notifications'}>
          <Button
            label="Clear all"
            theme="danger"
            onClick={() => clearNotificationsMutation.mutate()}
            disabled={clearNotificationsMutation.isPending || notifications.length === 0}
          />
        </When>
      </div>
    </BaseModal>
  );
}

function MailRow({ mail }: { mail: Mail }) {
  const hasItem = !!mail.item;
  const hasSilver = mail.silver > 0;
  const hasReward = hasItem || hasSilver;

  return (
    <div className={cn(styles.row, { [styles.read]: mail.visualized, [styles.unclaimed]: hasReward && !mail.claimed })}>
      <div className={styles.rowText}>
        <div className={styles.rowHeader}>
          <span className={styles.sender}>{mail.sender}</span>
          <span className={styles.date}>{dayjs(mail.createdAt).format('DD/MM/YYYY')}</span>
        </div>
        <span className={styles.message}>{mail.content}</span>
        <When value={hasReward}>
          <span className={cn(styles.status, { [styles.claimed]: mail.claimed })}>
            {mail.claimed ? 'Claimed' : 'Waiting to be claimed'}
          </span>
        </When>
      </div>

      <When value={hasReward}>
        <div className={styles.rewards}>
          <When value={hasSilver}>
            <SilverStack amount={mail.silver} />
          </When>
          <When value={hasItem}>
            <InventoryItem
              stack={mail.itemStack}
              customSize={38}
              inventoryItem={{
                id: 0,
                itemId: mail.item?.id,
                userEmail: '',
                item: mail.item,
                stack: 1,
                equipped: false,
                locked: false,
                enhancement: 0,
                quality: 0,
              }}
            />
          </When>
        </div>
      </When>
    </div>
  );
}

/** The icon says what kind of job it was without reading the title. */
function NotificationIcon({ type }: { type: string }) {
  if (type === 'hired_enhance') return <FaHammer />;
  if (type === 'hired_craft') return <FaBoxOpen />;
  return <FaBell />;
}

function NotificationRow({ notification }: { notification: GameNotification }) {
  return (
    <div className={cn(styles.row, { [styles.read]: notification.read })}>
      <span className={styles.icon}>
        <NotificationIcon type={notification.type} />
      </span>

      <div className={styles.rowText}>
        <div className={styles.rowHeader}>
          <span className={styles.title}>{notification.title}</span>
          <span className={styles.date}>{dayjs(notification.createdAt).format('DD/MM HH:mm')}</span>
        </div>
        <span className={styles.message}>{notification.message}</span>
        {/* Already paid when the job ran — this is a receipt, not a reward. */}
        <div className={styles.earnings}>
          <When value={notification.silver > 0}>
            <span className={styles.silverEarned}>+{notification.silver} silver</span>
          </When>
          <When value={notification.experience > 0}>
            <span className={styles.expEarned}>+{notification.experience} exp</span>
          </When>
        </div>
      </div>
    </div>
  );
}
