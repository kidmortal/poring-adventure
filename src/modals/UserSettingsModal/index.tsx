import { BaseModal } from '../BaseModal';
import { Button } from '@/components/shared/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Query } from '@/store/query';

import SignOut from '@/assets/SignOut';
import { FaDiscord } from 'react-icons/fa';
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

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <When value={deleteUserMutation.isPending}>
        <FullscreenLoading info="Deleting character" />
      </When>
      <Button
        label="Edit Character"
        onClick={() => {
          modalStore.setUserConfig({ open: false });
          modalStore.setEditCharacter({ open: true });
        }}
      />
      <Button
        label={
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}
          >
            <FaDiscord />
            <span>Discord Integration</span>
          </div>
        }
        theme="secondary"
        onClick={() => {
          modalStore.setUserConfig({ open: false });
          modalStore.setDiscordIntegration({ open: true });
        }}
      />

      <Button
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
        label={
          <div
            style={{
              width: '100%',
              padding: '0 1.5rem',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <SignOut /> Sign out
          </div>
        }
        theme="danger"
      />
      <Button
        label="Delete my char"
        onClick={() => {
          modalStore.setUserConfig({ open: false });
          modalStore.setConfirmDeleteCharacter({ open: true });
        }}
      />
    </BaseModal>
  );
}
