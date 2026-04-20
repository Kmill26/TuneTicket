import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")?.trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Email required." }, { status: 400 });
  }

  const tickets = await prisma.ticket.findMany({
    where: { email },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      recipientName: true,
      occasion: true,
      status: true,
      genre: true,
      mood: true,
      accessToken: true,
    },
  });

  return NextResponse.json({ tickets });
}
