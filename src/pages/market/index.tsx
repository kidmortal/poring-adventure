import { Query } from "@/store/query";
import styles from "./style.module.scss";
import { useQuery } from "@tanstack/react-query";
import { FullscreenLoading } from "@/components/FullscreenLoading";

import { Button } from "@/components/Button";
import { Silver } from "@/components/Silver";
import { InventoryItem } from "@/components/InventoryItem";
import { useWebsocketApi } from "@/api/websocketServer";
import { useMainStore } from "@/store/main";
import { useEffect } from "react";
import { useModalStore } from "@/store/modal";

export function MarketPage() {
  const modalStore = useModalStore();
  const store = useMainStore();
  const api = useWebsocketApi();
  const query = useQuery({
    queryKey: [Query.ALL_MARKET],
    enabled: !!store.websocket,
    staleTime: 1000 * 60, // 60 seconds
    queryFn: () => api.market.getFirst10MarketListing(),
  });

  useEffect(() => {
    if (query.data) {
      store.setMarketListings(query.data);
    }
  }, [query.data]);

  if (query.isLoading) {
    return <FullscreenLoading info="Market Update" />;
  }

  return (
    <div className={styles.container}>
      {store.marketListings.map((u) => (
        <div className={styles.listingContainer} key={u.id}>
          <span className={styles.sellerName}>{u.seller?.name} </span>
          <InventoryItem
            inventoryItem={u.inventory}
            stack={u.stack}
            toolTipDirection="right"
          />
          <Silver amount={u.price} />
          <div>
            <Button
              onClick={() => {
                modalStore.setBuyItem({
                  open: true,
                  marketListing: u,
                });
              }}
              label="Buy"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
