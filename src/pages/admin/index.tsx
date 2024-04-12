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

export function AdminPage() {
  const store = useMainStore();
  const api = useWebsocketApi();
  const query = useQuery({
    queryKey: ["sockets"],
    enabled: !!store.websocket,
    staleTime: 1000 * 2,
    queryFn: () => api.admin.getAllWebsockets(),
  });

  const clearCacheMutation = useMutation({
    mutationFn: () => api.admin.clearCache(),
  });

  const pushNotificationMutation = useMutation({
    mutationFn: () => api.admin.pushNotification({ message: "Test message" }),
  });

  if (query.isLoading) {
    return <FullscreenLoading info="Admin socket" />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.row}>
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
      </div>

      <ForEach
        items={query.data}
        render={(socket) => <ManageUser key={socket.id} socket={socket} />}
      />
    </div>
  );
}

function ManageUser({
  socket,
}: {
  socket: {
    id: string;
    email: string;
  };
}) {
  const api = useWebsocketApi();
  const notificationMutation = useMutation({
    mutationFn: () =>
      api.admin.sendWebsocketNotification({
        to: socket.email,
        message: "You have been hacked",
      }),
  });
  const disconnectMutation = useMutation({
    mutationFn: () =>
      api.admin.disconnectUser({
        email: socket.email,
      }),
  });
  const pushNotificationToUserMutation = useMutation({
    mutationFn: () =>
      api.admin.pushNotificationToUser({
        message: "Test message",
        email: socket.email,
      }),
  });

  return (
    <div className={styles.userSocketContainer}>
      <span>{socket.email}</span>
      <Button
        label={<IoIosSend />}
        onClick={() => notificationMutation.mutate()}
        disabled={notificationMutation.isPending}
      />
      <Button
        theme="secondary"
        label={<FaRegBell />}
        onClick={() => pushNotificationToUserMutation.mutate()}
        disabled={notificationMutation.isPending}
      />
      <Button
        theme="danger"
        label={<VscDebugDisconnect />}
        onClick={() => disconnectMutation.mutate()}
        disabled={disconnectMutation.isPending}
      />
    </div>
  );
}
