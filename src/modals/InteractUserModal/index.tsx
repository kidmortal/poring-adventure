import { BaseModal } from '../BaseModal';

import { useMutation } from '@tanstack/react-query';

import { CharacterInfo } from '@/components/CharacterInfo';
import { Button } from '@/components/Button';
import { useWebsocketApi } from '@/api/websocketServer';
import { useUserStore } from '@/store/user';

type Props = {
  isOpen?: boolean;
  user?: User;
  onRequestClose: (i?: InventoryItem) => void;
};

export function InteractUserModal(props: Props) {
  const userStore = useUserStore();
  const api = useWebsocketApi();

  const inviteUserMutation = useMutation({
    mutationFn: (email: string) =>
      api.party.inviteToParty({ invitedEmail: email, partyId: userStore.user?.partyId ?? 0 }),
    onSuccess: () => {
      props.onRequestClose();
    },
  });

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <CharacterInfo
        costume={props.user?.appearance.costume ?? ''}
        gender={props.user?.appearance.gender ?? 'female'}
        head={props.user?.appearance.head ?? ''}
      />
      <Button
        label="Invite to party"
        onClick={() => {
          if (props.user?.email) {
            inviteUserMutation.mutate(props.user?.email);
          }
        }}
        disabled={inviteUserMutation.isPending}
      />
    </BaseModal>
  );
}
