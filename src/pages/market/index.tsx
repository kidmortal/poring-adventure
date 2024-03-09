import { Query } from "@/store/query";
import styles from "./style.module.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { toast } from "react-toastify";
import { Button } from "@/components/Button";
import { Silver } from "@/components/Silver";
import { InventoryItem } from "@/components/InventoryItem";
import { useWebsocketApi } from "@/api/websocketServer";
import { useMainStore } from "@/store/main";

export function MarketPage() {
  const store = useMainStore();
  const api = useWebsocketApi();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: [Query.ALL_MARKET],
    enabled: !!store.websocket,
    staleTime: 1000 * 2,
    queryFn: () => api.getFirst10MarketListing(),
  });

  const purchaseMutation = useMutation({
    mutationFn: (id: number) =>
      api.purchaseMarketListing({
        itemId: id,
        stack: 1,
      }),
    onSuccess: () => {
      toast("Purchase successful", { type: "success" });
      queryClient.refetchQueries({
        queryKey: [Query.ALL_MARKET],
      });
      queryClient.refetchQueries({
        queryKey: [Query.USER_CHARACTER],
      });
    },
  });

  if (query.isLoading) {
    return <FullscreenLoading />;
  }

  return (
    <div className={styles.container}>
      {query.data?.map((u) => (
        <div className={styles.listingContainer} key={u.id}>
          <span>{u.seller?.name} </span>
          <InventoryItem
            inventoryItem={u.inventory}
            stack={u.stack}
            toolTipDirection="right"
          />
          <Silver amount={u.price} />
          <div>
            <Button
              onClick={() => purchaseMutation.mutate(u.id)}
              label="Buy item"
              disabled={purchaseMutation.isPending}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
