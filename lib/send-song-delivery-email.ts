import { Resend } from "resend";
import { render } from "@react-email/render";
import { SongDeliveryEmail } from "@/emails/SongDeliveryEmail";
import { prisma } from "@/lib/prisma";

const FROM_ORDERS = "TuneTicket Orders <onboarding@resend.dev>";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key?.trim()) return null;
  return new Resend(key);
}

export async function sendSongDeliveryEmail(ticketId: string, downloadToken: string): Promise<{
  sent: boolean;
  error?: string;
}> {
  const resend = getResend();
  if (!resend) {
    return { sent: false, error: "RESEND_API_KEY not configured." };
  }

  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket) {
    return { sent: false, error: "Ticket not found." };
  }

  const to = ticket.email?.trim().toLowerCase();
  if (!to) {
    return { sent: false, error: "No customer email on ticket." };
  }

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const downloadUrl = `${appUrl}/api/delivery/download?token=${encodeURIComponent(downloadToken)}`;
  const greetingName = ticket.customerName?.trim() || to.split("@")[0] || "there";
  const fileLabel = ticket.deliveredFileName?.trim() || "your song";

  const html = await render(
    SongDeliveryEmail({
      greetingName,
      downloadUrl,
      fileLabel,
    }),
  );

  const { error } = await resend.emails.send({
    from: FROM_ORDERS,
    to,
    subject: "Your TuneTicket song is ready — download inside",
    html,
  });

  if (error) {
    return { sent: false, error: String((error as { message?: string }).message ?? error) };
  }

  return { sent: true };
}
