import { CharacterHead } from '@/components/Character/CharacterInfo';
import { When } from '@/components/shared/When';
import styles from './style.module.scss';
import { Button } from '@/components/shared/Button';
import { useMutation } from '@tanstack/react-query';
import { useWebsocketApi } from '@/api/websocketServer';

export function GuildApplicationInfo({
  application,
  permissionLevel,
}: {
  application: GuildApplication;
  permissionLevel: number;
}) {
  const api = useWebsocketApi();
  const acceptApplicationMutation = useMutation({
    mutationFn: () => api.guild.acceptGuildApplication({ applicationId: application.id }),
  });

  const refuseApplicationMutation = useMutation({
    mutationFn: () => api.guild.refuseGuildApplication({ applicationId: application.id }),
  });

  const appearance = application.user?.appearance;
  return (
    <div className={styles.applicationInfoContainer}>
      <div className={styles.applicantInfo}>
        <When value={!!appearance}>
          <CharacterHead head={appearance?.head} gender={appearance?.gender} />
        </When>
        <div className={styles.memberInfo}>
          <span>{application.user.name}</span>
          <span>Level: {application.user.stats?.level}</span>
        </div>
      </div>

      <When value={permissionLevel > 0}>
        <div className={styles.applicationActions}>
          <Button
            label="Accept"
            theme="success"
            onClick={() => acceptApplicationMutation.mutate()}
            disabled={acceptApplicationMutation.isPending}
          />
          <Button
            label="Reject"
            theme="danger"
            onClick={() => refuseApplicationMutation.mutate()}
            disabled={refuseApplicationMutation.isPending}
          />
        </div>
      </When>
    </div>
  );
}
