import { useWebsocketApi } from '@/api/websocketServer';
import { FullscreenLoading } from '@/layout/PageLoading/FullscreenLoading';
import { useMainStore } from '@/store/main';
import { useMutation, useQuery } from '@tanstack/react-query';
import styles from './style.module.scss';
import ForEach from '@/components/shared/ForEach';
import { FaRegBell, FaSkull, FaStore, FaTrash } from 'react-icons/fa';
import { FaBug } from 'react-icons/fa6';
import { GiNightSleep } from 'react-icons/gi';
import { MdOutlineCached, MdOutlineRestartAlt } from 'react-icons/md';
import { useAdminStore } from '@/store/admin';
import { Capacitor } from '@capacitor/core';
import { useNavigate } from 'react-router-dom';
import { ServerInfoBox } from './components/ServerInfoBox';
import { ConnectedUser } from './components/ConnectedUser';
import { ConnectedIntegration } from './components/ConnectedIntegration';
import { AdminAction } from './components/AdminAction';

export function AdminPage() {
  const navigate = useNavigate();
  const plataform = Capacitor.getPlatform();
  const adminStore = useAdminStore();
  const store = useMainStore();
  const api = useWebsocketApi();
  useQuery({
    queryKey: ['sockets'],
    enabled: !!store.websocket,
    queryFn: () => api.admin.getAllConnectedUsers(),
    refetchInterval: 4000,
  });
  useQuery({
    queryKey: ['server'],
    enabled: !!store.websocket,
    queryFn: () => api.admin.getServerInfo(),
    refetchInterval: 2000,
  });

  const clearCacheMutation = useMutation({ mutationFn: () => api.admin.clearCache() });
  const restartServer = useMutation({ mutationFn: () => api.admin.restartServer() });
  const pushNotificationMutation = useMutation({
    mutationFn: () => api.admin.pushNotification({ message: 'Test message' }),
  });
  const resetStaminaMutation = useMutation({ mutationFn: () => api.admin.resetDailyStamina() });
  const resetBossEntryMutation = useMutation({ mutationFn: () => api.admin.resetBossEntry() });
  const clearGuildBossesMutation = useMutation({ mutationFn: () => api.admin.clearGuildBosses() });

  if (!adminStore.serverInfo) {
    return <FullscreenLoading info="Admin page" />;
  }

  function showNativeServices() {
    if (plataform === 'android') {
      let servicesString = '';
      for (const [key, value] of Object.entries(adminStore.nativeServices)) {
        servicesString += `${key} - ${value} \n`;
      }

      alert(servicesString);
    } else {
      alert('Not on a native device');
    }
  }

  const online = adminStore.connectedUsers.length;

  return (
    <div className={styles.container}>
      <ServerInfoBox serverInfo={adminStore.serverInfo} sockets={adminStore.connectedSockets} />

      {/* The dailies are grouped together: they are what testing actually needs,
          and what you least want to hit by accident. */}
      <section className={styles.section}>
        <span className={styles.sectionTitle}>Daily resets</span>
        <div className={styles.actionGrid}>
          <AdminAction
            icon={<GiNightSleep />}
            label="Stamina"
            hint="Refill everyone"
            theme="success"
            pending={resetStaminaMutation.isPending}
            onClick={() => resetStaminaMutation.mutate()}
          />
          <AdminAction
            icon={<FaSkull />}
            label="Boss entry"
            hint="Give today back"
            theme="success"
            pending={resetBossEntryMutation.isPending}
            onClick={() => resetBossEntryMutation.mutate()}
          />
          <AdminAction
            icon={<FaTrash />}
            label="Guild bosses"
            hint="Dismiss every one"
            theme="danger"
            pending={clearGuildBossesMutation.isPending}
            onClick={() => clearGuildBossesMutation.mutate()}
          />
        </div>
      </section>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>Server</span>
        <div className={styles.actionGrid}>
          <AdminAction
            icon={<MdOutlineCached />}
            label="Clear cache"
            hint="Every cached read"
            theme="primary"
            pending={clearCacheMutation.isPending}
            onClick={() => clearCacheMutation.mutate()}
          />
          <AdminAction
            icon={<FaRegBell />}
            label="Push notif"
            hint="Test message to all"
            theme="primary"
            pending={pushNotificationMutation.isPending}
            onClick={() => pushNotificationMutation.mutate()}
          />
          <AdminAction
            icon={<MdOutlineRestartAlt />}
            label="Restart"
            hint="Drops every battle"
            theme="danger"
            pending={restartServer.isPending}
            onClick={() => restartServer.mutate()}
          />
        </div>
      </section>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>Debug</span>
        <div className={styles.actionGrid}>
          <AdminAction icon={<FaBug />} label="Native" hint="Capacitor services" onClick={() => showNativeServices()} />
          <AdminAction
            icon={<FaStore />}
            label="Cash store"
            hint="Open the store page"
            onClick={() => navigate('/store')}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTitle}>Online</span>
          <span className={styles.count}>{online}</span>
        </div>

        <div className={styles.integrationList}>
          <ForEach
            items={adminStore.connectedIntegrations}
            render={(integration) => <ConnectedIntegration integration={integration} />}
          />
        </div>

        {online === 0 && <span className={styles.empty}>Nobody is connected.</span>}
        <div className={styles.socketList}>
          <ForEach items={adminStore.connectedUsers} render={(user) => <ConnectedUser key={user?.id} user={user} />} />
        </div>
      </section>
    </div>
  );
}
