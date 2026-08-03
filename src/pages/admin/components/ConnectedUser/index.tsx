import styles from './style.module.scss';
import cn from 'classnames';

import { VscDebugDisconnect } from 'react-icons/vsc';
import { IoIosSend } from 'react-icons/io';
import { FaGift, FaRegBell, FaSkull, FaCoins, FaFlagCheckered } from 'react-icons/fa';
import { MdOutlineLocalHospital, MdOutlineCached } from 'react-icons/md';
import { GiNightSleep } from 'react-icons/gi';

import { useWebsocketApi } from '@/api/websocketServer';
import { useMutation } from '@tanstack/react-query';
import { CharacterHead } from '@/components/Character/CharacterInfo';
import HealthBar from '@/components/StatsComponents/HealthBar';
import ManaBar from '@/components/StatsComponents/ManaBar';

/** What a single admin gift of silver is worth. */
const SILVER_GRANT = 1000;

export function ConnectedUser({ user }: { user?: User }) {
  const api = useWebsocketApi();
  const email = user?.email ?? '';

  const notificationMutation = useMutation({
    mutationFn: () => api.admin.sendWebsocketNotification({ to: email, message: 'You have been hacked' }),
  });
  const disconnectMutation = useMutation({ mutationFn: () => api.admin.disconnectUser({ email }) });
  const sendGiftMutation = useMutation({ mutationFn: () => api.admin.sendGiftMail({ email }) });
  const fullHealMutation = useMutation({ mutationFn: () => api.admin.fullHealUser({ email }) });
  const killUserMutation = useMutation({ mutationFn: () => api.admin.killUser({ email }) });
  const pushNotificationToUserMutation = useMutation({
    mutationFn: () => api.admin.pushNotificationToUser({ message: 'Test message', email }),
  });
  const resetStaminaMutation = useMutation({ mutationFn: () => api.admin.resetDailyStamina({ email }) });
  const resetBossEntryMutation = useMutation({ mutationFn: () => api.admin.resetBossEntry({ email }) });
  const giveSilverMutation = useMutation({ mutationFn: () => api.admin.giveSilver({ email, amount: SILVER_GRANT }) });
  const endBattleMutation = useMutation({ mutationFn: () => api.admin.forceEndBattle({ email }) });
  const clearCacheMutation = useMutation({ mutationFn: () => api.admin.clearUserCache({ email }) });

  if (!user) return <></>;

  const stats = user.stats;

  return (
    <div className={styles.card}>
      <div className={styles.identity}>
        <CharacterHead head={user.appearance?.head} gender={user.appearance?.gender} className={styles.head} />

        <div className={styles.info}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{user.name}</span>
            <span className={styles.level}>Lv {stats?.level ?? 1}</span>
          </div>
          <span className={styles.meta}>
            {user.class?.name ?? 'No class'} · {user.silver ?? 0} silver
          </span>
          <span className={styles.email}>{user.email}</span>
        </div>

        <div className={styles.bars}>
          <HealthBar currentHealth={stats?.health ?? 0} maxHealth={stats?.maxHealth ?? 0} minHeight="0.5rem" />
          <ManaBar currentHealth={stats?.mana ?? 0} maxHealth={stats?.maxMana ?? 0} minHeight="0.5rem" />
          <span className={styles.stamina}>
            Stamina {stats?.stamina ?? 0}/{stats?.maxStamina ?? 0}
          </span>
        </div>
      </div>

      {/* Every action names itself on hover: eleven icons is more than a row of
          coloured squares can carry on its own. */}
      <div className={styles.actions}>
        <IconAction
          title="Socket message"
          icon={<IoIosSend />}
          onClick={() => notificationMutation.mutate()}
          pending={notificationMutation.isPending}
        />
        <IconAction
          title="Push notification"
          icon={<FaRegBell />}
          onClick={() => pushNotificationToUserMutation.mutate()}
          pending={pushNotificationToUserMutation.isPending}
        />
        <IconAction
          title="Gift mail"
          icon={<FaGift />}
          tone="good"
          onClick={() => sendGiftMutation.mutate()}
          pending={sendGiftMutation.isPending}
        />
        <IconAction
          title={`Give ${SILVER_GRANT} silver`}
          icon={<FaCoins />}
          tone="gold"
          onClick={() => giveSilverMutation.mutate()}
          pending={giveSilverMutation.isPending}
        />
        <IconAction
          title="Refill stamina"
          icon={<GiNightSleep />}
          tone="good"
          onClick={() => resetStaminaMutation.mutate()}
          pending={resetStaminaMutation.isPending}
        />
        <IconAction
          title="Restore boss entry"
          icon={<FaSkull />}
          tone="good"
          onClick={() => resetBossEntryMutation.mutate()}
          pending={resetBossEntryMutation.isPending}
        />
        <IconAction
          title="Full heal"
          icon={<MdOutlineLocalHospital />}
          tone="good"
          onClick={() => fullHealMutation.mutate()}
          pending={fullHealMutation.isPending}
        />
        <IconAction
          title="Clear cache and push profile"
          icon={<MdOutlineCached />}
          onClick={() => clearCacheMutation.mutate()}
          pending={clearCacheMutation.isPending}
        />
        <IconAction
          title="Force end battle"
          icon={<FaFlagCheckered />}
          onClick={() => endBattleMutation.mutate()}
          pending={endBattleMutation.isPending}
        />
        <IconAction
          title="Disconnect socket"
          icon={<VscDebugDisconnect />}
          tone="bad"
          onClick={() => disconnectMutation.mutate()}
          pending={disconnectMutation.isPending}
        />
        <IconAction
          title="Kill"
          icon={<FaSkull />}
          tone="bad"
          onClick={() => killUserMutation.mutate()}
          pending={killUserMutation.isPending}
        />
      </div>
    </div>
  );
}

type IconActionProps = {
  title: string;
  icon: React.ReactNode;
  tone?: 'good' | 'bad' | 'gold';
  pending?: boolean;
  onClick: () => void;
};

function IconAction({ title, icon, tone, pending, onClick }: IconActionProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={pending}
      onClick={onClick}
      className={cn(styles.iconAction, tone && styles[tone], { [styles.pending]: pending })}
    >
      {icon}
    </button>
  );
}
