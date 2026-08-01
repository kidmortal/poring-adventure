/**
 * Internal types for components and display state.
 *
 * These describe how the app renders things and are imported explicitly.
 * Server payloads live in `src/api/types` (entities) and `src/api/dto`
 * (request payloads) and are declared globally instead.
 */

/** Colour intent of a button or action. */
export type Theme = 'primary' | 'secondary' | 'danger' | 'success' | 'gold' | 'neutral';

/** Side a floating element opens towards. */
export type Direction = 'top' | 'bottom' | 'left' | 'right';

export type Orientation = 'front' | 'back';
