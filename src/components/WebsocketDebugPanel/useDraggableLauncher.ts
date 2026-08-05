import { useCallback, useEffect, useRef, useState } from 'react';

/** How long the button has to be held before it comes loose. */
const HOLD_MS = 1000;

/**
 * How far a finger may wander during that second and still count as holding
 * still. Without it, a hold that drifts a pixel or two — which every hold on a
 * touchscreen does — would never arm.
 */
const HOLD_TOLERANCE = 10;

const STORAGE_KEY = 'debugPanel.launcherPosition';

export type LauncherPosition = { x: number; y: number };

function clampToScreen(position: LauncherPosition, size: number): LauncherPosition {
  const margin = 4;
  return {
    x: Math.min(Math.max(position.x, margin), Math.max(window.innerWidth - size - margin, margin)),
    y: Math.min(Math.max(position.y, margin), Math.max(window.innerHeight - size - margin, margin)),
  };
}

function loadPosition(size: number): LauncherPosition {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return clampToScreen(JSON.parse(stored) as LauncherPosition, size);
  } catch {
    // A corrupt entry is not worth a broken panel; fall through to the corner.
  }
  return { x: 12, y: Math.max(window.innerHeight - size - 12, 12) };
}

/**
 * Long-press to pick the launcher up, drag, let go to drop it.
 *
 * A plain drag would fight every tap — the button's whole job is being tapped —
 * so it stays anchored until it has been held for a full second, and only then
 * follows the pointer. The hold is cancelled by moving early, which is what
 * separates "I am picking this up" from "I missed and I am scrolling".
 *
 * The drop is remembered, because a tool you have to re-place every reload is
 * one you stop moving out of the way at all.
 */
export function useDraggableLauncher(size: number) {
  const [position, setPosition] = useState(() => loadPosition(size));
  const [lifted, setLifted] = useState(false);

  const hold = useRef<number>();
  const grab = useRef({ x: 0, y: 0 });
  const origin = useRef({ x: 0, y: 0 });
  const liftedRef = useRef(false);
  /** Set when a drag has just ended, so the release does not also open the panel. */
  const dragged = useRef(false);

  const setLiftedBoth = useCallback((value: boolean) => {
    liftedRef.current = value;
    setLifted(value);
  }, []);

  const cancelHold = useCallback(() => {
    window.clearTimeout(hold.current);
    hold.current = undefined;
  }, []);

  useEffect(() => {
    function onResize() {
      setPosition((current) => clampToScreen(current, size));
    }
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.clearTimeout(hold.current);
    };
  }, [size]);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      grab.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      origin.current = { x: event.clientX, y: event.clientY };
      dragged.current = false;
      event.currentTarget.setPointerCapture(event.pointerId);

      cancelHold();
      hold.current = window.setTimeout(() => setLiftedBoth(true), HOLD_MS);
    },
    [cancelHold, setLiftedBoth],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!liftedRef.current) {
        const drift = Math.hypot(event.clientX - origin.current.x, event.clientY - origin.current.y);
        if (drift > HOLD_TOLERANCE) cancelHold();
        return;
      }

      dragged.current = true;
      setPosition(
        clampToScreen({ x: event.clientX - grab.current.x, y: event.clientY - grab.current.y }, size),
      );
    },
    [cancelHold, size],
  );

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      cancelHold();
      event.currentTarget.releasePointerCapture?.(event.pointerId);
      if (!liftedRef.current) return;

      setLiftedBoth(false);
      setPosition((current) => {
        const dropped = clampToScreen(current, size);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dropped));
        } catch {
          // Private mode, or a full quota. The move still holds for this session.
        }
        return dropped;
      });
    },
    [cancelHold, setLiftedBoth, size],
  );

  /** True when the tap that just landed was the end of a drag. Reading it clears it. */
  const consumeDrag = useCallback(() => {
    const wasDragged = dragged.current;
    dragged.current = false;
    return wasDragged;
  }, []);

  return {
    position,
    lifted,
    consumeDrag,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
  };
}
