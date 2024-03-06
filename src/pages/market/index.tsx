import { Query } from "@/store/query";
import styles from "./style.module.scss";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/service";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { Button } from "@/components/Button";
import { Tooltip } from "@/components/Tooltip";

export function MarketPage() {
  const query = useQuery({
    queryKey: [Query.ALL_MARKET],
    staleTime: 1000 * 2,
    queryFn: () => api.getFirst10MarketListing(),
  });

  if (query.isLoading) {
    return <FullscreenLoading />;
  }

  return (
    <div className={styles.container}>
      {query.data?.map((u) => (
        <div className={styles.listingContainer} key={u.id}>
          <span>{u.sellerEmail} </span>
          <Tooltip text={u.item?.name ?? "No name"}>
            <img width={60} height={60} src={u.item?.image} />
          </Tooltip>

          <div className={styles.priceContainer}>
            <span>{u.price}</span>
            <img src="https://cdn.discordapp.com/emojis/651562374326779955.webp?size=96&quality=lossless" />
          </div>
          <button disabled>Buy item</button>
        </div>
      ))}
    </div>
  );
}
