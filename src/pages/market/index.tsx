import { Query } from "@/store/query";
import styles from "./style.module.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/service";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { useMainStore } from "@/store/main";
import { toast } from "react-toastify";
import { Button } from "@/components/Button";
import { Silver } from "@/components/Silver";
import { InventoryItem } from "@/components/InventoryItem";
import { useWebsocketApi } from "@/api/websocketServer";

export function MarketPage() {
  const wsapi = useWebsocketApi();
  const store = useMainStore();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: [Query.ALL_MARKET],
    staleTime: 1000 * 2,
    queryFn: () => wsapi.getFirst10MarketListing(),
  });

  const purchaseMutation = useMutation({
    mutationFn: (id: number) =>
      api.purchaseMarketListing({
        listingId: id,
        accessToken: store.loggedUserInfo.accessToken,
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
