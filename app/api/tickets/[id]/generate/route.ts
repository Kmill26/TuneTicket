import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPostPaymentEmails } from "@/lib/order-emails";

type Params = { params: Promise<{ id: string }> };

/**
 * Finalizes the ticket without payment: unlocks prompts, notifies ops (kedm@mac.com), optional customer thank-you.
 */
export async function POST(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = (await req.json()) as { token?: string; email?: string; customerName?: string };

    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    if (body.token !== ticket.accessToken) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    if (ticket.status !== "AWAITING_PAYMENT") {
      return NextResponse.json({ ok: true, alreadyFinalized: true });
    }

    const emailUpdate = body.email?.trim().toLowerCase();
    const nameUpdate = body.customerName?.trim();

    await prisma.ticket.update({
      where: { id },
      data: {
        status: "PROMPTS_READY",
        fulfillmentStatus: "NEW",
        ...(emailUpdate ? { email: emailUpdate } : {}),
        ...(nameUpdate ? { customerName: nameUpdate } : {}),
      },
    });

    await sendPostPaymentEmails(id);

    return NextResponse.json({ ok: true, alreadyFinalized: false });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not generate ticket." }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
