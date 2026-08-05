import { useEffect, useState } from 'react';

/** Breathing room around the simulated phone, so its edges stay visible. */
const MARGIN = 48;

/**
 * How much a box of this size has to shrink to fit the window.
 *
 * Only ever downwards: a phone smaller than the window is shown at its own
 * size, because blowing a 280px screen up to fill a monitor would flatter the
 * layout rather than test it. Returns 1 when there is nothing to fit, so a
 * caller with no preview running can use it unconditionally.
 */
export function useFitScale(box: { width: number; height: number }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!box.width || !box.height) {
      setScale(1);
      return;
    }

    function fit() {
      const room = Math.min(
        (window.innerWidth - MARGIN) / box.width,
        (window.innerHeight - MARGIN) / box.height,
      );
      setScale(Math.min(1, Number(room.toFixed(3))));
    }

    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [box.width, box.height]);

  return scale;
}
