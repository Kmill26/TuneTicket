import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const orders = await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      customerName: true,
      email: true,
      recipientName: true,
      occasion: true,
      fulfillmentStatus: true,
      status: true,
      accessToken: true,
    },
  });

  return NextResponse.json({ orders });
}

export const dynamic = "force-dynamic";
