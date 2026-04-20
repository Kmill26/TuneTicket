import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  const body = (await req.json()) as { ticketId: string; token: string };
  const ticket = await prisma.ticket.findUnique({ where: { id: body.ticketId } });
  if (!ticket || ticket.accessToken !== body.token) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  await prisma.ticket.update({
    where: { id: ticket.id },
    data: {
      status: "SONG_DELIVERED",
      fulfillmentStatus: "DELIVERED",
    },
  });
  return NextResponse.json({ ok: true });
}
