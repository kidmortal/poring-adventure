import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import styles from './style.module.scss';

import { InventoryItem } from '../InventoryItem';
import { useModalStore } from '@/store/modal';

import { InventoryFilters, useMainStore } from '@/store/main';
import { ItemCategoryFilter } from '../ItemCategoryFilter';
import { When } from '@/components/shared/When';
import { EQUIPABLE_CATEGORIES } from '@/constants';

/**
 * Item categories each filter accepts; 'all' matches everything.
 *
 * `equipment` reads the shared list rather than repeating it — spelled out here
 * it was missing `accessory`, so the one slot the whole party shops the same
 * list for was invisible under the filter named after it.
 */
const CATEGORIES_BY_FILTER: Record<Exclude<InventoryFilters, 'all'>, readonly string[]> = {
  equipment: EQUIPABLE_CATEGORIES,
  consumable: ['consumable'],
  material: ['material'],
};

function filterInventory(items: InventoryItem[], filter: InventoryFilters) {
  const notEquippedItems = items?.filter((inv) => !inv.equipped);
  const categories = filter === 'all' ? undefined : CATEGORIES_BY_FILTER[filter];

  if (!categories) return notEquippedItems;
  return notEquippedItems?.filter((inv) => categories.includes(inv.item?.category));
}

type Props = {
  items?: InventoryItem[];
};

function InventoryItems(props: { items: InventoryItem[]; onClick?: (i: InventoryItem) => void; limit: number }) {
  // Pad with placeholders so the grid always shows a full set of rows.
  const emptySlots = Math.max(props.limit - props.items.length, 0);
  const inventorySlots: (InventoryItem | { id: string })[] = [
    ...props.items,
    ...Array.from({ length: emptySlots }, (_, index) => ({ id: `empty-${index}` })),
  ];

  return (
    <div className={styles.inventoryContainer}>
      {inventorySlots.map((value) => (
        <InventoryItem
          key={value?.id}
          inventoryItem={'item' in value ? value : undefined}
          onClick={() => 'item' in value && props.onClick?.(value)}
        />
      ))}
    </div>
  );
}

/** Five to a row, three rows — the grid the panel is sized for. */
const COLUMNS = 5;
const ROWS = 3;
const PAGE_SIZE = COLUMNS * ROWS;

export function Inventory(props: Props) {
  const store = useMainStore();
  const modalStore = useModalStore();
  const [page, setPage] = useState(0);
  const filteredInventory = filterInventory(props.items ?? [], store.inventoryFilter);

  const pageCount = Math.max(Math.ceil(filteredInventory.length / PAGE_SIZE), 1);
  // A bag that shrinks under you — the last potion drunk, a filter switched —
  // must not strand the view on a page that no longer exists.
  const currentPage = Math.min(page, pageCount - 1);
  const pageItems = filteredInventory.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  useEffect(() => setPage(0), [store.inventoryFilter]);

  return (
    <div className={styles.container}>
      <ItemCategoryFilter selected={store.inventoryFilter} onClick={(option) => store.setInventoryFilter(option)} />
      <InventoryItems
        items={pageItems}
        limit={PAGE_SIZE}
        onClick={(i) => {
          modalStore.setInventoryItem({
            open: true,
            selectedItem: i,
          });
        }}
      />

      {/* Only once there is somewhere to go — a single page keeps the panel the
          height it has always been. */}
      <When value={pageCount > 1}>
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.pageButton}
            disabled={currentPage === 0}
            onClick={() => setPage(currentPage - 1)}
            aria-label="Previous page"
          >
            <FaChevronLeft size={12} />
          </button>
          <span className={styles.pageCount}>
            {currentPage + 1} / {pageCount}
          </span>
          <button
            type="button"
            className={styles.pageButton}
            disabled={currentPage >= pageCount - 1}
            onClick={() => setPage(currentPage + 1)}
            aria-label="Next page"
          >
            <FaChevronRight size={12} />
          </button>
        </div>
      </When>
    </div>
  );
}
