import styles from './style.module.scss';

import { useWebsocketApi } from '@/api/websocketServer';
import { useMutation } from '@tanstack/react-query';

import { When } from '@/components/shared/When';
import ForEach from '@/components/shared/ForEach';

import cn from 'classnames';
import { useModalStore } from '@/store/modal';
import { GuildTaskInfo } from '@/components/GuildTaskInfo';
import { useUserStore } from '@/store/user';
import { useState } from 'react';
import { GuildApplicationInfo } from './components/GuildApplicationInfo';
import { GuildInfo } from './components/GuildInfo';
import { GuidMemberInfo } from './components/GuildMemberInfo';
import { GuildMenu } from './components/GuildMenu';
import Switch from '@/components/shared/Switch';

export function GuildPage() {
  const [showing, setShowing] = useState<'members' | 'applications'>('members');
  const userStore = useUserStore();
  const modalStore = useModalStore();
  const api = useWebsocketApi();

  const finishTaskMutation = useMutation({
    mutationFn: () => api.guild.finishQuest(),
  });

  const guild = userStore.guild;
  const guildTask = guild?.currentGuildTask;
  const remainingKills = guildTask?.remainingKills ?? 0;
  const taskCompleted = remainingKills <= 0;

  return (
    <div className={styles.container}>
      <When value={!guild}>
        <h1>You have no guild</h1>
      </When>
      <When value={!!guild}>
        <GuildInfo guild={guild} />

        <div className={styles.internalMessageContainer}>{guild?.internalMessage}</div>
        <GuildMenu />
        <When value={!!guildTask}>
          <GuildTaskInfo
            guildTask={guildTask}
            finished={taskCompleted}
            onClick={() => {
              if (!finishTaskMutation.isPending && taskCompleted) {
                finishTaskMutation.mutate();
              }
            }}
          />
        </When>
        <When value={!guildTask}>
          <div
            onClick={() => {
              modalStore.setGuildTaskSelect({ open: true });
            }}
            className={cn(styles.guildTaskContainer, {
              [styles.selectNewTask]: true,
            })}
          >
            <h3>Click here to select a new task</h3>
          </div>
        </When>

        <div className={styles.memberViewSwitch}>
          <Switch
            leftLabel="Members"
            rightLabel="Requests"
            selected={showing === 'members' ? 'left' : 'right'}
            onSelect={(value) => {
              switch (value) {
                case 'left':
                  setShowing('members');
                  break;
                case 'right':
                  setShowing('applications');
                  break;

                default:
                  break;
              }
            }}
          />
        </div>

        <When value={showing === 'members'}>
          <div className={styles.membersList}>
            <span>Members: {guild?.members?.length}/10</span>
            <ForEach items={guild?.members} render={(member) => <GuidMemberInfo key={member.id} member={member} />} />
          </div>
        </When>

        <When value={showing === 'applications'}>
          <div className={styles.membersList}>
            <ForEach
              items={guild?.guildApplications}
              render={(application) => (
                <GuildApplicationInfo
                  key={application.id}
                  application={application}
                  permissionLevel={userStore.user?.guildMember?.permissionLevel ?? 0}
                />
              )}
            />
          </div>
        </When>
      </When>
    </div>
  );
}
