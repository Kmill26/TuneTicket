import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Secure download: token maps to stored UploadThing URL; customers never see raw storage URLs in email.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token")?.trim();
  if (!token) {
    return NextResponse.json({ error: "Missing token." }, { status: 400 });
  }

  const ticket = await prisma.ticket.findFirst({
    where: { deliveryDownloadToken: token },
    select: { deliveredAudioUrl: true },
  });

  if (!ticket?.deliveredAudioUrl?.startsWith("https://")) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.redirect(ticket.deliveredAudioUrl, 302);
}

export const dynamic = "force-dynamic";
