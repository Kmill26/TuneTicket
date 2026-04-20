import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (!ticket) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const authorized = token === ticket.accessToken;

  if (!authorized) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const locked = ticket.status === "AWAITING_PAYMENT";

  return NextResponse.json({
    ticket: {
      id: ticket.id,
      createdAt: ticket.createdAt,
      email: ticket.email,
      customerName: ticket.customerName,
      fulfillmentStatus: ticket.fulfillmentStatus,
      recipientName: ticket.recipientName,
      occasion: ticket.occasion,
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
      status: ticket.status,
      promptsLocked: locked,
    },
  });
}
