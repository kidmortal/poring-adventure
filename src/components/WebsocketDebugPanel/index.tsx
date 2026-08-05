import { useMemo, useState } from 'react';
import cn from 'classnames';
import { TbPlugConnected, TbPlugConnectedX } from 'react-icons/tb';
import { FaTrash, FaTimes } from 'react-icons/fa';

import styles from './style.module.scss';
import { useMainStore } from '@/store/main';
import { useUserStore } from '@/store/user';
import { WebsocketLogDirection, WebsocketLogEntry, useWebsocketLogStore } from '@/store/websocketLog';
import { When } from '@/components/shared/When';
import ForEach from '@/components/shared/ForEach';
import { DevTools } from './DevTools';

const FILTERS = ['all', 'out', 'ack', 'in', 'system', 'errors'] as const;
type Filter = (typeof FILTERS)[number];

const TABS = ['log', 'tools'] as const;
type Tab = (typeof TABS)[number];

const DIRECTION_LABEL: Record<WebsocketLogDirection, string> = {
  out: '↑',
  ack: '↓',
  in: '←',
  system: '•',
};

function formatTime(at: number) {
  const date = new Date(at);
  const time = date.toLocaleTimeString('en-GB', { hour12: false });
  return `${time}.${String(date.getMilliseconds()).padStart(3, '0')}`;
}

function preview(payload: unknown) {
  if (payload === undefined || payload === '') return '';
  const text = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return text.length > 90 ? `${text.slice(0, 90)}…` : text;
}

/**
 * The debug panel: a floating button that opens the frame log, and the dev
 * shortcuts that want to live in the same place — a screen you cannot normally
 * reach is as much a debugging problem as a frame you cannot read.
 *
 * Renders nothing for an ordinary player in a production build. It is not a
 * security boundary — every tool in it goes through `AdminGuard` on the server,
 * which is what makes hiding the button a matter of clutter rather than of
 * trust.
 */
export function WebsocketDebugPanel() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('log');
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number>();

  const entries = useWebsocketLogStore((s) => s.entries);
  const clear = useWebsocketLogStore((s) => s.clear);
  const websocket = useMainStore((s) => s.websocket);
  const wsAuthenticated = useMainStore((s) => s.wsAuthenticated);
  const isAdmin = useUserStore((s) => !!s.user?.admin);

  const errorCount = useMemo(() => entries.filter((e) => e.error).length, [entries]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return entries.filter((entry) => {
      if (filter === 'errors' && !entry.error) return false;
      if (filter !== 'all' && filter !== 'errors' && entry.direction !== filter) return false;
      if (!term) return true;
      return entry.event.toLowerCase().includes(term) || preview(entry.payload).toLowerCase().includes(term);
    });
  }, [entries, filter, search]);

  // Admins keep the panel in a production build: the tools that matter for
  // live operations — killing a stuck fight, reading the frames a bug report
  // describes — are needed on the server people actually play on. Everyone else
  // never renders it, and `AdminGuard` is what actually refuses the events.
  if (!import.meta.env.DEV && !isAdmin) return <></>;

  const connected = !!websocket;

  return (
    <>
      <button
        type="button"
        title="Websocket log"
        aria-label="Websocket log"
        onClick={() => setOpen(!open)}
        className={cn(styles.launcher, { [styles.offline]: !connected, [styles.launcherOpen]: open })}
      >
        {connected ? <TbPlugConnected /> : <TbPlugConnectedX />}
        <When value={errorCount > 0 && !open}>
          <span className={styles.badge}>{errorCount > 99 ? '99+' : errorCount}</span>
        </When>
      </button>

      <When value={open}>
        <div className={styles.panel}>
          <header className={styles.header}>
            <span className={cn(styles.status, { [styles.statusOffline]: !connected })}>
              {connected ? `connected · ${websocket?.id ?? '—'}` : 'disconnected'}
            </span>
            <span className={styles.auth}>{wsAuthenticated ? 'authenticated' : 'not authenticated'}</span>
            <button type="button" title="Clear log" aria-label="Clear log" onClick={clear} className={styles.headerButton}>
              <FaTrash />
            </button>
            <button
              type="button"
              title="Close"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className={styles.headerButton}
            >
              <FaTimes />
            </button>
          </header>

          <div className={styles.tabs}>
            <ForEach
              items={[...TABS]}
              render={(t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={cn(styles.tab, { [styles.tabActive]: tab === t })}
                >
                  {t}
                </button>
              )}
            />
          </div>

          <When value={tab === 'tools'}>
            <DevTools />
          </When>

          <When value={tab === 'log'}>
          <div className={styles.filters}>
            <ForEach
              items={[...FILTERS]}
              render={(f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(styles.filter, { [styles.filterActive]: filter === f })}
                >
                  {f}
                  {f === 'errors' && errorCount > 0 ? ` (${errorCount})` : ''}
                </button>
              )}
            />
          </div>

          <input
            className={styles.search}
            value={search}
            placeholder="Filter by event or payload"
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className={styles.list}>
            <When value={visible.length === 0}>
              <span className={styles.empty}>No frames recorded yet.</span>
            </When>
            <ForEach
              items={visible}
              render={(entry) => (
                <LogRow
                  key={entry.id}
                  entry={entry}
                  expanded={expanded === entry.id}
                  onToggle={() => setExpanded(expanded === entry.id ? undefined : entry.id)}
                />
              )}
            />
          </div>
          </When>
        </div>
      </When>
    </>
  );
}

type LogRowProps = {
  entry: WebsocketLogEntry;
  expanded: boolean;
  onToggle: () => void;
};

function LogRow({ entry, expanded, onToggle }: LogRowProps) {
  return (
    <div className={cn(styles.row, styles[entry.direction], { [styles.rowError]: entry.error })} onClick={onToggle}>
      <div className={styles.rowHead}>
        <span className={styles.arrow}>{DIRECTION_LABEL[entry.direction]}</span>
        <span className={styles.event}>{entry.event}</span>
        <span className={styles.time}>{formatTime(entry.at)}</span>
      </div>
      <When value={!expanded}>
        <span className={styles.preview}>{preview(entry.payload)}</span>
      </When>
      <When value={expanded}>
        <pre className={styles.payload}>{JSON.stringify(entry.payload, null, 2) ?? 'undefined'}</pre>
      </When>
    </div>
  );
}
