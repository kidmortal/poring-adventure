import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import styles from './style.module.scss';
import { useWebsocketApi } from '@/api/websocketServer';
import { Button } from '@/components/shared/Button';
import ForEach from '@/components/shared/ForEach';
import { When } from '@/components/shared/When';
import { LoadingBlock } from '@/components/shared/LoadingBlock';
import { GuildToken } from '@/components/StatsComponents/GuildToken';
import { Query } from '@/store/query';
import { useUserStore } from '@/store/user';

/**
 * Everything here is paid for in guild tokens, which only come from guild work
 * — tasks and the boss — so the shelf is stocked by the guild, not by silver.
 */
export function GuildStorePage() {
  const navigate = useNavigate();
  const api = useWebsocketApi();
  const userStore = useUserStore();

  const productsQuery = useQuery({
    queryKey: [Query.GUILD_STORE],
    staleTime: Infinity,
    queryFn: () => api.guild.getGuildStore(),
  });

  const buyMutation = useMutation({
    mutationFn: (productId: number) => api.guild.buyGuildStoreProduct({ productId, amount: 1 }),
  });

  const tokens = userStore.user?.guildMember?.guildTokens ?? 0;
  const products = productsQuery.data ?? [];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Guild store</h2>
          <span className={styles.subtitle}>Paid for with guild tokens</span>
        </div>
        <GuildToken amount={tokens} />
      </header>

      <When value={productsQuery.isLoading}>
        <LoadingBlock info="Loading the store" />
      </When>

      <When value={!productsQuery.isLoading && products.length === 0}>
        <span className={styles.empty}>The shelves are empty for now.</span>
      </When>

      <div className={styles.list}>
        <ForEach
          items={products}
          render={(product) => {
            const affordable = tokens >= product.price;
            return (
              <div className={styles.product} key={product.id}>
                <div className={styles.itemImage}>
                  <img src={product.item.image} alt={product.item.name} />
                  <When value={product.stack > 1}>
                    <span className={styles.stack}>x{product.stack}</span>
                  </When>
                </div>

                <div className={styles.productInfo}>
                  <span className={styles.productName}>{product.item.name}</span>
                  <GuildToken className={styles.price} amount={product.price} size={14} />
                </div>

                <Button
                  className={styles.buy}
                  theme={affordable ? 'primary' : 'neutral'}
                  disabled={!affordable || buyMutation.isPending}
                  label={affordable ? 'Buy' : 'Too few'}
                  onClick={() => buyMutation.mutate(product.id)}
                />
              </div>
            );
          }}
        />
      </div>

      <Button className={styles.back} theme="neutral" label="Back to guild" onClick={() => navigate('/guild')} />
    </div>
  );
}
