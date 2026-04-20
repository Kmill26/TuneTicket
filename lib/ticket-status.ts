import type { TicketStatus } from "@prisma/client";

export const statusOrder: TicketStatus[] = [
  "AWAITING_PAYMENT",
  "PAYMENT_RECEIVED",
  "PROMPTS_READY",
  "SONG_DELIVERED",
];

export function statusLabel(s: TicketStatus): string {
  switch (s) {
    case "AWAITING_PAYMENT":
      return "Awaiting ticket";
    case "PAYMENT_RECEIVED":
      return "Payment received";
    case "PROMPTS_READY":
      return "Prompts ready";
    case "SONG_DELIVERED":
      return "Song delivered";
    default:
      return s;
  }
}

export function statusStepIndex(s: TicketStatus): number {
  return statusOrder.indexOf(s);
}
