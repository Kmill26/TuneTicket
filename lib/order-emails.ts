import { Resend } from "resend";
import { render } from "@react-email/render";
import { OrderNotificationEmail } from "@/emails/OrderNotificationEmail";
import { CustomerThankYouEmail } from "@/emails/CustomerThankYouEmail";
import { prisma } from "@/lib/prisma";

const FROM_ORDERS = "TuneTicket Orders <onboarding@resend.dev>";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key?.trim()) return null;
  return new Resend(key);
}

function adminInbox(): string {
  return (process.env.ORDER_NOTIFICATION_EMAIL || "kedm@mac.com").trim().toLowerCase();
}

/**
 * After ticket generation (or legacy payment): notify operations inbox + send customer thank-you (if email on file).
 */
export async function sendPostPaymentEmails(ticketId: string): Promise<{
  adminSent: boolean;
  customerSent: boolean;
  reasons?: string[];
}> {
  const resend = getResend();
  const reasons: string[] = [];

  if (!resend) {
    console.warn("[order-emails] RESEND_API_KEY not set; skipping emails.");
    return { adminSent: false, customerSent: false, reasons: ["no_api_key"] };
  }

  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket) {
    return { adminSent: false, customerSent: false, reasons: ["ticket_not_found"] };
  }

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const ticketUrl = `${appUrl}/ticket/${ticket.id}?token=${encodeURIComponent(ticket.accessToken)}`;
  const paidAt = new Date();
  const paidAtLabel = paidAt.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

  const adminHtml = await render(
    OrderNotificationEmail({
      orderId: ticket.id,
      paidAtLabel,
      customerName: ticket.customerName,
      customerEmail: ticket.email ?? "",
      occasion: ticket.occasion,
      recipientName: ticket.recipientName,
      relationship: ticket.relationship,
      personality: ticket.personality,
      story: ticket.story,
      emotion: ticket.emotion,
      specificLines: ticket.specificLines,
      genre: ticket.genre,
      mood: ticket.mood,
      vocals: ticket.vocals,
      instruments: ticket.instruments,
      tempo: ticket.tempo,
      production: ticket.production,
      duration: ticket.duration,
      grokPrompt: ticket.grokPrompt,
      sunoPrompt: ticket.sunoPrompt,
      ticketUrl,
    }),
  );

  const adminTo = adminInbox();
  const { error: adminErr } = await resend.emails.send({
    from: FROM_ORDERS,
    to: adminTo,
    subject: `[TuneTicket] New order ${ticket.id.slice(0, 8)} — ${ticket.recipientName || "Song"}`,
    html: adminHtml,
  });

  if (adminErr) {
    console.error("[order-emails] Admin notification failed:", adminErr);
    reasons.push(`admin:${String((adminErr as { message?: string }).message ?? adminErr)}`);
  }

  let customerSent = false;
  const customerTo = ticket.email?.trim().toLowerCase();
  if (customerTo) {
    const thankYouHtml = await render(
      CustomerThankYouEmail({
        greetingName: ticket.customerName || ticket.email?.split("@")[0] || "",
      }),
    );

    const { error: custErr } = await resend.emails.send({
      from: FROM_ORDERS,
      to: customerTo,
      subject: "We received your TuneTicket request",
      html: thankYouHtml,
    });

    if (custErr) {
      console.error("[order-emails] Customer thank-you failed:", custErr);
      reasons.push(`customer:${String((custErr as { message?: string }).message ?? custErr)}`);
    } else {
      customerSent = true;
    }
  }

  return {
    adminSent: !adminErr,
    customerSent,
    reasons: reasons.length ? reasons : undefined,
  };
}
