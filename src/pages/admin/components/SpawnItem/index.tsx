import { useEffect, useState } from 'react';
import cn from 'classnames';
import styles from './style.module.scss';

import { useMutation } from '@tanstack/react-query';
import { FaBoxOpen } from 'react-icons/fa';

import ForEach from '@/components/shared/ForEach';
import { When } from '@/components/shared/When';
import { Button } from '@/components/shared/Button';

import { useWebsocketApi } from '@/api/websocketServer';
import { useAdminStore } from '@/store/admin';
import { ITEM_QUALITY } from '@/constants';

/** How many catalogue matches to show at once — enough to pick from, not a wall. */
const MAX_RESULTS = 6;

/**
 * Puts any item straight into your own bag.
 *
 * The id is what the route takes, but nobody has the ids memorised, so the
 * catalogue is fetched once and searched by name — typing a number still works
 * and matches on the id directly.
 *
 * Quality and enhancement are here because the states worth testing are exactly
 * the ones that take an evening to reach honestly: a +5 Epic to feed a rarity
 * upgrade, a Legendary potion to check what it restores.
 */
export function SpawnItem() {
  const api = useWebsocketApi();
  const adminStore = useAdminStore();

  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number>();
  const [stack, setStack] = useState(1);
  const [quality, setQuality] = useState(1);
  const [enhancement, setEnhancement] = useState(0);

  // Fetched once — the catalogue only changes when the server is reseeded.
  useEffect(() => {
    if (adminStore.itemCatalog.length === 0) api.admin.getItemCatalog();
  }, []);

  const spawnMutation = useMutation({
    mutationFn: () => api.admin.spawnItem({ itemId: selectedId ?? 0, stack, quality, enhancement }),
  });

  const query = search.trim().toLowerCase();
  const matches = query
    ? adminStore.itemCatalog
        .filter((item) => item.name.toLowerCase().includes(query) || String(item.id) === query)
        .slice(0, MAX_RESULTS)
    : [];

  const selected = adminStore.itemCatalog.find((item) => item.id === selectedId);

  return (
    <div className={styles.container}>
      <input
        className={styles.search}
        value={search}
        placeholder="Search the catalogue by name or id"
        onChange={(event) => setSearch(event.target.value)}
      />

      <When value={!!query && matches.length === 0}>
        <span className={styles.empty}>Nothing matches “{search}”</span>
      </When>

      <div className={styles.results}>
        <ForEach
          items={matches}
          render={(item) => (
            <button
              key={item.id}
              type="button"
              className={cn(styles.result, { [styles.resultSelected]: item.id === selectedId })}
              onClick={() => {
                setSelectedId(item.id);
                setSearch('');
              }}
            >
              <span className={styles.resultId}>#{item.id}</span>
              <span className={styles.resultName}>{item.name}</span>
              <span className={styles.resultCategory}>{item.category}</span>
            </button>
          )}
        />
      </div>

      <When value={!!selected}>
        <span className={styles.selected}>
          #{selected?.id} {selected?.name}
        </span>
      </When>

      <div className={styles.fields}>
        <Field label="Stack" value={stack} min={1} onChange={setStack} />
        {/* Capped at 5 to match the server, which clamps it anyway. */}
        <Field label={ITEM_QUALITY[quality] ?? 'Quality'} value={quality} min={1} max={5} onChange={setQuality} />
        <Field label="Enhance" value={enhancement} min={0} onChange={setEnhancement} />
      </div>

      <Button
        theme="gold"
        label={
          <span className={styles.buttonLabel}>
            <FaBoxOpen /> Spawn into my bag
          </span>
        }
        disabled={!selected || spawnMutation.isPending}
        onClick={() => spawnMutation.mutate()}
      />
    </div>
  );
}

/** A labelled number, clamped — these are typed in a hurry and rarely re-read. */
function Field(props: { label: string; value: number; min: number; max?: number; onChange: (v: number) => void }) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{props.label}</span>
      <input
        className={styles.fieldInput}
        type="number"
        value={props.value}
        min={props.min}
        max={props.max}
        onChange={(event) => {
          const parsed = Number(event.target.value);
          if (Number.isNaN(parsed)) return;
          const capped = props.max === undefined ? parsed : Math.min(parsed, props.max);
          props.onChange(Math.max(capped, props.min));
        }}
      />
    </label>
  );
}
