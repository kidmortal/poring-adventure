import { Socket } from "socket.io-client";
import { asyncEmit } from "../websocketServer";

export function storeService({ websocket }: { websocket?: Socket }) {
  async function getPurchases() {
    if (!websocket) return undefined;
    return asyncEmit<UserPurchase[]>(websocket, "get_purchases", "");
  }

  async function requestRefund(args: { purchaseId: number }) {
    if (!websocket) return undefined;
    return asyncEmit<PurchaseActionResult>(websocket, "refund_purchase", args.purchaseId);
  }

  async function claimPurchase(args: { purchaseId: number }) {
    if (!websocket) return undefined;
    return asyncEmit<PurchaseActionResult>(websocket, "claim_purchase", args.purchaseId);
  }

  return {
    getPurchases,
    requestRefund,
    claimPurchase,
  };
}
