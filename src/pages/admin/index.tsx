import { useWebsocketApi } from "@/api/websocketServer";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { useMainStore } from "@/store/main";
import { useMutation, useQuery } from "@tanstack/react-query";
import styles from "./style.module.scss";
import { Button } from "@/components/Button";
import ForEach from "@/components/ForEach";
import { FaRegBell } from "react-icons/fa";
import { MdOutlineCached } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { VscDebugDisconnect } from "react-icons/vsc";
import { FaGift } from "react-icons/fa6";
import { MdMemory } from "react-icons/md";
import { CharacterHead } from "@/components/CharacterInfo";
import HealthBar from "@/components/HealthBar";
import ManaBar from "@/components/ManaBar";

export function AdminPage() {
  const store = useMainStore();
  const api = useWebsocketApi();
  const query = useQuery({
    queryKey: ["sockets"],
    enabled: !!store.websocket,
    staleTime: 1000 * 10, // 10 seconds
    queryFn: () => api.admin.getAllConnectedUsers(),
  });
  const serverQuery = useQuery({
    queryKey: ["server"],
    enabled: !!store.websocket,
    staleTime: 1000 * 10, // 10 seconds
    queryFn: () => api.admin.getServerInfo(),
  });

  const clearCacheMutation = useMutation({
    mutationFn: () => api.admin.clearCache(),
  });

  const pushNotificationMutation = useMutation({
    mutationFn: () => api.admin.pushNotification({ message: "Test message" }),
  });

  console.log(serverQuery.data);

  if (query.isLoading) {
    return <FullscreenLoading info="Admin socket" />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainSectionRow}>
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
            label={
              <div>
                <FaRegBell />
                <span>Push Notification</span>
              </div>
            }
            onClick={() => pushNotificationMutation.mutate()}
            disabled={pushNotificationMutation.isPending}
          />
        </div>
        <div className={styles.serverInfoContainer}>
          <span>Hash: {serverQuery.data?.branchHash.slice(0, 15)}</span>
          <div className={styles.ramInfoContainer}>
            <MdMemory size={20} />
            <span>
              {`${serverQuery.data?.memoryInfo.memoryUsage} / ${serverQuery.data?.memoryInfo.totalMemory}`}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.socketList}>
        <ForEach
          items={query.data}
          render={(user) => <ManageUser key={user.id} user={user} />}
        />
      </div>
    </div>
  );
}

function ManageUser({ user }: { user: User }) {
  const api = useWebsocketApi();
  const notificationMutation = useMutation({
    mutationFn: () =>
      api.admin.sendWebsocketNotification({
        to: user.email,
        message: "You have been hacked",
      }),
  });
  const disconnectMutation = useMutation({
    mutationFn: () =>
      api.admin.disconnectUser({
        email: user.email,
      }),
  });

  const sendGiftMutation = useMutation({
    mutationFn: () =>
      api.admin.sendGiftMail({
        email: user.email,
      }),
  });
  const pushNotificationToUserMutation = useMutation({
    mutationFn: () =>
      api.admin.pushNotificationToUser({
        message: "Test message",
        email: user.email,
      }),
  });

  return (
    <div className={styles.userSocketContainer}>
      <div className={styles.userInfoContainer}>
        <CharacterHead
          head={user.appearance.head}
          gender={user.appearance.gender}
          className={styles.userHead}
        />

        <div className={styles.generalInfoContainer}>
          <span>{user.name}</span>
          <span>{`LV ${user.stats?.level} ${user.profession?.name}`}</span>
        </div>

        <div className={styles.statsContainer}>
          <HealthBar
            currentHealth={user.stats?.health ?? 0}
            maxHealth={user.stats?.maxHealth ?? 0}
          />
          <ManaBar
            currentHealth={user.stats?.mana ?? 0}
            maxHealth={user.stats?.maxMana ?? 0}
          />
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
      </div>
    </div>
  );
}
