import { useMutation } from '@tanstack/react-query';

import styles from './style.module.scss';
import { BaseModal } from '../BaseModal';

import { useWebsocketApi } from '@/api/websocketServer';
import { Button } from '@/components/shared/Button';
import { When } from '@/components/shared/When';
import { useUserStore } from '@/store/user';

type Props = {
  isOpen?: boolean;
  /** The profession the user picked and is about to swap to. */
  profession?: Profession;
  onRequestClose: () => void;
};

/**
 * A player only ever practices one profession, so picking another one throws
 * away the current one's level for good. That is not something to find out
 * after the fact, hence the confirmation.
 */
export function SwapProfessionModal({ isOpen, profession, onRequestClose }: Props) {
  const api = useWebsocketApi();
  const userStore = useUserStore();

  const current = userStore.user?.professions?.[0];

  const swapMutation = useMutation({
    mutationFn: (professionId: number) => api.professions.learnProfession({ professionId }),
    // The server pushes a fresh profile over `user_update`, so there is nothing
    // to refetch here — just close.
    onSuccess: () => onRequestClose(),
  });

  return (
    <BaseModal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className={styles.container}>
        <h2 className={styles.title}>Swap profession?</h2>

        <div className={styles.swapRow}>
          <div className={styles.side}>
            <span className={styles.icon}>{current?.profession.icon}</span>
            <span className={styles.name}>{current?.profession.name}</span>
            <span className={styles.level}>Lv {current?.level}</span>
          </div>
          <span className={styles.arrow}>→</span>
          <div className={styles.side}>
            <span className={styles.icon}>{profession?.icon}</span>
            <span className={styles.name}>{profession?.name}</span>
            <span className={styles.level}>Lv 1</span>
          </div>
        </div>

        <p className={styles.warning}>
          Leaving <strong>{current?.profession.name}</strong> resets it to level 1 and wipes its experience. Coming back
          to it later means starting over.
        </p>

        <Button
          label={swapMutation.isPending ? 'Swapping...' : `Yes, become ${profession?.name}`}
          theme="danger"
          disabled={swapMutation.isPending || !profession}
          onClick={() => profession && swapMutation.mutate(profession.id)}
        />
        <Button label="Cancel" theme="neutral" disabled={swapMutation.isPending} onClick={onRequestClose} />

        <When value={swapMutation.isError}>
          <span className={styles.error}>Could not swap profession</span>
        </When>
      </div>
    </BaseModal>
  );
}
