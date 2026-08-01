import styles from './style.module.scss';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useWebsocketApi } from '@/api/websocketServer';
import ForEach from '@/components/shared/ForEach';
import { useUserStore } from '@/store/user';
import { Button } from '@/components/shared/Button';
import { useMainStore } from '@/store/main';
import { Query } from '@/store/query';

export function PurchasedStoreProducts() {
  const userStore = useUserStore();
  const api = useWebsocketApi();
  const store = useMainStore();

  useQuery({
    queryKey: [Query.ALL_PURCHASES],
    enabled: !!store.websocket,
    staleTime: 1000 * 10, // 10 seconds
    queryFn: () => api.store.getPurchases(),
  });

  return (
    <div className={styles.container}>
      <ForEach
        items={userStore.purchases}
        render={(purchase) => <PurchaseInfo key={purchase.id} purchase={purchase} />}
      />
    </div>
  );
}

function PurchaseInfo({ purchase }: { purchase: UserPurchase }) {
  const api = useWebsocketApi();
  const queryClient = useQueryClient();

  // The server pushes a fresh `purchases` event on success, refetching keeps
  // the list correct even when this socket misses the broadcast.
  const refreshPurchases = () => queryClient.invalidateQueries({ queryKey: [Query.ALL_PURCHASES] });

  const claimPurchaseMutation = useMutation({
    mutationFn: () => api.store.claimPurchase({ purchaseId: purchase.id }),
    onSettled: refreshPurchases,
  });

  const refundPurchaseMutation = useMutation({
    mutationFn: () => api.store.requestRefund({ purchaseId: purchase.id }),
    onSettled: refreshPurchases,
  });

  const isPending = claimPurchaseMutation.isPending || refundPurchaseMutation.isPending;

  return (
    <div className={styles.purchaseInfoContainer}>
      <div className={styles.purchaseInfo}>
        <img src={`https://kidmortal.sirv.com/misc/${purchase.product.name}.png?w=60&h=60`} />
        <span>{purchase.product.displayName}</span>
        <span>{purchaseStatus(purchase)}</span>
      </div>

      <div className={styles.purchaseActions}>
        <Button
          label="Claim"
          onClick={() => claimPurchaseMutation.mutate()}
          disabled={isPending || purchase.received || purchase.refunded}
        />
        <Button
          label="Refund"
          theme="danger"
          onClick={() => refundPurchaseMutation.mutate()}
          disabled={isPending || purchase.received || purchase.refunded}
        />
      </div>
    </div>
  );
}

function purchaseStatus(purchase: UserPurchase) {
  if (purchase.refunded) return 'Refunding';
  if (purchase.received) return 'Claimed';
  return 'Ready to claim';
}
