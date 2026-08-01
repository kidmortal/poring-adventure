import styles from './style.module.scss';

import { BaseModal } from '../BaseModal';
import { Button } from '@/components/shared/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Query } from '@/store/query';

import SignOut from '@/assets/SignOut';
import { FaDiscord, FaPen, FaTrash } from 'react-icons/fa';
import { When } from '@/components/shared/When';
import { FullscreenLoading } from '@/layout/PageLoading/FullscreenLoading';
import { useWebsocketApi } from '@/api/websocketServer';
import { useModalStore } from '@/store/modal';
import { PlataformAuth } from '@/auth';
import { useMainStore } from '@/store/main';
import { useUserStore } from '@/store/user';

type Props = {
  isOpen?: boolean;
  onRequestClose: (i?: InventoryItem) => void;
};

/** Icon and label share one row, so every action lines up down the modal. */
function ActionLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className={styles.actionLabel}>
      <span className={styles.actionIcon}>{icon}</span>
      <span>{children}</span>
    </span>
  );
}

export function UserSettingsModal(props: Props) {
  const userStore = useUserStore();
  const store = useMainStore();
  const modalStore = useModalStore();
  const api = useWebsocketApi();
  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation({
    mutationFn: () => api.users.deleteUser(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [Query.USER_CHARACTER] }),
  });

  const user = userStore.user;

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <header className={styles.header}>
        <h2>Settings</h2>
        <When value={!!user}>
          <span className={styles.subtitle}>
            {user?.name} · Lv {user?.stats?.level}
          </span>
        </When>
      </header>

      <When value={deleteUserMutation.isPending}>
        <FullscreenLoading info="Deleting character" />
      </When>

      <div className={styles.group}>
        <Button
          label={<ActionLabel icon={<FaPen />}>Edit character</ActionLabel>}
          onClick={() => {
            modalStore.setUserConfig({ open: false });
            modalStore.setEditCharacter({ open: true });
          }}
        />
        <Button
          label={<ActionLabel icon={<FaDiscord />}>Discord integration</ActionLabel>}
          theme="secondary"
          onClick={() => {
            modalStore.setUserConfig({ open: false });
            modalStore.setDiscordIntegration({ open: true });
          }}
        />
      </div>

      {/* Leaving and deleting are a different kind of action from the two above,
          which only open another screen — so they sit apart, and only the
          destructive one is red. */}
      <div className={styles.dangerGroup}>
        <Button
          theme="neutral"
          label={
            <ActionLabel
              icon={
                <span className={styles.signOutIcon}>
                  <SignOut />
                </span>
              }
            >
              Sign out
            </ActionLabel>
          }
          onClick={() =>
            PlataformAuth.SignOut({
              onSuccess: () => {
                modalStore.setUserConfig({ open: false });
                store.resetStore();
                userStore.resetStore();
                queryClient.clear();
              },
            })
          }
        />
        <Button
          theme="danger"
          label={<ActionLabel icon={<FaTrash />}>Delete my character</ActionLabel>}
          onClick={() => {
            modalStore.setUserConfig({ open: false });
            modalStore.setConfirmDeleteCharacter({ open: true });
          }}
        />
      </div>
    </BaseModal>
  );
}
