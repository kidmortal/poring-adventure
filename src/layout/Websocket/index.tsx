import { Outlet, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

import { useEffect, useState } from 'react';
import { useMainStore } from '@/store/main';

import { useBattleStore } from '@/store/battle';
import { FullscreenLoading } from '@/layout/PageLoading/FullscreenLoading';
import { useWebsocketApi } from '@/api/websocketServer';
import { addWebsocketListeners } from './listeners';
import { addToastListeners } from './toastListener';
import { WebsocketDisconnectedMessageScreen } from '@/screens/WebsocketDisconnected';
import { addAdminWebsocketListeners } from './adminListeners';
import { useAdminStore } from '@/store/admin';
import { useUserStore } from '@/store/user';
import { attachWebsocketDevLogger } from './devLogger';
import { WebsocketDebugPanel } from '@/components/WebsocketDebugPanel';

export function WebsocketLayout() {
  const [disconnected, setDisconnected] = useState(false);

  const store = useMainStore();
  const userStore = useUserStore();
  const adminStore = useAdminStore();
  const battleStore = useBattleStore();
  const api = useWebsocketApi();
  const navigate = useNavigate();

  function connectToWS() {
    if (store.loggedUserInfo.accessToken && !store.websocket) {
      setDisconnected(false);
      const socket = io(import.meta.env.VITE_API_URL, {
        auth: { accessToken: store.loggedUserInfo.accessToken },
      });

      // Before any listener, so the log holds the whole connection attempt.
      attachWebsocketDevLogger(socket);

      socket.on('authenticated', () => {
        store.setWsAuthenticated(true);
      });

      socket.on('connect', () => {
        store.setWebsocket(socket);
        setDisconnected(false);
      });
      socket.on('disconnect', () => {
        store.setWebsocket(undefined);
        setDisconnected(true);
      });
      socket.on('connect_error', () => {
        store.setWebsocket(undefined);
      });
    }
  }

  useEffect(() => {
    connectToWS();
  }, [store.loggedUserInfo.accessToken]);

  useEffect(() => {
    if (store.websocket) {
      const params = {
        websocket: store.websocket,
        api,
        battle: battleStore,
        store,
        userStore: userStore,
        pushToScreen: (s: string) => navigate(s),
      };

      addWebsocketListeners(params);
      addAdminWebsocketListeners({
        websocket: store.websocket,
        store: adminStore,
      });
      addToastListeners(params);
    }
  }, [store.websocket]);

  // The panel rides along with every branch: a failed connection is exactly
  // when the log matters most, and those screens never render the Outlet.
  return (
    <>
      {renderScreen()}
      <WebsocketDebugPanel />
    </>
  );

  function renderScreen() {
    if (disconnected) {
      return <WebsocketDisconnectedMessageScreen onReconnect={() => connectToWS()} />;
    }

    if (!store.websocket && !store.wsAuthenticated) {
      return <FullscreenLoading info={'Server connection'} />;
    }

    if (!store.websocket) {
      return <FullscreenLoading info={'Reconnecting to server'} />;
    }

    return <Outlet />;
  }
}
