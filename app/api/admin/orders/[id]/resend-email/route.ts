import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { regeneratePromptsAndResendAdminEmail } from "@/lib/order-emails";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    select: { fulfillmentStatus: true },
  });
  if (!ticket) {
    return NextResponse.json({ ok: false, error: "Ticket not found." }, { status: 404 });
  }
  if (ticket.fulfillmentStatus === "DELIVERED") {
    return NextResponse.json({ ok: false, error: "Order is already delivered." }, { status: 400 });
  }

  const result = await regeneratePromptsAndResendAdminEmail(id);
  if (!result.sent) {
    return NextResponse.json(
      { ok: false, error: result.error ?? "Failed to re-send email." },
      { status: result.error === "Ticket not found." ? 404 : 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: `Email re-sent successfully to ${result.to ?? "ops inbox"}.`,
    to: result.to,
  });
}

export const dynamic = "force-dynamic";
