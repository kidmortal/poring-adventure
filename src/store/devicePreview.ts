import { create } from 'zustand';

/**
 * A phone to pretend to be. Sizes are CSS pixels, which is what the layout
 * actually sees — a device's marketing resolution is its physical pixels and
 * would be two or three times too big.
 */
export type DevicePreset = {
  name: string;
  width: number;
  height: number;
  /**
   * Height the browser's own chrome takes out of the page when it is showing.
   * This is the number that breaks layouts: `100vh` counts it as available and
   * `100dvh` does not, so a screen that fits with the bar hidden can push its
   * bottom row off when the bar slides back in.
   */
  chrome: number;
  /** Notch or status bar. */
  safeTop: number;
  /** Home indicator or gesture bar. */
  safeBottom: number;
};

interface DevicePreviewState {
  device?: DevicePreset;
  /** Whether the address bar is showing — the shorter, meaner viewport. */
  showChrome: boolean;
  /**
   * Page zoom, as a browser's own text-size setting applies it: the viewport
   * gets *narrower* in CSS pixels rather than the text simply getting bigger,
   * which is why a zoomed phone is where overflow shows up first.
   */
  textZoom: number;
  setDevice: (v?: DevicePreset) => void;
  setShowChrome: (v: boolean) => void;
  setTextZoom: (v: number) => void;
  reset: () => void;
}

export const useDevicePreviewStore = create<DevicePreviewState>()((set) => ({
  device: undefined,
  showChrome: true,
  textZoom: 1,
  setDevice: (v) => set(() => ({ device: v })),
  setShowChrome: (v) => set(() => ({ showChrome: v })),
  setTextZoom: (v) => set(() => ({ textZoom: v })),
  reset: () => set(() => ({ device: undefined, showChrome: true, textZoom: 1 })),
}));
