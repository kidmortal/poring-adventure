/**
 * The market's two silver sinks, mirroring the server so the seller sees the
 * same numbers before listing that they get paid afterwards.
 *
 * Silver used to enter from every kill and leave almost nowhere, which inflates
 * prices and hurts crafted goods worst — their supply is capped by stamina and
 * cannot chase the money. A percentage cut scales with the economy on its own.
 */

/** Share of every sale burned rather than paid to the seller. */
export const SALE_TAX_RATE = 0.05;

/** Share of a listing's asking value charged up front, and never refunded. */
export const LISTING_FEE_RATE = 0.02;

/** The buyer pays the full asking price; the tax comes out of the seller's side. */
export function settleSale(args: { price: number; stacks: number }) {
  const total = args.price * args.stacks;
  const tax = Math.floor(total * SALE_TAX_RATE);
  return { total, tax, payout: total - tax };
}

/** The up-front, non-refundable cost of putting stacks on the board. */
export function listingFee(args: { price: number; stacks: number }) {
  return Math.floor(args.price * args.stacks * LISTING_FEE_RATE);
}
