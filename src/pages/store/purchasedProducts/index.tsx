import styles from './style.module.scss';
import { useMutation, useQuery } from '@tanstack/react-query';

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

  const claimPurchaseMutation = useMutation({
    mutationFn: () => api.store.claimPurchase({ purchaseId: purchase.id }),
  });

  const refundPurchaseMutation = useMutation({
    mutationFn: () => api.store.requestRefund({ purchaseId: purchase.id }),
  });

  return (
    <div className={styles.purchaseInfoContainer}>
      <div className={styles.purchaseInfo}>
        <img src={`https://kidmortal.sirv.com/misc/${purchase.product.name}.png?w=60&h=60`} />
        <span>{purchase.product.displayName}</span>
        <span>Claimed: {purchase.received ? 'Yes' : 'No'}</span>
      </div>

      <div className={styles.purchaseActions}>
        <Button
          label="Claim"
          onClick={() => claimPurchaseMutation.mutate()}
          disabled={claimPurchaseMutation.isPending || refundPurchaseMutation.isPending}
        />
        <Button
          label="Refund"
          theme="danger"
          onClick={() => refundPurchaseMutation.mutate()}
          disabled={claimPurchaseMutation.isPending || refundPurchaseMutation.isPending}
        />
      </div>
    </div>
  );
}
