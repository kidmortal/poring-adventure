import { Query } from '@/store/query';
import styles from './style.module.scss';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FullscreenLoading } from '@/layout/PageLoading/FullscreenLoading';

import { Button } from '@/components/shared/Button';
import { Silver } from '@/components/Silver';
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
  return (
    <div className={styles.listingContainer} key={listing.id}>
      <span className={styles.sellerName}>{listing.seller?.name} </span>
      <InventoryItem inventoryItem={listing.inventory} stack={listing.stack} toolTipDirection="right" />
      <Silver amount={listing.price} />
      <div>
        <Button
          onClick={() => {
            modalStore.setBuyItem({
              open: true,
              marketListing: listing,
            });
          }}
          label="Buy"
        />
      </div>
    </div>
  );
}
