import styles from './style.module.scss';
import { BaseModal } from '../BaseModal';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Query } from '@/store/query';
import { useMainStore } from '@/store/main';
import { useWebsocketApi } from '@/api/websocketServer';
import { FullscreenLoading } from '@/layout/PageLoading/FullscreenLoading';
import ForEach from '@/components/shared/ForEach';
import { GuildTaskOffer } from './GuildTaskOffer';

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

  const tasks = query.data ?? [];

  return (
    <BaseModal onRequestClose={onRequestClose} isOpen={isOpen}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2>Guild tasks</h2>
          <span className={styles.subtitle}>Pick one contract for your guild</span>
        </header>

        {tasks.length === 0 ? (
          <span className={styles.empty}>No tasks are available right now.</span>
        ) : (
          <div className={styles.taskList}>
            <ForEach
              items={tasks}
              render={(task) => (
                <GuildTaskOffer
                  key={task.id}
                  task={task}
                  disabled={acceptGuildTask.isPending}
                  onSelect={() => acceptGuildTask.mutate({ taskId: task.id })}
                />
              )}
            />
          </div>
        )}
      </div>
    </BaseModal>
  );
}
