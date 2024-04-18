import styles from './style.module.scss';
import { BaseModal } from '../BaseModal';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Query } from '@/store/query';
import { useMainStore } from '@/store/main';
import { useWebsocketApi } from '@/api/websocketServer';
import { FullscreenLoading } from '@/components/FullscreenLoading';
import ForEach from '@/components/ForEach';
import { GuildTaskInfo } from '@/components/GuildTaskInfo';

type Props = {
  isOpen?: boolean;
  onRequestClose: () => void;
};

export function GuildTaskSelectModal({ isOpen, onRequestClose }: Props) {
  const api = useWebsocketApi();
  const store = useMainStore();

  const query = useQuery({
    queryKey: [Query.ALL_GUILD_TASK],
    enabled: !!store.websocket,
    staleTime: Infinity,
    queryFn: () => api.guild.getGuildAvailableTasks(),
  });

  const acceptGuildTask = useMutation({
    mutationFn: (args: { taskId: number }) => api.guild.acceptGuildTask(args),
    onSuccess: () => onRequestClose(),
  });

  if (query?.status === 'pending') {
    return <FullscreenLoading info="Guild tasks" />;
  }

  return (
    <BaseModal onRequestClose={onRequestClose} isOpen={isOpen}>
      <div className={styles.container}>
        <h1>Task Selection</h1>
        <ForEach
          items={query.data}
          render={(task) => (
            <GuildTaskInfo
              onClick={() => {
                if (!acceptGuildTask.isPending) {
                  acceptGuildTask.mutate({ taskId: task.id });
                }
              }}
              guildTask={{
                task,
                remainingKills: 0,
                guildId: 0,
                guildTaskId: 0,
                id: 0,
              }}
            />
          )}
        />
      </div>
    </BaseModal>
  );
}
