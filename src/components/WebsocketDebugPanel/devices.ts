import { DevicePreset } from '@/store/devicePreview';

/**
 * The shapes worth checking, smallest first.
 *
 * The list is deliberately short and picked for where it hurts: the Fold is the
 * narrowest screen anyone browses on and is where a row of chips first wraps
 * badly, the SE is the shortest, and the Pro Max is the tallest — a layout that
 * survives all three survives the middle. The iPad is here because the frame is
 * capped at 500px wide and it is worth seeing what the letterboxing looks like.
 */
export const DEVICES: DevicePreset[] = [
  { name: 'Galaxy Fold', width: 280, height: 653, chrome: 112, safeTop: 24, safeBottom: 24 },
  { name: 'iPhone SE', width: 375, height: 667, chrome: 88, safeTop: 20, safeBottom: 0 },
  { name: 'Galaxy S8', width: 360, height: 740, chrome: 112, safeTop: 24, safeBottom: 24 },
  { name: 'iPhone 13', width: 390, height: 844, chrome: 88, safeTop: 47, safeBottom: 34 },
  { name: 'Pixel 5', width: 393, height: 851, chrome: 112, safeTop: 24, safeBottom: 24 },
  { name: 'iPhone 15 Pro Max', width: 430, height: 932, chrome: 88, safeTop: 59, safeBottom: 34 },
  { name: 'iPad mini', width: 744, height: 1133, chrome: 96, safeTop: 24, safeBottom: 20 },
];

/** Zoom levels a browser's text-size menu actually offers. */
export const TEXT_ZOOMS = [1, 1.15, 1.35, 1.5];
