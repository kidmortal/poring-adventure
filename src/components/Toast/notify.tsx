import { ReactNode } from 'react';
import { ToastOptions, TypeOptions, toast } from 'react-toastify';

import { ToastBody } from './ToastBody';
import styles from './style.module.scss';

/** How long a toast stays up, unless a caller asks for something else. */
const DEFAULT_DURATION = 2200;

/**
 * How many identical messages one toast has swallowed, keyed by the toast id.
 * Cleared when the toast goes, so the next kill starts counting from one again.
 */
const repeats = new Map<string, number>();

/**
 * The same sentence twice is the same news twice.
 *
 * Toast ids are derived from the message itself, so a repeat updates the toast
 * already on screen instead of stacking another one under it — killing four
 * packs in a row is one line reading "Monsters killed ×4", not four lines
 * covering the fight you are trying to watch. The timer restarts on each
 * repeat, because the message is only as old as the last thing that caused it.
 */
function toastIdFor(message: string, type: TypeOptions) {
  return `${type}:${message}`;
}

type NotifyOptions = {
  type?: TypeOptions;
  /** Milliseconds. `false` keeps it up until it is tapped. */
  duration?: number | false;
};

export function notify(message: string, options: NotifyOptions = {}) {
  const type = options.type ?? 'info';
  const autoClose = options.duration === undefined ? DEFAULT_DURATION : options.duration;
  const id = toastIdFor(message, type);

  if (toast.isActive(id)) {
    const count = (repeats.get(id) ?? 1) + 1;
    repeats.set(id, count);
    toast.update(id, {
      render: <ToastBody text={message} count={count} />,
      autoClose,
      type,
    });
    return;
  }

  repeats.set(id, 1);
  toast(<ToastBody text={message} count={1} />, {
    toastId: id,
    type,
    autoClose,
    onClose: () => repeats.delete(id),
  });
}

/**
 * For a toast that is not a message — the party invitation, which carries its
 * own buttons and waits to be answered. It keeps the container's compact frame
 * without the dedupe, since there is only ever one of it.
 */
export function notifyCustom(id: string, content: ReactNode, options: ToastOptions = {}) {
  // Not a pill: this one holds buttons, and a 999px radius around a card reads
  // as a mistake rather than as a style.
  toast(content, { toastId: id, autoClose: false, className: styles.custom, ...options });
}

export function dismissToast(id: string) {
  toast.dismiss(id);
}
