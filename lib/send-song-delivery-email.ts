import { Resend } from "resend";
import { render } from "@react-email/render";
import { SongDeliveryEmail } from "@/emails/SongDeliveryEmail";
import { prisma } from "@/lib/prisma";

const FROM_ORDERS = "TuneTicket Orders <onboarding@resend.dev>";

/** Resend allows up to ~40MB per email; many providers cap lower — stay conservative for customer inboxes. */
export const MAX_DELIVERY_ATTACHMENT_BYTES = 25 * 1024 * 1024;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key?.trim()) return null;
  return new Resend(key);
}

function attachmentContentType(fileName: string): string {
  const n = fileName.toLowerCase();
  if (n.endsWith(".mp3")) return "audio/mpeg";
  if (n.endsWith(".wav")) return "audio/wav";
  return "application/octet-stream";
}

/**
 * Downloads the hosted audio file and enforces max size before attaching to email.
 */
export async function fetchAudioBufferForDelivery(
  url: string,
  maxBytes: number = MAX_DELIVERY_ATTACHMENT_BYTES,
): Promise<{ ok: true; buffer: Buffer } | { ok: false; error: string }> {
  let res: Response;
  try {
    res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(120_000),
      headers: { "User-Agent": "TuneTicket-Delivery/1.0" },
    });
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not download the audio file.",
    };
  }

  if (!res.ok) {
    return { ok: false, error: `Could not download audio (HTTP ${res.status}).` };
  }

  const cl = res.headers.get("content-length");
  if (cl) {
    const n = Number(cl);
    if (Number.isFinite(n) && n > maxBytes) {
      return {
        ok: false,
        error: `File is too large to attach (${Math.ceil(n / 1024 / 1024)} MB). Maximum is ${maxBytes / 1024 / 1024} MB. Try a shorter export or a compressed MP3.`,
      };
    }
  }

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > maxBytes) {
    return {
      ok: false,
      error: `File is too large to attach (${Math.ceil(buf.length / 1024 / 1024)} MB). Maximum is ${maxBytes / 1024 / 1024} MB.`,
    };
  }

  return { ok: true, buffer: buf };
}

export async function sendSongDeliveryEmail(
  ticketId: string,
  downloadToken: string,
  attachment: { buffer: Buffer; filename: string },
): Promise<{
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
  const fileLabel = attachment.filename.trim() || ticket.deliveredFileName?.trim() || "your song";

  const html = await render(
    SongDeliveryEmail({
      greetingName,
      downloadUrl,
      fileLabel,
      attachmentIncluded: true,
    }),
  );

  const safeName = fileLabel.includes("/") ? fileLabel.split("/").pop()! : fileLabel;

  const { error } = await resend.emails.send({
    from: FROM_ORDERS,
    to,
    subject: "Your TuneTicket song is ready — attached",
    html,
    attachments: [
      {
        filename: safeName,
        content: attachment.buffer,
        contentType: attachmentContentType(safeName),
      },
    ],
  });

  if (error) {
    return { sent: false, error: String((error as { message?: string }).message ?? error) };
  }

  return { sent: true };
}
