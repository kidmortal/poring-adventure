import styles from './style.module.scss';
import { CharacterHead } from '../CharacterInfo';
import { Silver } from '../../Silver';
import { When } from '../../shared/When';
import { useMainStore } from '@/store/main';
import { Button } from '../../shared/Button';
import { useModalStore } from '@/store/modal';
import { Settings } from '@/assets/Settings';
import MailBoxButton from './MailBoxButton';
import { useUserStore } from '@/store/user';

export function CharacterSummaryHeader() {
  const store = useMainStore();
  const userStore = useUserStore();
  const modalStore = useModalStore();

  if (!userStore.user) {
    return <></>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.characterInfo}>
        <div className={styles.nameContainer}>
          <CharacterHead
            gender={userStore.user.appearance?.gender ?? 'female'}
            head={userStore.user.appearance?.head ?? ''}
          />
          <h2>{userStore.user.name}</h2>
        </div>

        <Silver amount={userStore.user.silver} />
      </div>

      <div className={styles.buttons}>
        <MailBoxButton />
        <When value={store.loggedUserInfo.loggedIn}>
          <Button
            onClick={() => {
              modalStore.setUserConfig({
                open: true,
              });
            }}
            label={<Settings />}
            theme="danger"
          />
        </When>
      </div>
    </div>
  );
}
