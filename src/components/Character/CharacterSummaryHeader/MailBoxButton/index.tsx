import { Button } from '../../../shared/Button';
import { useModalStore } from '@/store/modal';
import MailIcon from '@/assets/Mail';
import styles from './style.module.scss';
import { When } from '../../../shared/When';
import { useUserStore } from '@/store/user';

export default function MailBoxButton() {
  const modalStore = useModalStore();
  const userStore = useUserStore();
  // One badge for both inboxes, since one button opens both.
  const unreadCount =
    userStore.mailBox.filter((m) => !m.visualized).length + userStore.notifications.filter((n) => !n.read).length;
  return (
    <div className={styles.container}>
      <Button
        label={<MailIcon />}
        theme="success"
        className={styles.button}
        onClick={() => {
          modalStore.setUserConfig({ open: false });
          modalStore.setMailBox({ open: true });
        }}
      />
      <When value={unreadCount > 0}>
        <span className={styles.mailCounter}>{unreadCount}</span>
      </When>
    </div>
  );
}
