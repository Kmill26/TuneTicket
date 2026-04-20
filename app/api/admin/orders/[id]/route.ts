import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { FulfillmentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { sendSongDeliveryEmail } from "@/lib/send-song-delivery-email";

type Params = { params: Promise<{ id: string }> };

const allowed: FulfillmentStatus[] = ["NEW", "IN_PROGRESS", "DELIVERED"];

function isValidAudioName(name: string): boolean {
  const n = name.toLowerCase();
  return n.endsWith(".wav") || n.endsWith(".mp3");
}

function isAllowedAudioUrl(url: string): boolean {
  if (!url.startsWith("https://")) return false;
  try {
    const host = new URL(url).hostname;
    return host.includes("utfs.io") || host.includes("uploadthing") || host.includes("ufs.sh");
  } catch {
    return false;
  }
}

export async function PATCH(req: Request, { params }: Params) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const body = (await req.json()) as {
    fulfillmentStatus?: string;
    audioUrl?: string;
    audioKey?: string;
    fileName?: string;
  };

  if (!body.fulfillmentStatus || !allowed.includes(body.fulfillmentStatus as FulfillmentStatus)) {
    return NextResponse.json(
      { error: "fulfillmentStatus must be NEW, IN_PROGRESS, or DELIVERED." },
      { status: 400 },
    );
  }

  const nextStatus = body.fulfillmentStatus as FulfillmentStatus;

  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (!ticket) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (ticket.fulfillmentStatus === "DELIVERED" && nextStatus !== "DELIVERED") {
    return NextResponse.json({ error: "Order is already delivered; status cannot be changed here." }, { status: 400 });
  }

  if (nextStatus === "DELIVERED") {
    if (ticket.fulfillmentStatus === "DELIVERED") {
      return NextResponse.json({ error: "Already delivered." }, { status: 400 });
    }

    const audioUrl = typeof body.audioUrl === "string" ? body.audioUrl.trim() : "";
    const audioKey = typeof body.audioKey === "string" ? body.audioKey.trim() : "";
    const fileName = typeof body.fileName === "string" ? body.fileName.trim() : "";

    if (!audioUrl || !isAllowedAudioUrl(audioUrl)) {
      return NextResponse.json(
        { error: "A valid UploadThing https audio URL is required to mark as delivered." },
        { status: 400 },
      );
    }

    if (!fileName || !isValidAudioName(fileName)) {
      return NextResponse.json({ error: "fileName must end with .wav or .mp3." }, { status: 400 });
    }

    if (!ticket.email?.trim()) {
      return NextResponse.json(
        { error: "Customer email is required on the ticket before delivery." },
        { status: 400 },
      );
    }

    const downloadToken = randomBytes(32).toString("hex");

    const updated = await prisma.ticket.update({
      where: { id },
      data: {
        fulfillmentStatus: "DELIVERED",
        status: "SONG_DELIVERED",
        deliveredAudioUrl: audioUrl,
        deliveredAudioKey: audioKey || null,
        deliveredFileName: fileName,
        deliveryDownloadToken: downloadToken,
      },
    });

    const emailResult = await sendSongDeliveryEmail(id, downloadToken);

    return NextResponse.json({
      order: {
        id: updated.id,
        fulfillmentStatus: updated.fulfillmentStatus,
        status: updated.status,
      },
      emailSent: emailResult.sent,
      emailError: emailResult.error,
    });
  }

  const updated = await prisma.ticket.update({
    where: { id },
    data: { fulfillmentStatus: nextStatus },
  });

  return NextResponse.json({
    order: {
      id: updated.id,
      fulfillmentStatus: updated.fulfillmentStatus,
    },
  });
}

export const dynamic = "force-dynamic";
