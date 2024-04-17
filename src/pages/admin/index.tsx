import { useWebsocketApi } from '@/api/websocketServer';
import { FullscreenLoading } from '@/components/FullscreenLoading';
import { useMainStore } from '@/store/main';
import { useMutation, useQuery } from '@tanstack/react-query';
import styles from './style.module.scss';
import { Button } from '@/components/Button';
import ForEach from '@/components/ForEach';
import { FaRegBell } from 'react-icons/fa';
import { MdOutlineCached } from 'react-icons/md';
import { MdOutlineRestartAlt } from 'react-icons/md';
import { FaBug } from 'react-icons/fa6';
import { useAdminStore } from '@/store/admin';
import { Capacitor } from '@capacitor/core';
import { useNavigate } from 'react-router-dom';
import { ServerInfoBox } from './components/ServerInfoBox';
import { ConnectedUser } from './components/ConnectedUser';
import { ConnectedIntegration } from './components/ConnectedIntegration';

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

  const clearCacheMutation = useMutation({
    mutationFn: () => api.admin.clearCache(),
  });

  const restartServer = useMutation({
    mutationFn: () => api.admin.restartServer(),
  });

  const pushNotificationMutation = useMutation({
    mutationFn: () => api.admin.pushNotification({ message: 'Test message' }),
  });

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

  return (
    <div className={styles.container}>
      <ServerInfoBox serverInfo={adminStore.serverInfo} sockets={adminStore.connectedSockets} />

      <div className={styles.adminActions}>
        <Button
          label={
            <div>
              <MdOutlineCached />
              <span>Clear Cache</span>
            </div>
          }
          onClick={() => clearCacheMutation.mutate()}
          disabled={clearCacheMutation.isPending}
          theme="secondary"
        />
        <Button
          theme="danger"
          label={
            <div>
              <MdOutlineRestartAlt />
              <span>Restart Server</span>
            </div>
          }
          onClick={() => restartServer.mutate()}
          disabled={restartServer.isPending}
        />
        <Button
          label={
            <div>
              <FaRegBell />
              <span>Push Notif</span>
            </div>
          }
          onClick={() => pushNotificationMutation.mutate()}
          disabled={pushNotificationMutation.isPending}
        />
        <Button
          label={
            <div>
              <FaBug />
              <span>Debug Native</span>
            </div>
          }
          onClick={() => showNativeServices()}
        />
        <Button
          label={
            <div>
              <FaBug />
              <span>Cash Store</span>
            </div>
          }
          onClick={() => navigate('/store')}
        />
      </div>
      <div className={styles.integrationList}>
        <ForEach
          items={adminStore.connectedIntegrations}
          render={(integration) => <ConnectedIntegration integration={integration} />}
        />
      </div>
      <div className={styles.socketList}>
        <ForEach items={adminStore.connectedUsers} render={(user) => <ConnectedUser key={user?.id} user={user} />} />
      </div>
    </div>
  );
}
