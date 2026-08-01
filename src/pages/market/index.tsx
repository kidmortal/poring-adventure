import { Query } from '@/store/query';
import styles from './style.module.scss';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FullscreenLoading } from '@/layout/PageLoading/FullscreenLoading';

import { Button } from '@/components/shared/Button';
import { Silver } from '@/components/StatsComponents/Silver';
import { InventoryItem } from '@/components/Items/InventoryItem';
import { useWebsocketApi } from '@/api/websocketServer';
import { useMainStore } from '@/store/main';
import { useEffect } from 'react';
import { useModalStore } from '@/store/modal';
import ForEach from '@/components/shared/ForEach';
import { ItemCategoryFilter } from '@/components/Items/ItemCategoryFilter';

import { Pagination } from '@/components/shared/Pagination';

export function MarketPage() {
  const queryClient = useQueryClient();
  const store = useMainStore();
  const api = useWebsocketApi();
  const query = useQuery({
    queryKey: [Query.ALL_MARKET],
    enabled: !!store.websocket,
    staleTime: 1000 * 5, // 60 seconds
    queryFn: () =>
      api.market.getMarketListingPage({
        page: store.marketFilters.page,
        category: store.marketFilters.category,
      }),
  });

  function invalidateMarketQuery() {
    queryClient.invalidateQueries({ queryKey: [Query.ALL_MARKET] });
  }

  useEffect(() => {
    invalidateMarketQuery();
  }, [store.marketFilters]);

  useEffect(() => {
    if (query.data?.listings) {
      store.setMarketListings(query.data.listings);
    }
  }, [query.data]);

  if (query.isLoading) {
    return <FullscreenLoading info="Market Update" />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <ItemCategoryFilter
          selected={store.marketFilters.category}
          onClick={(category) => store.setMarketFilterCategory(category)}
        />
        {/* <PriceSortSwitch sort="desc" /> */}
      </div>
      <div className={styles.listContainer}>
        <ForEach
          items={store.marketListings}
          render={(list) => <MarketListingContainer key={list.id} listing={list} />}
        />
      </div>

      <Pagination
        totalCount={query.data?.count ?? 10} // Total count of items
        onPageChange={(page) => store.setMarketFilterPage(page)}
      />
    </div>
  );
}

function MarketListingContainer({ listing }: { listing: MarketListing }) {
  const modalStore = useModalStore();

  // Tapping the row opens the same modal the Buy button does: it already is the
  // item detail sheet (name, quality, stats, seller, price), so a preview-only
  // twin would just duplicate it and dead-end anyone who then wants to buy.
  function openListing() {
    modalStore.setBuyItem({
      open: true,
      marketListing: listing,
      // Reset, otherwise an amount typed for a previous listing carries over and
      // can exceed this one's stock.
      amount: 1,
    });
  }

  return (
    <div className={styles.listingContainer} key={listing.id} onClick={openListing}>
      <span className={styles.sellerName}>{listing.seller?.name}</span>
      <div className={styles.itemCell}>
        <InventoryItem inventoryItem={listing.inventory} stack={listing.stack} />
      </div>
      <div className={styles.priceCell}>
        <Silver amount={listing.price} />
      </div>
      <div className={styles.buyCell}>
        <Button onClick={openListing} label="Buy" />
      </div>
    </div>
  );
}
