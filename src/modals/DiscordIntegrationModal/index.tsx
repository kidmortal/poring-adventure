import { Button } from '@/components/Button';
import styles from './style.module.scss';
import { BaseModal } from '../BaseModal';
import { useWebsocketApi } from '@/api/websocketServer';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { When } from '@/components/When';
import { toast } from 'react-toastify';
import { Query } from '@/store/query';
import { useMainStore } from '@/store/main';

type Props = {
  isOpen?: boolean;
  onRequestClose: (i?: InventoryItem) => void;
};

export function DiscordIntegrationModal(props: Props) {
  const [token, setToken] = useState<string | undefined>('');
  const store = useMainStore();
  const api = useWebsocketApi();

  const discordProfile = useQuery({
    queryKey: [Query.DISCORD],
    enabled: !!store.websocket && props.isOpen,
    queryFn: () => api.discord.getProfile(),
    staleTime: 1000 * 5,
  });

  const createTokenMutation = useMutation({
    mutationFn: () => api.discord.createToken(),
    onSuccess: (value) => {
      setToken(value);
    },
  });

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <When value={!discordProfile.isFetching}>
        <div className={styles.container}>
          <When value={!!discordProfile.data?.discordId}>
            <img src={discordProfile.data?.url} />
            <span>ID: {discordProfile.data?.discordId}</span>
            <span>username: {discordProfile.data?.name}</span>
            <Button label="Unlink Discord" theme="danger" />
          </When>
          <When value={!discordProfile.data?.discordId}>
            <span>Invite the bot to your server</span>
            <span>and use /login {`{code}`}</span>
            <When value={token !== ''}>
              <span>Click to copy</span>
              <div
                className={styles.codeDisplay}
                onClick={() => {
                  if (token) {
                    navigator.clipboard.writeText(token);
                  }
                  toast('Token copied to clipboard', { autoClose: 1000 });
                }}
              >
                <span>{token}</span>
              </div>
            </When>
            <When value={token === ''}>
              <Button
                label="Generate code"
                onClick={() => createTokenMutation.mutate()}
                disabled={createTokenMutation.isPending}
              />
            </When>
          </When>
        </div>
      </When>
    </BaseModal>
  );
}
