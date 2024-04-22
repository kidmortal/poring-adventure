import styles from './style.module.scss';

import { VscDebugDisconnect } from 'react-icons/vsc';

import { useWebsocketApi } from '@/api/websocketServer';
import { useMutation } from '@tanstack/react-query';
import { CharacterHead } from '@/components/Character/CharacterInfo';
import HealthBar from '@/components/StatsComponents/HealthBar';
import ManaBar from '@/components/StatsComponents/ManaBar';
import { Button } from '@/components/shared/Button';
import { IoIosSend } from 'react-icons/io';
import { FaGift, FaRegBell, FaSkull } from 'react-icons/fa';
import { MdOutlineLocalHospital } from 'react-icons/md';

export function ConnectedUser({ user }: { user?: User }) {
  const api = useWebsocketApi();
  const notificationMutation = useMutation({
    mutationFn: () => api.admin.sendWebsocketNotification({ to: user?.email ?? '', message: 'You have been hacked' }),
  });
  const disconnectMutation = useMutation({
    mutationFn: () => api.admin.disconnectUser({ email: user?.email ?? '' }),
  });

  const sendGiftMutation = useMutation({
    mutationFn: () => api.admin.sendGiftMail({ email: user?.email ?? '' }),
  });

  const fullHealMutation = useMutation({
    mutationFn: () => api.admin.fullHealUser({ email: user?.email ?? '' }),
  });

  const killUserMutation = useMutation({
    mutationFn: () => api.admin.killUser({ email: user?.email ?? '' }),
  });

  const pushNotificationToUserMutation = useMutation({
    mutationFn: () => api.admin.pushNotificationToUser({ message: 'Test message', email: user?.email ?? '' }),
  });

  if (!user) return <></>;

  return (
    <div className={styles.userSocketContainer}>
      <div className={styles.userInfoContainer}>
        <CharacterHead head={user.appearance.head} gender={user.appearance.gender} className={styles.userHead} />
        <div className={styles.generalInfoContainer}>
          <span>{user.name}</span>
          <span>{`LV ${user.stats?.level} ${user.profession?.name}`}</span>
        </div>

        <div className={styles.statsContainer}>
          <HealthBar currentHealth={user.stats?.health ?? 0} maxHealth={user.stats?.maxHealth ?? 0} />
          <ManaBar currentHealth={user.stats?.mana ?? 0} maxHealth={user.stats?.maxMana ?? 0} />
        </div>
      </div>

      <div className={styles.socketActions}>
        <Button
          label={<IoIosSend />}
          onClick={() => notificationMutation.mutate()}
          disabled={notificationMutation.isPending}
        />
        <Button
          theme="secondary"
          label={<FaRegBell />}
          onClick={() => pushNotificationToUserMutation.mutate()}
          disabled={pushNotificationToUserMutation.isPending}
        />
        <Button
          theme="secondary"
          label={<FaGift />}
          onClick={() => sendGiftMutation.mutate()}
          disabled={sendGiftMutation.isPending}
        />
        <Button
          theme="danger"
          label={<VscDebugDisconnect />}
          onClick={() => disconnectMutation.mutate()}
          disabled={disconnectMutation.isPending}
        />
        <Button
          theme="danger"
          label={<FaSkull />}
          onClick={() => killUserMutation.mutate()}
          disabled={killUserMutation.isPending}
        />
        <Button
          theme="success"
          label={<MdOutlineLocalHospital />}
          onClick={() => fullHealMutation.mutate()}
          disabled={fullHealMutation.isPending}
        />
      </div>
    </div>
  );
}
