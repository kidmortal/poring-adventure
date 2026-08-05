import { Socket } from 'socket.io-client';
import { useWebsocketLogStore } from '@/store/websocketLog';

/** Marks a socket we already wrapped, so a re-render cannot double-wrap `emit`. */
const ATTACHED = '__poringDevLoggerAttached';

type TaggedSocket = Socket & { [ATTACHED]?: boolean };

type EmitArgs = Parameters<Socket['emit']>;

/** Server replies carrying one of these read as a failure worth highlighting. */
function looksLikeError(payload: unknown) {
  if (!payload || typeof payload !== 'object') return false;
  const record = payload as Record<string, unknown>;
  if ('error' in record) return true;
  if (record.success === false) return true;
  return typeof record.statusCode === 'number' && record.statusCode >= 400;
}

/** One argument reads better than a one-item array in the panel. */
function collapse(args: unknown[]) {
  return args.length <= 1 ? args[0] : args;
}

/**
 * Records every frame crossing this socket into the dev log store.
 *
 * Outgoing traffic is captured by wrapping `emit` rather than by hooking each
 * service: everything funnels through `asyncEmit`, and wrapping the socket also
 * lets us pair a request with the ack the server sends back.
 *
 * Attached on every build, not only in development. Whether the panel is
 * *shown* depends on the admin flag, which does not arrive until the profile
 * does — several frames after connect, and the connection attempt is exactly
 * the part worth having a log of. Recording always and rendering selectively is
 * the only order that works; the cost is a bounded 500-frame buffer.
 */
export function attachWebsocketDevLogger(socket: Socket) {
  const tagged = socket as TaggedSocket;
  if (tagged[ATTACHED]) return;
  tagged[ATTACHED] = true;

  const log = useWebsocketLogStore.getState().append;

  socket.onAny((event: string, ...args: unknown[]) => {
    const payload = collapse(args);
    log({ direction: 'in', event, payload, error: looksLikeError(payload) });
  });

  const emit = socket.emit.bind(socket);
  socket.emit = ((event: EmitArgs[0], ...args: unknown[]) => {
    const ack = typeof args[args.length - 1] === 'function' ? (args.pop() as (...a: unknown[]) => void) : undefined;
    log({ direction: 'out', event: String(event), payload: collapse(args) });

    if (!ack) return emit(event, ...args);

    return emit(event, ...args, (...response: unknown[]) => {
      const payload = collapse(response);
      log({ direction: 'ack', event: String(event), payload, error: looksLikeError(payload) });
      ack(...response);
    });
  }) as Socket['emit'];

  // Lifecycle events never reach `onAny` — socket.io keeps them reserved.
  socket.on('connect', () => log({ direction: 'system', event: 'connect', payload: { id: socket.id } }));
  socket.on('disconnect', (reason) => log({ direction: 'system', event: 'disconnect', payload: { reason }, error: true }));
  socket.on('connect_error', (err) =>
    log({ direction: 'system', event: 'connect_error', payload: { message: err.message }, error: true }),
  );
  socket.io.on('reconnect_attempt', (attempt) =>
    log({ direction: 'system', event: 'reconnect_attempt', payload: { attempt } }),
  );
}
