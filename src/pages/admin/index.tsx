import { useWebsocketApi } from "@/api/websocketServer";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { useMainStore } from "@/store/main";
import { useMutation, useQuery } from "@tanstack/react-query";
import styles from "./style.module.scss";
import { Button } from "@/components/Button";

export function AdminPage() {
  const store = useMainStore();
  const api = useWebsocketApi();
  const query = useQuery({
    queryKey: ["sockets"],
    enabled: !!store.websocket,
    staleTime: 1000 * 2,
    queryFn: () => api.admin.getAllWebsockets(),
  });

  const notificationMutation = useMutation({
    mutationFn: (args: { to: string; message: string }) =>
      api.admin.sendWebsocketNotification(args),
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
      <Button
        label="Clear Cache"
        onClick={() => clearCacheMutation.mutate()}
        disabled={clearCacheMutation.isPending}
      />
      <Button
        label="Send Push Notification"
        onClick={() => pushNotificationMutation.mutate()}
        disabled={pushNotificationMutation.isPending}
      />

      {query.data?.map((socket) => (
        <div className={styles.row}>
          <div>
            <span>id: {socket.id}</span>
            <span>email: {socket.email}</span>
          </div>
          <Button
            label="MSG"
            onClick={() =>
              notificationMutation.mutate({
                to: socket.email,
                message: "You have been hacked",
              })
            }
            disabled={notificationMutation.isPending}
          />
        </div>
      ))}
    </div>
  );
}
