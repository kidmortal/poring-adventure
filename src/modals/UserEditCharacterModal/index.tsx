import { BaseModal } from '../BaseModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Query } from '@/store/query';
import { When } from '@/components/shared/When';
import { FullscreenLoading } from '@/layout/PageLoading/FullscreenLoading';
import { useWebsocketApi } from '@/api/websocketServer';
import { CharacterWithHealthBar } from '@/components/Character/CharacterWithHealthBar';
import { useState } from 'react';
import Input from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { useUserStore } from '@/store/user';

type Props = {
  isOpen?: boolean;
  onRequestClose: (i?: InventoryItem) => void;
};

export function UserEditCharacterModal(props: Props) {
  const [newName, setNewName] = useState('');
  const userStore = useUserStore();
  const api = useWebsocketApi();
  const queryClient = useQueryClient();

  const changeNameMutation = useMutation({
    mutationFn: () => api.users.updateUserName(newName),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [Query.USER_CHARACTER] }),
  });

  const validName = newName.length > 3;

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <When value={changeNameMutation.isPending}>
        <FullscreenLoading info="Update user Name" />
      </When>
      <CharacterWithHealthBar user={userStore.user} />
      <Input placeholder="New name" value={newName} onChange={(e) => setNewName(e.target.value)} />
      <Button
        label="Change name"
        onClick={() => changeNameMutation.mutate()}
        disabled={changeNameMutation.isPending || !validName}
      />
    </BaseModal>
  );
}
